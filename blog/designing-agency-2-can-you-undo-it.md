---
title: Can you undo what it just did?
subtitle: Restoring, compensating and living with it are three different promises
part: 2
date: 11 October 2026
summary: Designing Agency Part 2 on one page: three kinds of undo (restore, compensate, live with it); design moves including write staging, compensation that can fail, and idempotent steps; label every action and show the label to the approver.
---

“Can we undo it?” is the question every approval process quietly depends on. People sign off more easily when they believe a mistake can be reversed. With agents acting at machine speed, it is worth being precise about what reversing means, because there are three quite different answers.

## Restore: as if it never happened

Some actions can be undone completely. A purchase requisition the agent created can be changed, rescheduled or deleted at almost any time. A draft purchase order that nobody has approved is the same: discard it, and the world is as it was.

Safin and Balta make restorability a design tactic. *Write staging* puts a draft or pending layer between an agent's action and its authoritative commit, turning an otherwise irreversible write into a reversible one until the staged output is explicitly promoted. They add a condition that matters for any system of record: it applies only where the system of record supports a two-phase approach of draft first, commit later. [Safin and Balta](https://arxiv.org/abs/2605.12105)

## Compensate: a new action that offsets the old one

Once an order is released, others may act on it. A planner sees the incoming quantity and stops expediting an alternative. A warehouse books dock time. Cancelling the order does not reach back and undo those decisions; it adds a new event that has to be handled, and the people who acted on the first one have to be told.

Microsoft's architecture guidance describes this as a *compensating transaction*: work that undoes the effects of completed steps. It warns against thinking you can simply restore the original state, because other activity may have changed the data in the meantime, and *it can be more complex to undo a step than to restore the original state*, which often needs business-specific rules. Its own example: cancelling a flight reservation might not entitle the customer to a full refund. [Microsoft](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction)

Two further points from the same guidance belong in any agent design. Compensating transactions *can fail*, so the system must record progress and be able to resume. And because a step may run more than once when retried, each step should be idempotent: running it twice must have the same effect as running it once. [Microsoft](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction) Part 7 returns to that when the agent's retry meets a timeout.

## Live with it: effects outside your systems

When the purchasing system sends a released order to the supplier, the most important effects leave the company. The supplier may buy raw material, reserve capacity or turn down another customer's order. You can cancel, but you cannot unsend. What you have then is a commercial conversation, not a database operation, and its cost depends on the contract and the relationship.

Sales has the same edge. A quotation still in draft can be deleted. One sent to a customer can be withdrawn or revised, but the customer has seen the price, and that shapes the next negotiation whatever the system says.

The AI Safety Atlas makes the general point about irreversibility: mistakes with permanent consequences are categorically different, because there is no chance to learn from them and correct course. [AI Safety Atlas](https://ai-safety-atlas.com/chapters/v1/risks/risk-decomposition) Enterprise mistakes are rarely permanent in that sense, but the logic scales down. An action you cannot restore deserves more care before it happens than one you can.

## Who decides, and what is decided

Safin and Balta's distinction from the prologue does the work here: *whether a human must approve an action is determined by the autonomy design; whether the action can be undone is a property of the action itself.* [Safin and Balta](https://arxiv.org/abs/2605.12105) You cannot make sending an order reversible by approving it more carefully. You can only decide who sends it and when.

| Action | Kind of undo | What undoing involves |
|---|---|---|
| Requisition, unapproved draft order | Restore | Change or delete; nobody outside has seen it |
| Released order, not yet sent | Compensate | Reset or cancel; tell people who planned around it |
| Order sent to the supplier | Live with it | Cancel or renegotiate; costs set by contract and goodwill |
| Infrastructure change with a tested rollback | Restore | Roll back; check nothing downstream read the new state |
| Data migration that rewrote records in place | Compensate | Repair from backups or logs; reconcile what others changed since |
| Payment already sent to a bank | Live with it | Request a recall; recovery depends on the counterparty |

:::risk
**Averting risk**

| Risk | Required property | Possible mechanisms | Still not covered |
|---|---|---|---|
| Approvers assume everything can be undone | Each action's reversibility is known before it is approved | Label actions restore, compensate or live with it, and show the label to the approver | Labels that drift from reality |
| An irreversible step happens by accident | Consequential writes stay reversible until explicitly promoted | Draft states, pending records, change requests; release and output reserved for people | Systems with no draft state |
| A cancellation leaves others acting on old information | Compensation reaches everyone who acted on the original | A designed compensation process: notify, record progress, resume | People outside the system who already acted |
| Undo steps are retried and double up | Repeating a step has the same effect as running it once | Idempotent operations, request keys, status checks before retrying | Side effects nobody modelled |
:::

:::question
**A question to sit with.** For the last costly mistake in your purchasing or sales process, which of the three was it: restored, compensated, or lived with? Was that known before the step was taken?
:::

Part 3 turns from what an action does to whose authority it uses.

## Sources

- Damir Safin and Dian Balta, [*Autonomy and Agency in Agentic AI: Architectural Tactics for Regulated Contexts*](https://arxiv.org/abs/2605.12105), arXiv preprint, May 2026.
- Microsoft, [*Compensating Transaction pattern*](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction), Azure Architecture Center.
- Markov Grey and Charbel-Raphaël Segerie, [*AI Safety Atlas*, Risks chapter](https://ai-safety-atlas.com/chapters/v1/risks/risk-decomposition).
