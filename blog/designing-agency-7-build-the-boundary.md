---
title: Build the boundary
subtitle: A small, runnable boundary around an agent that works with SAP
part: 7
code: designing-agency
date: 25 October 2026
---

Six parts of argument come down to a few rules that can be written as code. This part builds them as a small Python program, around a mock of SAP S/4HANA, and runs one purchase order through every failure case the series has named. It uses only the standard library. Every file is in the *Code for this part* panel above, to read or download.

```text
python boundary.py
```

## Who does what

| Party | In the sample | What it may do |
|---|---|---|
| Requester | `buyer` | Ask for the order; its identity is the one SAP executes under |
| Agent | `agent-proc` | Stage and change draft orders, nothing else |
| Approver | `manager`, from configuration | Approve a specific version of the order |
| The boundary | A gate in front of SAP | Check every action before it reaches SAP, and log it |

The mock SAP keeps a version number on each order, records what was sent to suppliers, and can lose a response after the action has taken effect, which is the case that causes duplicates in real systems.

## Rule 1: the agent stages, people commit

Every call passes a deterministic check outside the model. Agents may stage and change; release and sending belong to people (Parts 1 and 2).

```python
def check(self, actor, action):
    if actor.startswith("agent") and action not in self.agent_may:
        self.alerts.append(f"{actor} attempted {action}")   # detect, not only prevent
        raise Denied(f"boundary policy: {actor} may not {action}")
```

The draft is created under the buyer's identity, as principal propagation would do (Part 3), and the audit line records both: `sub=buyer act=agent-proc`.

## Rule 2: the approver is configured, and is not the creator

The approver comes from configuration, not from anything the agent says, and the creator cannot approve their own order, as SAP's flexible workflow can enforce by excluding restricted agents (Part 4).

## Rule 3: an approval covers exact terms, for a limited time

When the manager approves, the boundary stores a fingerprint of the material terms (supplier, material, quantity, price, currency, delivery date) and the version. At release and again before sending, it recomputes the fingerprint. Any difference, or an expired approval, blocks the step and says what changed.

```python
def fingerprint(po):
    material = {k: po.terms[k] for k in MATERIAL_TERMS} | {"version": po.version}
    return hashlib.sha256(json.dumps(material, sort_keys=True).encode()).hexdigest()[:12]
```

## Rule 4: a retry must not create a second order

The IETF's draft standard for an `Idempotency-Key` HTTP header describes the mechanism: the client sends a unique key with a request, so that the server can recognise a retry of the same request. If a key is reused with a different payload, the server should reject it; if a retry arrives while the original is still being processed, it should answer with a conflict. [IETF](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header)

The sample derives the key from the order and its version. When a call times out, the outcome is unknown: the order may or may not have gone. Instead of sending again, the boundary first asks SAP whether that key was already processed. Microsoft's guidance makes the same point about recovery in general: a step may run more than once when retried, so design each step as an idempotent command. [Microsoft](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction)

## Running it

```text
1. The agent stages a proposal for the buyer
  ok      agent stages a draft order
2. The agent tries to go further
  (SAP itself would allow the buyer to release: True)
  blocked agent releases the order as the buyer
          reason: boundary policy: agent-proc may not release
3. Approval
  blocked buyer approves own order
          reason: buyer created 4500000001 and cannot approve it
  ok      manager approves
4. The supplier revises the price and the agent updates the draft
  ok      agent changes price to 2.35
  blocked manager releases
          reason: approval covers an earlier version; changed: price 2.10 -> 2.35
5. Reapproval of the changed order
  ok      manager approves again
  blocked manager releases, ten days later
          reason: approval for 4500000001 expired on 27 Oct
  ok      manager releases
6. Sending, with a lost response
  ok      output to supplier
  ok      output to supplier, retried
  the supplier received 1 order(s): [('4500000001', 2)]
7. Control test: forbidden actions must be refused
  passed

Alerts for review: ['agent-proc attempted release']
```

Reading it step by step:

1. The agent stages a draft under the buyer's identity.
2. It tries to release the order. Note the line above the refusal: SAP *would* have allowed it, because the buyer may release small orders and the agent acts as the buyer. The refusal comes from the boundary's policy, the one layer that knows an agent is asking. Part 8 is about exactly this.
3. The buyer cannot approve their own order; the configured manager can.
4. The supplier revises the price and the agent updates the draft. The old approval no longer covers it, and the block says what changed.
5. A fresh approval covers the new version. A release after the approval has expired is refused; a timely one goes through.
6. The first send takes effect but its response is lost. The boundary reconciles with SAP before retrying, and the retry does nothing. The supplier receives one order, not two.
7. A control test tries every forbidden action as the agent and passes only if each is refused. Run on every change to roles or policy, it catches a widened permission before production.

The refused attempt also raises an alert, and the audit trail records every step with `sub`, the SAP identity, and `act`, the agent where one acted: enough to answer the auditor's question from Part 3.

## What production would add

This is teaching code. A real boundary would use SAP's own workflow for approver choice and release, principal propagation for the executing identity, durable storage for approvals and keys, signed audit records, and monitoring with the triggers from Part 6. The rules would stay the same.

:::risk
**Averting risk**

| Risk | Strategy | What it still does not cover |
|---|---|---|
| The agent releases or sends | A policy check in front of SAP that knows an agent is asking | A policy that is itself wrong (Part 8) |
| A changed order goes out on an old approval | Fingerprint the material terms; check at release and before sending; expire approvals | Terms outside the fingerprint |
| A retry duplicates an order | Idempotency keys; reconcile after a timeout before retrying | Systems with no way to look a request up |
| A permission is widened by mistake | A control test on every change to roles or policy | Actions the test does not list |
:::

:::question
**A question to sit with.** Which of the four rules does your current agent design enforce outside the model, and which depend on the model behaving well?
:::

The sample's step 2 deserves a closer look. If the boundary's policy were missing, or SAP's role were wrong, what else would stop the agent? Part 8 takes that question on.

## Sources

- Jayadeba Jena and Sanjay Dalal, [*The Idempotency-Key HTTP Header Field*](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header), IETF Internet-Draft, version 08, October 2026.
- Microsoft, [*Compensating Transaction pattern*](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction), Azure Architecture Center.
