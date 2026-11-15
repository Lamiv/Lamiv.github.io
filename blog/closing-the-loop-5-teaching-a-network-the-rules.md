---
title: When the rules cannot choose
subtitle: Two readings can both satisfy every rule, and only evidence can pick the right one
part: 5
date: 11 November 2026
---

So far the rules have done their work after the fact: the model proposes, the ontology checks, and a rejection goes back as a reason. This part is about a failure that checking cannot catch, because nothing is broken. Two different interpretations both satisfy every rule, and the system has to choose between them.

## Two records, one name

A scanned delivery note says “North Packaging, 4,000 cartons”. The model reading it must decide which supplier record the line belongs to. SAP holds two candidates: North Packaging LLC (100100) and North Packaging FZE (100200). Both belong to North Holdings.

Now run the checks from Part 3. The 60% cap is counted per group, and both records are in the same group, so the cap gives the same answer either way. Every supplier has a parent group, the shares add up, and the quote reference exists. Both readings pass.

But they are not the same reading. The invoice goes to a different legal entity, the tax treatment may differ, and the contract terms may not match. The rules are satisfied and the answer can still be wrong.

## Why rules alone do not help

This is not a flaw in the rules. They were written to stop concentration at group level, and they do. They were never meant to tell two sister companies apart. Logically, the knowledge base is *indifferent* between the two readings: both are consistent with it.

The danger is greater when the rules are used to train a model rather than to check one. A model rewarded for consistency with the rules learns nothing from the rules about which sister company is meant, because both answers earn the same reward. It will settle on one, and the choice can be arbitrary: whichever record appeared first in training, or whichever happened never to trigger a review. It passes every check, for reasons that have nothing to do with the delivery note. Researchers call this a *reasoning shortcut*: the right answer by the rules, the wrong answer by the world.

## What the research shows

Olga Mashkova, Asaad Mohammedsaleh, Fernando Zhapa-Camacho and Robert Hoehndorf at KAUST study exactly this, in a deliberately small setting. Their system, Baobab, compiles an OWL 2 DL ontology into a form a neural network can be trained against, and their test task asks a network to read handwritten digits linked by ontology rules. [Mashkova et al.](https://arxiv.org/abs/2608.17741)

In one setting the rules allow five different readings that are all consistent, much like our two sister companies. Trained against the rules alone, the network's accuracy is 0.18, slightly below the 0.20 it would get by guessing, even though it satisfies the training objective. The fix is not better rules but more evidence: one additional fact cuts the consistent readings from five to three, and the full set of such facts cuts them to one, after which the network reads the digits correctly. [Mashkova et al.](https://arxiv.org/abs/2608.17741)

It is research on digits and a preprint, not an enterprise product. But the lesson carries straight over.

## Evidence chooses, rules constrain

In procurement, the deciding evidence is usually mundane: the tax registration number on the delivery note, the legal entity named on the quote, the bank account on the invoice. The design consequences are practical:

- **Ask the checker a second question.** Not only “does this pass?” but “is there more than one way it could pass?” If two supplier records satisfy every rule, that is a reason to look for evidence, not a green light.
- **Make the model show its evidence.** A proposal should say why it picked 100200 over 100100, citing the field that decided it, just as it cites the quote its figures came from.
- **Route genuine ties to a person.** When no evidence separates the readings, the honest output is “ambiguous”, with both candidates and what would settle it.

:::maths
**For the mathematically curious: why consistency cannot break a tie**

Give each candidate fact a probability from the model: *w*(*L*) for “the line belongs to 100100 (LLC)” and *w*(*F*) for “it belongs to 100200 (FZE)”. The rules say exactly one is true. The probability that the model's beliefs satisfy the rules is the *weighted model count*, summed over the consistent worlds:

WMC = *w*(*L*)(1 − *w*(*F*)) + (1 − *w*(*L*))*w*(*F*)

A model that is sure of LLC, with *w*(*L*) = 1 and *w*(*F*) = 0, scores 1. A model that is sure of FZE scores 1 too. Training to maximise consistency, as Baobab does with a loss of −log WMC, rewards both equally, so it cannot prefer the right one.

Add evidence *e*, for example “the tax number on the note matches 100200”. Conditioning on it removes the LLC world, and only the FZE reading can score. The rules did not get smarter; the set of consistent worlds got smaller.
:::

:::question
**A question to sit with.** Where in your processes could two different answers both pass every control you have? Which piece of evidence would tell them apart, and does any system capture it?
:::

Part 6 looks at five systems that put explicit knowledge to work, and asks what decision the knowledge actually shapes in each.

## Sources

- Olga Mashkova, Asaad Mohammedsaleh, Fernando Zhapa-Camacho and Robert Hoehndorf, [*Neuro-symbolic learning over OWL 2 DL via consequence-based compilation to differentiable circuits*](https://arxiv.org/abs/2608.17741), arXiv preprint, August 2026.
- [Baobab code repository](https://github.com/bio-ontology-research-group/baobab), Bio-Ontology Research Group, KAUST.
