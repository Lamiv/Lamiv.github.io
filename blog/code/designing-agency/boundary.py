"""Build the boundary: a small, runnable sketch of an agent boundary around SAP.

The agent may stage a purchase order. Release and sending need a human approval
that is bound to the exact terms that were approved. Retries use an idempotency
key, and an unknown outcome after a timeout is reconciled before anything is
sent again. Every step is written to an audit trail with both identities.

    python boundary.py

Illustrative sample for the "Designing Agency" blog series. The SAP system is a
mock; names, prices and rules are made up. Python 3.10+, standard library only.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime, timedelta

NOW = datetime(2026, 10, 25, 9, 0)
MATERIAL_TERMS = ("supplier", "material", "quantity", "price", "currency", "delivery_date")


class Denied(Exception):
    """The boundary refused an action."""


class Timeout(Exception):
    """The call may or may not have taken effect."""


# --- A mock SAP S/4HANA ----------------------------------------------------

@dataclass
class PurchaseOrder:
    number: str
    created_by: str          # the SAP identity that created it (propagated user)
    terms: dict
    version: int = 1
    status: str = "draft"    # draft -> released -> sent


class MockSAP:
    """Just enough behaviour to show the boundary: versions, release, output."""

    def __init__(self) -> None:
        self.orders: dict[str, PurchaseOrder] = {}
        self.outputs: list[tuple[str, int]] = []   # what suppliers received
        self.processed_keys: dict[str, str] = {}   # idempotency key -> result
        self.lose_next_response = False

    def create(self, user: str, terms: dict) -> PurchaseOrder:
        po = PurchaseOrder(f"45{len(self.orders) + 1:08d}", user, dict(terms))
        self.orders[po.number] = po
        return po

    def change(self, number: str, **changes) -> PurchaseOrder:
        po = self.orders[number]
        po.terms.update(changes)
        po.version += 1
        return po

    def release(self, number: str) -> None:
        self.orders[number].status = "released"

    def send(self, number: str, key: str) -> str:
        if key in self.processed_keys:              # same key: return the first result
            return self.processed_keys[key]
        po = self.orders[number]
        self.outputs.append((number, po.version))
        po.status = "sent"
        result = f"sent {number} v{po.version}"
        self.processed_keys[key] = result
        if self.lose_next_response:                 # it happened, but the reply is lost
            self.lose_next_response = False
            raise Timeout(number)
        return result

    def lookup_key(self, key: str) -> str | None:
        return self.processed_keys.get(key)


# --- The boundary ---------------------------------------------------------------

def fingerprint(po: PurchaseOrder) -> str:
    material = {k: po.terms[k] for k in MATERIAL_TERMS} | {"version": po.version}
    return hashlib.sha256(json.dumps(material, sort_keys=True).encode()).hexdigest()[:12]


@dataclass
class Approval:
    approver: str
    fingerprint: str
    terms: dict
    expires: datetime


@dataclass
class Boundary:
    sap: MockSAP
    approvers: dict[str, str]                     # requester -> approver, from configuration
    agent_may: set[str] = field(default_factory=lambda: {"stage", "change"})
    approvals: dict[str, Approval] = field(default_factory=dict)
    audit: list[str] = field(default_factory=list)

    def log(self, user: str, actor: str, action: str, detail: str) -> None:
        self.audit.append(f"{action:<9} sub={user:<7} act={actor:<10} {detail}")

    def check(self, actor: str, action: str) -> None:
        """Deterministic pre-action check: agents only stage and change drafts."""
        if actor.startswith("agent") and action not in self.agent_may:
            raise Denied(f"{actor} may not {action}: that step belongs to a person")

    # The agent's tools
    def stage(self, user: str, agent: str, terms: dict) -> PurchaseOrder:
        self.check(agent, "stage")
        po = self.sap.create(user, terms)           # executes under the user's identity
        self.log(user, agent, "stage", f"{po.number} v1 draft, price {terms['price']}")
        return po

    def change(self, user: str, agent: str, number: str, **changes) -> PurchaseOrder:
        self.check(agent, "change")
        po = self.sap.change(number, **changes)
        self.log(user, agent, "change", f"{number} v{po.version} {changes}")
        return po

    # Human steps
    def approve(self, approver: str, number: str, valid_for=timedelta(days=2)) -> None:
        po = self.sap.orders[number]
        if approver == po.created_by:
            raise Denied(f"{approver} created {number} and cannot approve it")
        if self.approvers.get(po.created_by) != approver:
            raise Denied(f"{approver} is not the configured approver for {number}")
        self.approvals[number] = Approval(approver, fingerprint(po), dict(po.terms), NOW + valid_for)
        self.log(approver, "-", "approve", f"{number} v{po.version} fingerprint {fingerprint(po)}")

    def _still_approved(self, number: str, when: datetime) -> None:
        po, appr = self.sap.orders[number], self.approvals.get(number)
        if appr is None:
            raise Denied(f"{number} has no approval")
        if when > appr.expires:
            raise Denied(f"approval for {number} expired on {appr.expires:%d %b}")
        if fingerprint(po) != appr.fingerprint:
            changed = {k: f"{appr.terms[k]} -> {po.terms[k]}"
                       for k in MATERIAL_TERMS if appr.terms[k] != po.terms[k]}
            raise Denied(f"approval covers an earlier version of {number}; changed: {changed}")

    def release(self, actor: str, number: str, when: datetime = NOW) -> None:
        self.check(actor, "release")
        self._still_approved(number, when)
        self.sap.release(number)
        self.log(actor, "-", "release", f"{number} v{self.sap.orders[number].version}")

    def send(self, actor: str, number: str, when: datetime = NOW) -> str:
        self.check(actor, "send")
        self._still_approved(number, when)
        po = self.sap.orders[number]
        key = f"send:{number}:v{po.version}"         # same order, same version, same key
        if self.sap.lookup_key(key):                 # a retry of something already done
            self.log(actor, "-", "no-op", f"{number} v{po.version} already sent; not sending twice")
            return self.sap.lookup_key(key)
        try:
            result = self.sap.send(number, key)
        except Timeout:
            self.log(actor, "-", "timeout", f"{number}: outcome unknown, reconciling before retry")
            found = self.sap.lookup_key(key)
            if found:
                self.log(actor, "-", "reconcile", f"{number}: SAP confirms it was {found.split()[0]}; not resending")
                return found
            result = self.sap.send(number, key)   # never happened: safe to send
        self.log(actor, "-", "send", result)
        return result


# --- The scenario -----------------------------------------------------------------

def attempt(label: str, fn, *args, **kwargs):
    try:
        result = fn(*args, **kwargs)
        print(f"  ok      {label}")
        return result
    except Denied as reason:
        print(f"  blocked {label}\n          reason: {reason}")


def main() -> None:
    sap = MockSAP()
    gate = Boundary(sap, approvers={"buyer": "manager"})
    terms = dict(supplier="200300", material="CARTON-A", quantity=4000, price="2.10",
                 currency="AED", delivery_date="2026-11-20")

    print("1. The agent stages a proposal for the buyer")
    po = attempt("agent stages a draft order", gate.stage, "buyer", "agent-proc", terms)

    print("2. The agent tries to go further")
    attempt("agent releases the order", gate.release, "agent-proc", po.number)

    print("3. Approval")
    attempt("buyer approves own order", gate.approve, "buyer", po.number)
    attempt("manager approves", gate.approve, "manager", po.number)

    print("4. The supplier revises the price and the agent updates the draft")
    attempt("agent changes price to 2.35", gate.change, "buyer", "agent-proc", po.number, price="2.35")
    attempt("manager releases", gate.release, "manager", po.number)

    print("5. Reapproval of the changed order")
    attempt("manager approves again", gate.approve, "manager", po.number)
    attempt("manager releases, ten days later", gate.release, "manager", po.number,
            when=NOW + timedelta(days=10))
    attempt("manager releases", gate.release, "manager", po.number)

    print("6. Sending, with a lost response")
    sap.lose_next_response = True
    attempt("output to supplier", gate.send, "manager", po.number)
    attempt("output to supplier, retried", gate.send, "manager", po.number)
    print(f"  the supplier received {len(sap.outputs)} order(s): {sap.outputs}")

    print("\nAudit trail (sub = SAP identity, act = agent)")
    for line in gate.audit:
        print("  " + line)


if __name__ == "__main__":
    main()
