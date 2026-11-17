---
title: Build the boundary
subtitle: One purchase order, traced through every property the series has argued for
part: 7
date: 25 October 2026
---

Six parts of argument come down to a handful of properties. This part puts them to work on one hypothetical purchase order and follows it through every failure the series has named. It describes what each step must guarantee, not how a particular product or framework would implement it; a runnable version, built and tested in code, belongs to the next series, *Agent Harness Engineering*.

## The cast

| Party | In this trace | What it may do |
|---|---|---|
| Requester | The buyer | Ask for the order; the system of record treats actions as theirs |
| Agent | A procurement agent | Stage and change draft orders, nothing else |
| Approver | The buyer's manager, chosen by rules the business owns | Approve a specific version of the order |
| The boundary | Wherever the checks below are enforced: application, runtime or a separate service | Decide whether each action is legitimate, and record it |

Notice that the buyer, in this company, is allowed to release small orders. That detail matters in step 2.

## The trace

| Step | What happens | Property being tested | Outcome |
|---|---|---|---|
| 1 | The agent stages a draft for 4,000 cartons at 2.10 | The agent works on the proposal side of the line (Part 1) | Allowed: a draft anyone can change |
| 2 | The agent tries to release the order, acting as the buyer | Ability to invoke an action is not authority to perform it (Part 3) | **Refused.** The system of record would have allowed it, because the buyer may release. Only a check that knows an agent is asking can refuse it |
| 3 | The buyer tries to approve their own order | The person who asked cannot approve the result (Parts 3 and 4) | **Refused**; the manager approves instead |
| 4 | The supplier revises the price to 2.35 and the agent updates the draft | Approval covers exact terms and version (Part 4) | **Release refused**: the approval covered an earlier version; the refusal says what changed |
| 5 | The manager approves the new version, but release is attempted ten days later | Approvals expire (Part 4) | **Refused**; a timely release then succeeds |
| 6 | The order is sent; the response is lost in a timeout | Repeating an action has the same effect as running it once (Part 2) | The retry checks first, finds the order already sent, and does nothing: **one order, not two** |
| 7 | After any change to roles or policy, a test tries every forbidden action as the agent | Controls are tested, not assumed (Parts 6 and 8) | Passes only if every forbidden action is refused |

Every refusal in that table raises an alert, and every step is recorded with the requester, the agent and the identity that executed it: enough to answer the auditor's question from Part 3.

## Four properties, many mechanisms

**The agent stages, people commit.** The property is that an agent cannot cross from proposal to commitment on its own. Mechanisms include permissions without release or send rights, a draft status that only people can promote, or a policy check that refuses commitment actions from agent identities. Step 2 shows why the check must know an agent is involved: if the agent acts with the buyer's full rights, the system of record alone has no reason to refuse.

**The approver is decided by rules, and is not the requester.** The property is that approval comes from someone with authority who did not ask. Mechanisms include approval rules based on organisation, budget or value, with the creator excluded and the creator set to the person who asked.

**An approval covers exact terms, for a limited time.** The property is that what is executed is what was approved. Mechanisms include fingerprints of the material terms, version checks at execution, signed approval records or reapproval rules, all checked at release and again before sending.

**A retry must not create a second order.** The property is that repeating an action has the same effect as running it once. One mechanism is described in the IETF's draft standard for an `Idempotency-Key` HTTP header: the client sends a unique key with a request, so the server can recognise a retry; a reused key with a different payload should be rejected, and a retry that arrives while the original is still being processed should get a conflict. [IETF](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header) After a timeout the outcome is unknown, so the safe sequence is to ask whether the first attempt took effect before trying again. Microsoft's architecture guidance makes the same point about recovery in general: a step may run more than once when retried, so design each step as an idempotent command. [Microsoft](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction)

## What this trace does not claim

It does not say where the boundary must live. In one organisation the application enforces all four properties itself. In another, the agent's runtime does, or an identity service, or a separate policy layer, or a mixture. Some platforms provide several of these properties built in. The trace is a test any design can be held to: walk the same seven steps and see which ones your system refuses, and why.

:::risk
**Averting risk**

| Risk | Required property | Possible mechanisms | Still not covered |
|---|---|---|---|
| The agent releases or sends | Agents cannot commit, even with a person's rights | Commitment actions refused for agent identities; staged writes | A policy that is itself wrong (Part 8) |
| A changed order goes out on an old approval | What is executed is what was approved | Fingerprints, version checks or signed approvals, checked at release and sending | Terms outside what is bound |
| A retry duplicates an order | Repeating an action equals running it once | Idempotency keys; checking status after a timeout before retrying | Systems with no way to look a request up |
| A permission is widened by mistake | Controls are tested on every change | Negative tests of forbidden actions | Actions the test does not list |
:::

:::question
**A question to sit with.** Walk your own agent through the seven steps. Which refusals does something outside the model enforce, and which depend on the model behaving well?
:::

Step 2 deserves a closer look. If the check that knows an agent is asking were missing, or the buyer's role were wrong, what else would stop the agent? Part 8 takes that question on.

## Sources

- Jayadeba Jena and Sanjay Dalal, [*The Idempotency-Key HTTP Header Field*](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header), IETF Internet-Draft, version 08, October 2026.
- Microsoft, [*Compensating Transaction pattern*](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction), Azure Architecture Center.
