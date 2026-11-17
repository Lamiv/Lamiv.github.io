---
title: What exactly did the human approve?
subtitle: An approval is only meaningful if it is tied to the terms that were seen
part: 4
date: 18 October 2026
summary: Designing Agency Part 4 on one page: create, approve, release and send are separate steps; flexible workflow chooses approvers, can exclude the creator and may approve automatically if no workflow matches; bind approval to a fingerprint of the terms; an approval covers exact terms for a limited time.
---

The agent drafts an order for 4,000 cartons at 2.10 each from North Packaging. The buyer's manager approves it in the morning. By the afternoon the supplier has revised the price to 2.35, and the agent, trying to be helpful, updates the draft. Is the order still approved?

The honest answer is: it depends on configuration, and most people asked would not know. That gap is where agents create risk, because they change things faster and more often than people do.

## Create, approve, release, send

In S/4HANA these are separate steps, and an agent design should keep them separate. **Creating** a purchase order records an intention. **Approving and releasing** makes it valid, through the approval workflow. **Sending** delivers it to the supplier through output. An agent that may create should not, by that fact alone, be able to release or send.

S/4HANA's *flexible workflow* handles approval for procurement documents, including purchase orders. It is activated per document type; for purchase orders it is active by default for the standard type NB. [SAP Learning](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition-sourcing-and-procurement/setting-up-configuration-for-workflows_ccda4a49-7250-4659-a985-32a357b98596) Workflows can be automatic, one-step or multi-step, with approvers defined by role, by named user or by team, and start conditions decide which workflow applies. [SAP Learning](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition-sourcing-and-procurement/defining-workflows-in-sourcing-and-procurement_a17030df-33b7-4c0e-a8c6-31ec490618e9)

## Who approves is configured, not chosen by the agent

Approvers can come from relationships SAP already holds: the creator's manager, the person responsible for the cost centre or project on the order, or teams maintained in the Manage Teams and Responsibilities app. Custom rules for choosing recipients can be added in the Custom Logic app. [SAP Learning](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition-sourcing-and-procurement/setting-up-configuration-for-workflows_ccda4a49-7250-4659-a985-32a357b98596) That is exactly where approver choice belongs: in configuration owned by the business, not in anything the agent can influence.

Four details in SAP's material matter more once agents are involved:

- **The default can be automatic.** If none of the defined start conditions is met, the default workflow is used, and unless an approval workflow is defined, purchase orders can be approved automatically. [SAP Learning](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition-sourcing-and-procurement/defining-workflows-in-sourcing-and-procurement_a17030df-33b7-4c0e-a8c6-31ec490618e9) An agent that drafts orders shaped slightly differently from usual can fall through to that default.
- **Simulate before trusting.** The Manage Workflows for Purchase Orders app can simulate which workflow a given order would trigger, which catches incorrect selections before they reach production. [SAP Learning](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition-sourcing-and-procurement/defining-workflows-in-sourcing-and-procurement_a17030df-33b7-4c0e-a8c6-31ec490618e9)
- **Exclude the creator.** A step can exclude restricted agents, for example so that an order's creator cannot approve it. [SAP Learning](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition-sourcing-and-procurement/defining-workflows-in-sourcing-and-procurement_a17030df-33b7-4c0e-a8c6-31ec490618e9)
- **Approval can move.** In My Inbox an approver can approve, reject, suspend or forward a task, and can name a substitute for absences. [SAP Learning](https://learning.sap.com/courses/detailing-intelligent-procurement/introducing-workflows-for-sourcing-and-procurement_eae3650b-15d0-4c0e-ad85-7ad8db92db3b) Useful for people, and worth monitoring when the volume comes from agents.

## Bind the approval to what was seen

Whether a change after approval sends an order back for reapproval depends on how the system is configured, and SAP's behaviour has varied with releases and settings. Rather than rely on that, an agent design can make the binding explicit.

When an approval is requested, record a fingerprint of the *material terms*: supplier, material, quantity, price, currency, delivery date, payment terms and the document version. At release and again before output, compute the fingerprint of the order as it now stands. If they differ, the approval no longer covers the order: route it back with a clear statement of what changed. An approval should also expire: one granted a month ago for a fast-moving price should not cover today's order.

This is a narrow case of a broader argument. Uchi Uchibeke describes *pre-action authorisation*: intercepting each tool call synchronously before it executes, evaluating it against a declarative policy, returning allow, deny or escalate, and writing a signed audit record. Its default is to fail closed: if the authorisation service is unavailable, the call is denied. In a live adversarial test, social engineering succeeded against a model 74.6% of the time under a permissive policy, while a comparable population of attackers achieved 0% across 879 attempts under a restrictive one; decisions took a median of 53 milliseconds. [Uchibeke](https://arxiv.org/abs/2603.20953) The check runs outside the model, so the model cannot be talked out of it.

## The rubber stamp

None of this helps if the approver approves everything. The AI Safety Atlas describes *overreliance*: people trusting AI systems beyond their actual capabilities. [AI Safety Atlas](https://ai-safety-atlas.com/chapters/v1/risks/systemic-risks) An approver shown a polished summary from an agent is exactly the person at risk.

Design the approval to resist it. Show what changed against the last approved version and against the quotes, which sources the agent used, and whether the action can be restored, compensated or only lived with (Part 2). Safin and Balta's test for a checkpoint is useful here: is review at this step warranted unconditionally, regardless of output quality? [Safin and Balta](https://arxiv.org/abs/2605.12105) For release and sending, yes. For drafts, use escalation on low confidence instead, so reviewers see fewer and better cases.

The same applies in sales. A discount approved at 8% does not cover the 12% the agent agreed after the customer pushed back.

:::risk
**Averting risk**

| Risk | Strategy | What it still does not cover |
|---|---|---|
| Orders fall through to an automatic default | Define a default workflow deliberately; simulate representative orders | Rules nobody tests after changes |
| An order changes after approval | Fingerprint the material terms; check at release and before output; expire approvals | Terms outside the fingerprint |
| The approval check can be argued with | A deterministic check outside the model; fail closed | Policies that are wrong |
| Approvers rubber-stamp | Show changes, sources and reversibility; checkpoints only where warranted | Approver fatigue at high volume |
:::

:::question
**A question to sit with.** If a released order's price changed tomorrow, would your system send it back for approval? Have you tested it?
:::

## Sources

- SAP Learning, [*Defining Workflows in Sourcing and Procurement*](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition-sourcing-and-procurement/defining-workflows-in-sourcing-and-procurement_a17030df-33b7-4c0e-a8c6-31ec490618e9), [*Setting up Configuration for Workflows*](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition-sourcing-and-procurement/setting-up-configuration-for-workflows_ccda4a49-7250-4659-a985-32a357b98596) and [*Introducing Flexible Workflows for Sourcing and Procurement*](https://learning.sap.com/courses/detailing-intelligent-procurement/introducing-workflows-for-sourcing-and-procurement_eae3650b-15d0-4c0e-ad85-7ad8db92db3b).
- Uchi Uchibeke, [*Before the Tool Call: Deterministic Pre-Action Authorization for Autonomous AI Agents*](https://arxiv.org/abs/2603.20953), arXiv preprint, March 2026.
- Markov Grey and Charbel-Raphaël Segerie, [*AI Safety Atlas*, Risks chapter](https://ai-safety-atlas.com/chapters/v1/risks/systemic-risks).
- Damir Safin and Dian Balta, [*Autonomy and Agency in Agentic AI*](https://arxiv.org/abs/2605.12105), arXiv preprint, May 2026.
