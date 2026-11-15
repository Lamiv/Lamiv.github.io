---
title: Two ways of knowing
subtitle: Why a model that reads well still needs something that counts
part: 1
date: 8 November 2026
---

The prologue ended with an awkward question. An agent proposed a 50–50 split between two supplier IDs, comfortably under a 60% cap, and both IDs belonged to the same parent company. What counts as one supplier?

Before answering it, it is worth asking why an AI system needs two kinds of machinery at all. If a language model can read a contract, why can it not also apply the purchasing policy?

## Fast and slow

Daniel Kahneman popularised a split between two modes of human thinking. System 1 is fast and intuitive: you recognise a face, finish a sentence, sense that a number looks wrong. System 2 is slow and deliberate: you add up a column, check a clause against a rule, follow a proof step by step.

The analogy is borrowed constantly in AI, and it is useful as long as you treat it as an analogy rather than anatomy. A language model behaves more like System 1. It is fluent, quick and good with messy input: quotes in five formats, a discount buried in a footnote, an email that says “same terms as last year”. A rules engine or a reasoner behaves more like System 2. It is explicit, it needs its facts written down, and it gives the same answer every time.

## What each side gets wrong

Graphwise, a knowledge-graph vendor, lists the weaknesses on each side plainly. Purely statistical models hallucinate, are hard to explain and need ever more data to improve. Traditional symbolic systems are rigid, need people to write a rule for every case, and break on the messy, noisy input that real organisations produce. Each side fixes the other: the neural part turns real-world chaos into clean entities, and the symbolic part provides a framework in which the system behaves predictably. [Graphwise](https://graphwise.ai/fundamentals/what-is-neuro-symbolic-ai/)

A research group at Wright State University makes the neural weakness more specific. In their review, language models produced confabulations or unstable responses when they worked without external knowledge, and they struggled with schema, structural and symbolic constraints, especially explicitly typed rules and relationships of the kind found in knowledge graphs. [McCain et al.](https://ceur-ws.org/Vol-4303/pdt-paper103.pdf)

That is our procurement problem exactly. “Supplier 100200 belongs to North Holdings” is a typed relationship. “No group may receive more than 60%” is an explicit rule. These are the things a model is least reliable at holding in its head, and the things a symbolic layer is built for.

## Change a fact, not a model

There is a second, quieter advantage. Graphwise puts it this way: change a fact in the knowledge and the machine acts accordingly, without retraining. [Graphwise](https://graphwise.ai/fundamentals/what-is-neuro-symbolic-ai/)

Suppose the board lowers the cap from 60% to 50%. In a symbolic layer, that is one edited value, reviewed and dated. In a model that learned the policy from past approvals, it is a hope that enough new examples will outweigh the old ones. Suppose instead that two suppliers merge. In a symbolic layer, that is one new relationship. In a model, nobody can point to where the old structure lives.

None of this makes the model unnecessary. Someone still has to read the quotes, and the model does that better than any rule. The point is a division of labour: let the model interpret, and let something explicit decide whether the interpretation is allowed.

:::maths
**For the mathematically curious: probability versus entailment**

A language model gives you a probability: P(*y* | *x*), the chance of an answer *y* given the text *x*. Asked whether a proposal is compliant, it might in effect say P(compliant | proposal) = 0.93. That number can be well calibrated or badly calibrated, but it is always a degree of belief.

A reasoner gives you entailment, written KB ⊨ φ. It says that the statement φ is true in every world where the knowledge base KB is true. There is no 0.93. Either φ follows, or its negation follows, or, if the facts are silent, neither does.

The catch is in the KB. Entailment is sound relative to the facts you gave it. If the master data wrongly says that supplier 100200 belongs to East Trading, the reasoner will confirm, with complete certainty, that the 50–50 split is compliant. Logic does not create truth. It preserves it, and it preserves errors just as faithfully.
:::

:::question
**A question to sit with.** In your organisation, which rules live only in people's heads or in past decisions, and which are written down where a machine could read them? If a rule changed tomorrow, would you rather edit one line or retrain a model?
:::

Part 2 looks at the bridge between the two sides: how a model turns words into something a reasoner can check, and why the first translation is usually wrong.

## Sources

- Graphwise, [*What Is Neuro-Symbolic AI?*](https://graphwise.ai/fundamentals/what-is-neuro-symbolic-ai/), last updated November 2026.
- Michael McCain and colleagues, Wright State University, [*Selected Research Directions in NeuroSymbolic AI*](https://ceur-ws.org/Vol-4303/pdt-paper103.pdf), CEUR Workshop Proceedings, Vol. 4303, October 2026.
