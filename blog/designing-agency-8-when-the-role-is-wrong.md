---
title: When the role is wrong
subtitle: Defence in depth for agent authority, and what a risk framework is actually for
part: 8
date: 1 November 2026
summary: Designing Agency Part 8 on one page: with principal propagation SAP cannot tell the buyer from the agent; independent layers owned by different people, with instructions not a control; control tests, access reviews, two-person changes and a risk owner; assume the role will be wrong one day and test for it.
---

In Part 7's sample, the agent tried to release a purchase order and was refused. Look closely at which layer refused it. SAP would have allowed the release: the buyer may release small orders, and the agent was acting as the buyer. The refusal came from the boundary's policy, the only layer that knew an agent was asking.

That is not an accident of the sample. With principal propagation (Part 3), SAP checks the user's roles and cannot tell the person from the agent acting for them. So the question every design has to answer is: if one control is missing or misconfigured, what else stops the agent?

## Instructions are not a control

The first instinct is to tell the agent: never release orders. Do it, but do not count it as protection. A model can be argued out of its instructions. In Uchi Uchibeke's live test, social engineering succeeded against a model 74.6% of the time under a permissive policy, while attackers achieved 0% across 879 attempts when a restrictive policy was checked before every action, outside the model. [Uchibeke](https://arxiv.org/abs/2603.20953) Instructions reduce accidental attempts. Controls stop deliberate ones.

## Layers that fail independently

The aim is several layers, owned by different people and checked in different ways, so that one person's mistake does not open them all.

| Layer | Owner | What it stops | If it is misconfigured |
|---|---|---|---|
| SAP role of the executing identity | Security administration | SAP refuses the release | The layers below still apply |
| Boundary policy, checked before every call | Platform team, under version control | The call never reaches SAP | Review and control tests catch it |
| Approval workflow | Business configuration | Release needs an approval bound to the terms (Part 4) | An automatic default, unless simulated and tested |
| Detection: alerts and reconciliation | Operations or internal control | Any agent attempt at a forbidden step is flagged, allowed or not | Alerts nobody reads |
| Agent instructions | Prompt author | Most accidental attempts | Not a control |

The AI Safety Atlas explains why ownership matters. Defence in depth works when layers are genuinely independent; it weakens when they share a cause, for example when several defences *use the same underlying model with different prompts*. [AI Safety Atlas](https://ai-safety-atlas.com/chapters/v1/strategies/socio-technical-strategies) The same is true of people: three layers configured by one administrator in one afternoon are closer to one layer than three.

There is also a design choice in the first row. A dedicated technical identity for the agent lets SAP's roles restrict the agent directly, even where the buyer could release, but loses the requester's own permissions. Principal propagation keeps the requester's permissions but leaves the agent distinction to the boundary. Either way, some layer must know an agent is acting.

## Catching the administrator's mistake

Assume the role will be wrong one day, and arrange to find out first.

- **Control tests.** Every change to roles or policy runs a negative test: the agent tries each forbidden action, and the test passes only if all are refused. Part 7's sample includes one.
- **Access reviews.** List what each agent identity can effectively do, with the same SAP tools used for people: user information reports and segregation-of-duties analysis.
- **Two people for every change.** Treat agent roles and boundary policy as code. Netflix's advice for its ontology applies directly: version it, review it, test it, and let changes arrive as pull requests. [Netflix](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf)
- **Fail closed.** If the boundary cannot evaluate its policy, the action is denied. [Uchibeke](https://arxiv.org/abs/2603.20953)

## What the risk framework is for

Controls do the stopping. A risk framework makes sure the controls exist, stay correct and have an owner. Berkeley's agentic AI profile is organised around the four functions of the NIST AI Risk Management Framework: govern, map, measure and manage. [CLTC](https://cltc.berkeley.edu/agentic-ai-risk-management-standards-profile) Applied to this one risk:

1. **Map.** Record “agent releases an order without approval” in the risk register, with its causes, including “role misconfigured” and “policy missing”.
2. **Govern.** Name the risk owner, and decide who may change agent roles and boundary policy.
3. **Measure.** Test the controls, not only the agent. Control tests, access reviews and alert counts are the evidence.
4. **Manage.** Set the triggers that narrow the agent's authority (Part 6), and have the owner accept the remaining risk in writing.

The framework's real job is to turn “the administrator might get it wrong” from a surprise into an expected case, with a test that catches it.

:::risk
**Averting risk: the whole series**

| Risk | Strategy | Part |
|---|---|---|
| One vague request is read as a grant of every step | Grant authority per step | Prologue |
| The agent drifts into irreversible steps | Agents stage; people release and send | 1, 2 |
| Undo is assumed but impossible | Label actions restore, compensate or live with it | 2 |
| The agent acts with too much, or someone else's, authority | Propagate identity; narrow tools; log `sub` and `act` | 3 |
| An approval covers something nobody saw | Fingerprint the terms; check at release and sending; expire approvals | 4 |
| Inputs and memory steer the agent | Untrusted data, tiered memory, a deterministic gate | 5 |
| Autonomy outruns evidence | Shadow runs, red-teaming, triggers for narrowing | 6 |
| Retries duplicate orders | Idempotency keys and reconciliation | 7 |
| One control is wrong | Independent layers, control tests, access reviews, a risk owner | 8 |
:::

## The question this leaves open

Everything in this series checks *who* may act, *when* and *on which version*. None of it checks whether the proposal itself makes sense. Suppose the agent splits an order 50–50 between two supplier records that belong to the same parent company, under a policy that caps any supplier group at 60%. Every layer above would let it through, correctly authorised and sent exactly once. How would the system know the proposal broke purchasing policy?

That needs explicit knowledge of what a supplier, a group and a policy mean, and it is where the next series, [*Closing the Loop*](neural-symbolic-loop.html), begins.

:::question
**A question to sit with.** Pick your agent's most consequential action. List every layer that would stop it if the agent tried it today, and who owns each one. How many owners are there?
:::

## Sources

- Uchi Uchibeke, [*Before the Tool Call: Deterministic Pre-Action Authorization for Autonomous AI Agents*](https://arxiv.org/abs/2603.20953), arXiv preprint, March 2026.
- Markov Grey and Charbel-Raphaël Segerie, [*AI Safety Atlas*, Strategies chapter](https://ai-safety-atlas.com/chapters/v1/strategies/socio-technical-strategies).
- Netflix Technology Blog, [*Ontology-Driven Observability*](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf), October 2026.
- Nada Madkour and colleagues, UC Berkeley CLTC, [*Agentic AI Risk-Management Standards Profile*](https://cltc.berkeley.edu/agentic-ai-risk-management-standards-profile), February 2026.
