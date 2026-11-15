---
title: Teaching a network the rules
subtitle: Compiling an ontology into something a neural network can learn from
part: 5
date: 8 November 2026
---

So far the symbolic side has acted after the fact. The model proposes, the ontology checks, and a rejection goes back as feedback. There is another way to close the loop: let the rules shape the network while it is being trained, so it learns to read the world in terms the ontology accepts.

## The idea in plain words

Imagine a network that reads scanned delivery notes and must decide, for each line, which supplier and which group it belongs to. You have labels for some of it, but not all. You also have an ontology that says how suppliers, groups and orders must fit together.

If the network's guesses can be scored by *how likely they are to be consistent with the ontology*, that score can become part of what the network is trained to improve. Readings that break the rules cost more; readings that fit them cost less. The ontology teaches where the labels are silent.

The hard part is computing that score exactly, for a real ontology, fast enough to train with.

## Baobab

Olga Mashkova, Asaad Mohammedsaleh, Fernando Zhapa-Camacho and Robert Hoehndorf at KAUST address this for OWL 2 DL, the description logic behind most serious ontologies. Existing learners either embed the ontology in a continuous space, giving up classical entailment, or restrict themselves to a simpler fragment of the logic. Their system, Baobab, compiles a full OWL 2 DL ontology with a finite set of facts into a circuit, a Sentential Decision Diagram, from which that consistency score can be computed in a single pass. The soundness of the compiler is machine-checked in the Lean theorem prover. [Mashkova et al.](https://arxiv.org/abs/2608.17741)

Their demonstration is deliberately small. A convolutional network learns to read handwritten MNIST digits that the ontology couples through a successor relation, and it recovers concepts that are never directly labelled, which an independently trained network leaves at chance. The code is public. [Baobab repository](https://github.com/bio-ontology-research-group/baobab)

## Right answer, wrong reason

The most useful part of the paper for practitioners is not the compiler. It is the treatment of *reasoning shortcuts*: cases where the network finds an assignment that satisfies the ontology but differs from the one that actually produced the example.

When the evidence admits several consistent readings, a network that scores each concept independently cannot spread its belief across them; it collapses onto one, arbitrarily. In one of their settings, the rules are symmetric under relabelling and the network reaches a digit accuracy of 0.18 against a chance level of 0.20, while still satisfying the training objective. Adding a single extra grounding fact breaks the symmetry. [Mashkova et al.](https://arxiv.org/abs/2608.17741)

The business parallel is uncomfortable. A model can learn to pass every compliance check for reasons that have nothing to do with the policy, for instance by always favouring the supplier that happened never to trigger a breach. Passing the checks is not the same as understanding them.

Their remedy connects to Part 4. They show that a mixture model with one component per *justification* of the query can represent the uncertainty a single independent model cannot. Seeded from the completions the circuit enumerates, it reaches the Bayes-optimal posterior on their image task. [Mashkova et al.](https://arxiv.org/abs/2608.17741)

:::maths
**For the mathematically curious: weighted model counting**

Give each true-or-false fact *a* a probability *w*(*a*) from the network. The weighted model count of a theory φ adds up the probability of every world that satisfies it:

WMC(φ | *w*) = Σ_{α ⊨ φ} ∏_{*a* true in α} *w*(*a*) · ∏_{*a* false in α} (1 − *w*(*a*))

The sum runs over every world α that satisfies φ. It is exactly the probability that a world drawn from the network's beliefs satisfies φ.

A tiny example. Let *N* mean “supplier 100200 is in North” and *E* mean “it is in East”. The network says *w*(*N*) = 0.7 and *w*(*E*) = 0.4. The ontology says exactly one is true, so two worlds qualify:

WMC = 0.7 × (1 − 0.4) + (1 − 0.7) × 0.4 = 0.42 + 0.12 = 0.54

Baobab trains with a loss that combines ordinary label error with this count, conditioned on the evidence *e*:

ℒ = BCE(observed labels) + λ · (−log WMC(Θ ∧ *e* | *p*_{θ}))

Here Θ is the compiled ontology and *p*_{θ} the network's beliefs. In the example, −log 0.54 ≈ 0.62. Gradient descent pushes probability away from the impossible worlds, “both” and “neither”, towards the consistent ones. Notice that it does not care *which* consistent world wins. That indifference is where reasoning shortcuts come from.
:::

## Where this stands

This is research on digits and a demanding logic, not an enterprise product, and it is a preprint. Its value is conceptual. It shows that the rule side and the learning side can share one mathematical object, and it gives a precise name to a failure that every team training models against business rules should look for.

:::question
**A question to sit with.** Where in your business are the labels thin but the rules rich? Those are the places where training against rules might teach a model more than examples can, and where reasoning shortcuts are most likely to hide.
:::

## Sources

- Olga Mashkova, Asaad Mohammedsaleh, Fernando Zhapa-Camacho and Robert Hoehndorf, [*Neuro-symbolic learning over OWL 2 DL via consequence-based compilation to differentiable circuits*](https://arxiv.org/abs/2608.17741), arXiv preprint, August 2026.
- [Baobab code repository](https://github.com/bio-ontology-research-group/baobab), Bio-Ontology Research Group, KAUST.
