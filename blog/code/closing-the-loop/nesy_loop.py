"""A neural-symbolic loop in a LangGraph workflow.

A proposer (the neural part) suggests how to split a purchase order between
suppliers. A checker (the symbolic part) grounds the proposal in an ontology,
validates it with SHACL, and either sends reasons back or lets it through to a
release gate, which only releases an approved order.

    python nesy_loop.py          # scripted proposer, runs offline
    python nesy_loop.py --live   # Claude proposes (needs ANTHROPIC_API_KEY)

Illustrative sample for the "Closing the Loop" blog series; not production code.
"""

from __future__ import annotations

import argparse
import itertools
from pathlib import Path
from typing import TypedDict

from langgraph.graph import END, START, StateGraph
from pydantic import BaseModel, Field
from pyshacl import validate
from rdflib import RDF, RDFS, Graph, Literal, Namespace, URIRef
from rdflib.namespace import SH, XSD

HERE = Path(__file__).parent
EX = Namespace("https://example.org/proc#")
ORDER = EX.PO4500
MAX_ATTEMPTS = 3

KNOWLEDGE = Graph().parse(HERE / "procurement.ttl")
SHAPES = Graph().parse(HERE / "shapes.ttl")

QUOTES = """\
Q-17  North Packaging LLC (SAP 100100): 15% off list if it receives at least 50% of the volume.
Q-18  North Packaging FZE (SAP 100200): 12% off list on any volume.
Q-19  East Containers LLC (SAP 200300): 8% off list on any volume."""


# --- The hand-off: a typed proposal, not a paragraph ------------------------

class Line(BaseModel):
    supplier_id: str = Field(description="SAP supplier ID, e.g. 100100")
    share: float = Field(description="Fraction of the order, between 0 and 1")
    quote_ref: str = Field(description="Quote the figures came from, e.g. Q-17")


class Proposal(BaseModel):
    lines: list[Line]
    rationale: str


class State(TypedDict, total=False):
    proposal: Proposal
    violations: list[str]
    attempts: int
    outcome: str


# --- Neural side: proposers --------------------------------------------------

class ScriptedProposer:
    """Stands in for a model so the sample runs offline. It replays three
    plausible attempts: too concentrated, split across one group, compliant."""

    def __init__(self) -> None:
        self._attempts = itertools.cycle([
            Proposal(rationale="Take the 15% discount on most of the volume.",
                     lines=[Line(supplier_id="100100", share=0.8, quote_ref="Q-17"),
                            Line(supplier_id="200300", share=0.2, quote_ref="Q-19")]),
            Proposal(rationale="Split evenly between the two cheapest suppliers.",
                     lines=[Line(supplier_id="100100", share=0.5, quote_ref="Q-17"),
                            Line(supplier_id="100200", share=0.5, quote_ref="Q-18")]),
            Proposal(rationale="Keep North at the cap and still earn the 15% tier.",
                     lines=[Line(supplier_id="100100", share=0.6, quote_ref="Q-17"),
                            Line(supplier_id="200300", share=0.4, quote_ref="Q-19")]),
        ])

    def __call__(self, violations: list[str]) -> Proposal:
        return next(self._attempts)


class ClaudeProposer:
    """Asks Claude for a proposal in the Proposal schema (structured output)."""

    def __init__(self, model: str = "claude-opus-5-5") -> None:
        import anthropic  # imported here so the offline run does not need it

        self.client = anthropic.Anthropic()
        self.model = model

    def __call__(self, violations: list[str]) -> Proposal:
        prompt = (
            "Split purchase order PO4500 between suppliers to get the best price.\n\n"
            f"Quotes:\n{QUOTES}\n"
        )
        if violations:
            prompt += ("\nYour last proposal was rejected by the policy check:\n- "
                       + "\n- ".join(violations) + "\nRevise it.")
        response = self.client.beta.messages.parse(
            model=self.model,
            max_tokens=16000,
            output_config={"effort": "low"},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",  # re-run on another model if this one declines
            messages=[{"role": "user", "content": prompt}],
            output_format=Proposal,
        )
        if response.stop_reason == "refusal" or response.parsed_output is None:
            raise RuntimeError(f"No proposal returned (stop_reason={response.stop_reason})")
        return response.parsed_output


