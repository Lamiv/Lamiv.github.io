---
title: What are we giving the agent permission to do?
subtitle: Agency, autonomy, authorisation and accountability are four different questions
part: 0
date: 4 October 2026
---

A buyer types six words into an assistant: “Take care of this order, please.” It sounds like one instruction. It is really five or six separate grants of authority, and most of the trouble with AI agents in the enterprise comes from treating them as one.

## One request, six steps

Follow the order through. The agent reads three supplier quotes and the contract history. It compares prices and terms. It drafts a purchase order in SAP S/4HANA. Someone approves it. The order is released. SAP sends it to the supplier, who starts planning production around it.

Each step asks for something different. Reading quotes needs access to information. Drafting needs permission to create a record that anyone can still change. Approving needs a person with the right to commit the company's money. Sending needs nothing more than a released order, and once it has happened, a supplier outside the company is acting on it.

“Take care of this” does not say which of these the buyer meant to hand over. The system has to.

## Four words that are often blurred

**Agency** is what the agent can perceive and affect: the data it can read and the tools it can use. Damir Safin and Dian Balta of fortiss grade it in five levels, from reasoning over text it is given (L1), through read-only access to outside systems (L3), to writes that are cheap to undo, such as drafts (L4), and writes that are costly to undo, such as final submissions and payments (L5). [Safin and Balta](https://arxiv.org/abs/2605.12105)

**Autonomy** is how much happens without a person. Their five levels run from an *operator*, where a human commands each sub-task, to an *approver*, where the agent executes but pauses for explicit sign-off before consequential actions, to an *observer*, where it runs on its own and people monitor and can intervene. [Safin and Balta](https://arxiv.org/abs/2605.12105)

**Authorisation** is what the agent is permitted to do, and on whose behalf. In S/4HANA that is ultimately a question of roles and the identity the system executes under, which Part 3 takes apart. UC Berkeley's agentic AI risk profile puts it simply: apply the principle of least privilege when granting agents access. [CLTC](https://cltc.berkeley.edu/agentic-ai-risk-management-standards-profile)

**Accountability** is who answers for the outcome. The same profile lists clear role definitions, intervention points, escalation pathways and shutdown mechanisms as levers of human control and accountability. [CLTC](https://cltc.berkeley.edu/agentic-ai-risk-management-standards-profile)

Safin and Balta make one distinction sharper than any other: *whether a human must approve an action is determined by the autonomy design; whether the action can be undone is a property of the action itself.* [Safin and Balta](https://arxiv.org/abs/2605.12105) You choose the first. You inherit the second.

## Think freely, act narrowly

The useful consequence is that the four can be set independently. An agent can have wide freedom to read, compare and propose while its authority to commit is narrow. Safin and Balta describe an *autonomous monitor*: high autonomy, but read-only agency, so it cannot alter any system of record and the risk of a consequential wrong action is minimised. They also describe the opposite, a *supertool*: powerful, often irreversible capabilities, deliberately kept at low autonomy so a person orchestrates every use. [Safin and Balta](https://arxiv.org/abs/2605.12105)

For the buyer's order, that suggests a shape. Let the agent roam through quotes, history and contract terms. Let it draft. Keep approval, release and sending where accountability already lives.

## Three ways it goes wrong

The AI Safety Atlas sorts AI risks by cause: *misuse*, where people use a system to cause harm; *misalignment*, where a system pursues goals other than the ones intended; and *systemic* risks that emerge from many interactions, with overlap between all three. [AI Safety Atlas](https://ai-safety-atlas.com/chapters/v1/risks/risk-decomposition)

In procurement they look ordinary. Misuse is a supplier's email that steers the agent. Misalignment is an agent that optimises the price and ignores the cap on supplier concentration. Systemic risk is an organisation that slowly stops checking what its agents propose. This series is about designing the boundary so that each of these is caught by something other than luck.

## The series

1. **Choose the action before the agent**: which steps can be automatic, which bounded, which human.
2. **Can you undo what it just did?** Restoring, compensating and living with it.
3. **Whose authority is it acting on?** Requester, agent, SAP identity and approver.
4. **What exactly did the human approve?** Binding approval to the terms that were seen.
5. **When the agent's inputs turn against it**: injected instructions and poisoned memory.
6. **How does an agent earn more autonomy?** Evidence for widening authority, and triggers for narrowing it.
7. **Build the boundary**: a small working example.

:::risk
**Averting risk**

| Risk | Strategy | What it still does not cover |
|---|---|---|
| One vague request is read as a grant of every step | Name each step and grant authority per step | Steps nobody listed |
| The agent can do more than the task needs | Least privilege: tools and data matched to the task | Broad rights held by the person it acts for |
| Nobody owns the outcome | Named roles, intervention points, escalation and shutdown | Owners who never look |
:::

:::question
**A question to sit with.** Pick one process your teams want an agent for. Can you list its steps and say, for each, whether the agent may read, draft, decide or commit?
:::

## Sources

- Damir Safin and Dian Balta, [*Autonomy and Agency in Agentic AI: Architectural Tactics for Regulated Contexts*](https://arxiv.org/abs/2605.12105), arXiv preprint, May 2026.
- Nada Madkour and colleagues, UC Berkeley Center for Long-Term Cybersecurity, [*Agentic AI Risk-Management Standards Profile*](https://cltc.berkeley.edu/agentic-ai-risk-management-standards-profile), version 1.0, February 2026.
- Markov Grey and Charbel-Raphaël Segerie, [*AI Safety Atlas*, Risks chapter](https://ai-safety-atlas.com/chapters/v1/risks/risk-decomposition).
