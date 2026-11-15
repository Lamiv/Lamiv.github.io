---
title: Choose the action before the agent
subtitle: SAP has automated procurement steps for decades. The question is which steps to hand to an agent, not whether to automate
part: 1
date: 4 October 2026
---

Long before anyone spoke of AI agents, SAP was creating purchase requisitions without asking anyone. In reorder point planning, when the stock of a material falls below a predefined level, a replenishment is triggered. [SAP Learning](https://learning.sap.com/courses/exploring-production-planning-in-sap-s-4hana/understanding-mrp-in-sap-s-4hana) A material requirements planning run can create purchase requisitions automatically instead of anyone entering them, given the right configuration and material master data. [SAP Learning](https://learning.sap.com/courses/business-processes-in-sap-s-4hana-sourcing-procurement/running-materials-requirements-planning)

Nobody loses sleep over this, and SAP's own course material says why: planned orders and purchase requisitions are *internal planning elements that can be changed, rescheduled, or deleted at almost any time*. Delivery schedule lines, by contrast, are *fixed elements with a binding character*. [SAP Learning](https://learning.sap.com/courses/business-processes-in-sap-s-4hana-sourcing-procurement/running-materials-requirements-planning)

That distinction, between proposals that can still change and commitments that bind, is the right place to start with agents. The question is not whether an agent should act. It is which actions it should take, and which stay with people.

## The ladder of a purchase

| Step | Who acts | What it changes | Can it be undone? | Sensible autonomy |
|---|---|---|---|---|
| 1. Requisition from reorder point or planning run | SAP, by configuration | An internal proposal | Yes: change or delete | Already automatic |
| 2. Collect quotes, compare suppliers, check contract terms and price history | Agent | Nothing; information only | Nothing to undo | Autonomous |
| 3. Negotiate within a written brief | Agent | Messages to outsiders | Words cannot be unsent, but nothing binds | Bounded |
| 4. Draft the purchase order with sources and reasons | Agent | A draft that anyone can change | Yes: discard | Autonomous, draft only |
| 5. Approve and release | A person chosen by workflow | The order becomes valid | Partly | Human |
| 6. Send to the supplier | SAP output, after release | A commitment outside the company | No: only compensate | Never the agent's decision |

Steps 1, 2 and 4 are on the safe side of SAP's own line: they create information or proposals that can be changed. Steps 5 and 6 are on the other side. Step 3 is the one that needs the most thought.

## Five questions for each action

To place any action on the ladder, ask five questions.

- **How much is at stake?** Transaction value is the obvious one, but not the only one.
- **How far does a mistake spread?** A wrong requisition affects one material. A wrong order to a sole supplier can stop a line.
- **How quickly would anyone notice?** An error caught in an approval queue costs a minute. One found at goods receipt costs weeks.
- **What do many small actions add up to?** A hundred autonomous requisitions under every individual limit can still be one large commitment. Limits need to apply across actions, per supplier and per period, not only to each action.
- **What does waiting cost?** In procurement, usually little: a draft in a queue keeps every option open.

## Negotiation: the step in the middle

An agent negotiating with suppliers creates nothing in SAP, yet it changes things that matter: relationships, expectations and what a supplier believes was agreed. That is why it needs a written brief: target price, walk-away point, what it may disclose, and a plain rule that it cannot accept, commit or sign. Every message should be logged against the requisition it relates to. The brief turns negotiation from open-ended agency into bounded agency.

Safin and Balta call these moves *tool fencing*, which limits a required tool to the operations and targets the task warrants, and *write staging*, which puts a draft or pending layer between an agent's action and its authoritative commit, until the staged output is explicitly promoted. [Safin and Balta](https://arxiv.org/abs/2605.12105)

## Sales: when waiting has a price

Sales looks different at first. If a customer asks for a quotation and the reply takes two days, the customer may go elsewhere. Waiting has a cost of its own, and that is an argument for speed.

It is not an argument for removing the decision. The agent can assemble the quotation in minutes: prices, availability, delivery dates and the margin effect of any discount. Committing a discount, a delivery date or credit terms is the same kind of step as sending a purchase order: a promise to someone outside the company. The cost of waiting justifies a faster approval path, with the right approver, a deadline and an escalation route. It does not justify skipping one.

## Proportional checks

Researchers at Luiss University propose classifying agent actions into risk tiers: Green for low-risk retrieval, Yellow for monitored operations, Red for high-consequence actions. Green actions proceed on their own; Red actions require human approval or an explicit justification that links the action back to the original request. [Piccardo, Italiano and Martino](https://ceur-ws.org/Vol-4198/paper7.pdf) On the ladder above, steps 2 and 4 are Green, step 3 is Yellow, and steps 5 and 6 are Red.

:::risk
**Averting risk**

| Risk | Strategy | What it still does not cover |
|---|---|---|
| The agent overcommits while negotiating | A written brief; no ability to accept or commit; every message logged | A supplier who treats the agent's words as binding |
| Many small actions add up to a large one | Limits across actions, per supplier and per period | Limits set too high |
| A proposal never reaches a decision | Workflow deadlines and escalation | A rubber-stamp approver (Part 4) |
| The agent drifts into irreversible steps | No release or output authorisation in the agent's role | Approvers who hold very broad rights |
:::

:::question
**A question to sit with.** Which step in your purchasing or sales process would you be comfortable automating tomorrow, and which one would you never automate? Is the line between them where SAP already draws it, between proposals and commitments?
:::

Part 2 takes the “can it be undone?” column and asks what undoing actually means.

## Sources

- SAP Learning, [*Understanding MRP in SAP S/4HANA*](https://learning.sap.com/courses/exploring-production-planning-in-sap-s-4hana/understanding-mrp-in-sap-s-4hana), Exploring Production Planning in SAP S/4HANA.
- SAP Learning, [*Running Materials Requirements Planning*](https://learning.sap.com/courses/business-processes-in-sap-s-4hana-sourcing-procurement/running-materials-requirements-planning), Business Processes in SAP S/4HANA Sourcing and Procurement.
- Damir Safin and Dian Balta, [*Autonomy and Agency in Agentic AI: Architectural Tactics for Regulated Contexts*](https://arxiv.org/abs/2605.12105), arXiv preprint, May 2026.
- Giorgio Piccardo, Giuseppe F. Italiano and Alessio Martino, [*The Agentic Kill Chain: A Cognitive Threat Framework for Autonomous Agent Ecosystems*](https://ceur-ws.org/Vol-4198/paper7.pdf), CEUR Workshop Proceedings, Vol. 4198.