# --- Symbolic side: grounding and checking -----------------------------------

def ground(proposal: Proposal) -> tuple[Graph, list[str]]:
    """Turn the proposal into RDF statements about identified entities."""
    g = Graph()
    problems = []
    for i, line in enumerate(proposal.lines):
        supplier = KNOWLEDGE.value(predicate=EX.sapId, object=Literal(line.supplier_id))
        if supplier is None:
            problems.append(f"Unknown SAP supplier ID {line.supplier_id}.")
            continue
        node = URIRef(f"{ORDER}/line/{i}")
        g.add((ORDER, EX.hasLine, node))
        g.add((node, RDF.type, EX.AllocationLine))
        g.add((node, EX.supplier, supplier))
        g.add((node, EX.share, Literal(str(line.share), datatype=XSD.decimal)))
        g.add((node, EX.quoteRef, Literal(line.quote_ref)))
    return g, problems


def label(term) -> str:
    return str(KNOWLEDGE.value(term, RDFS.label) or term)


def check(proposal: Proposal) -> list[str]:
    """Validate the grounded proposal against the shapes; return the reasons."""
    statements, problems = ground(proposal)
    conforms, report, _ = validate(KNOWLEDGE + statements, shacl_graph=SHAPES,
                                   inference="rdfs", advanced=True)
    if not conforms:
        for result in report.subjects(RDF.type, SH.ValidationResult):
            message = str(report.value(result, SH.resultMessage))
            # Make IRIs readable in the reasons sent back to the model.
            for term in KNOWLEDGE.subjects(RDF.type, EX.CorporateGroup):
                message = message.replace(str(term), label(term))
            problems.append(message)
    return sorted(set(problems))


# --- The loop as a LangGraph workflow -------------------------------------------

def build_graph(proposer):
    def propose(state: State) -> State:
        proposal = proposer(state.get("violations", []))
        return {"proposal": proposal, "attempts": state.get("attempts", 0) + 1}

    def verify(state: State) -> State:
        return {"violations": check(state["proposal"])}

    def release_gate(state: State) -> State:
        status = str(KNOWLEDGE.value(ORDER, EX.approvalStatus))
        if status != "approved":
            return {"outcome": f"Compliant draft routed for approval (status: {status}); nothing released."}
        return {"outcome": "Order released."}

    def escalate(state: State) -> State:
        return {"outcome": "No compliant proposal; handed to a buyer with the reasons."}

    def route(state: State) -> str:
        if not state["violations"]:
            return "release_gate"
        return "escalate" if state["attempts"] >= MAX_ATTEMPTS else "propose"

    graph = StateGraph(State)
    graph.add_node("propose", propose)
    graph.add_node("verify", verify)
    graph.add_node("release_gate", release_gate)
    graph.add_node("escalate", escalate)
    graph.add_edge(START, "propose")
    graph.add_edge("propose", "verify")
    graph.add_conditional_edges("verify", route, ["propose", "release_gate", "escalate"])
    graph.add_edge("release_gate", END)
    graph.add_edge("escalate", END)
    return graph.compile()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--live", action="store_true", help="use Claude as the proposer")
    args = parser.parse_args()

    app = build_graph(ClaudeProposer() if args.live else ScriptedProposer())
    for step in app.stream({}, stream_mode="updates"):
        for node, update in step.items():
            if node == "propose":
                p = update["proposal"]
                split = ", ".join(f"{l.supplier_id}: {l.share:.0%}" for l in p.lines)
                print(f"\n[attempt {update['attempts']}] proposes {split}\n  why: {p.rationale}")
            elif node == "verify":
                print("  check: " + ("passes" if not update["violations"] else "fails"))
                for v in update["violations"]:
                    print(f"    - {v}")
            else:
                print(f"\n{update['outcome']}")


if __name__ == "__main__":
    main()
