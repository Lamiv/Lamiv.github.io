---
title: When the rulebook has to change
subtitle: Models that help build ontologies, and the people who approve the changes
part: 4
date: 8 November 2026
---

The case for ontologies has always run into the same objection: they are expensive. Somebody has to decide what a supplier is, write it down, keep it current and reconcile it with every system that disagrees. Language models change that cost, and they also add a new kind of risk.

## The cost problem

A survey from the University of Manchester and collaborators states the problem directly: building an ontology typically requires substantial human effort, and standard reasoning struggles with incomplete or uncertain information. The authors review work since 2021 in three areas: ontology learning (building ontologies from text), ontology matching (aligning two ontologies) and ontology-aware complex reasoning, using prompting, fine-tuning and retrieval-augmented generation. [Yang et al.](https://research.manchester.ac.uk/en/publications/ontology-construction-and-reasoning-with-llms-survey-and-perspect/)

Graphwise lists the same bottleneck from the vendor side. Building and maintaining these systems takes a lot of manual work by skilled engineers, and keeping pace with enterprise data growth remains hard. [Graphwise](https://graphwise.ai/fundamentals/what-is-neuro-symbolic-ai/)

## Letting the model draft

Pavel Salovsky and Iuliia Gorshkova propose an architecture in which a language model is not the knowledge store but the layer that builds and updates one: an RDF/OWL ontology, with SHACL validators, SPARQL queries and controls for contradictions. Their reported numbers are modest and honestly framed. On a Tower of Hanoi task, ontological augmentation raised the success rate from 26.3% to 33.3% with three disks and from 33.3% to 45.5% with five, with no difference at four disks and no successes at six. Because the number of runs, prompts and success criteria were not disclosed in their source materials, they treat the results as descriptive evidence rather than statistical proof. [Salovsky and Gorshkova](https://arxiv.org/abs/2604.20795)

That is a fair summary of the field: the model as draftsman is promising, and the evidence is still early.

## Treat the ontology as code

Netflix's answer to change is procedural rather than clever. Treat the ontology as code: version it, review it, test it and let changes arrive as pull requests. Separate concepts, which change on a human timescale, from instances, which change continuously. And keep humans as the approvers: let agents propose fixes and ontology changes, and route every proposal through review. [Netflix](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf)

In procurement terms, “North Holdings acquired East Trading” is a concept-level change with consequences for every concentration check. It deserves a reviewer. A new supplier record joining an existing group is an instance-level change that a validated pipeline can handle.

## When a contradiction appears

Part 3 ended with a contradiction: SAP says supplier 100200 belongs to North, and a model reading a contract says East. Something has to give. The useful tool here is a *justification*: the smallest set of statements that together produce the contradiction.

In our case the justification is four statements: nothing belongs to two groups; North and East are different; SAP's fact; the model's fact. Remove any one and the contradiction disappears. Logic tells you the candidates. It cannot tell you which one is wrong. Perhaps the contract is newer than the master data. Perhaps the model misread a subsidiary's name. Perhaps the business really has changed. That is a judgement for a person with context, which is exactly why the approver matters.

Provenance makes the judgement possible. If every statement records where it came from and when, the reviewer sees “SAP vendor master, updated 2024” against “model extraction from contract page 7, today”, not just two conflicting facts.

:::maths
**For the mathematically curious: justifications and repairs**

A justification for a conclusion φ is a subset *J* of the knowledge base such that *J* ⊨ φ and no proper subset of *J* entails φ. For an inconsistency, φ is ⊥.

A knowledge base can contain several justifications for the same contradiction. To repair it, you must remove at least one statement from *every* justification, so a repair is a *hitting set* across them. The smallest repair is not always the right one: removing a single axiom such as “nothing belongs to two groups” fixes everything at once and quietly breaks the policy. That is why repair tools propose and people dispose.

Justifications come back in Part 5, where they turn out to matter for training neural networks as well.
:::

:::question
**A question to sit with.** Who would review a pull request that changes what “supplier group” means in your organisation? Procurement, finance, IT or legal? If the answer is “it depends”, that dependency is part of your ontology too.
:::

## Sources

- Hui Yang, Jiaoyan Chen, Yue Ma and Renate Schmidt, [*Ontology Construction and Reasoning with LLMs: Survey and Perspective*](https://research.manchester.ac.uk/en/publications/ontology-construction-and-reasoning-with-llms-survey-and-perspect/), Transactions on Graph Data and Knowledge, 2026.
- Pavel Salovsky and Iuliia Gorshkova, [*Automatic Ontology Construction Using LLMs as an External Layer of Memory, Verification, and Planning for Hybrid Intelligent Systems*](https://arxiv.org/abs/2604.20795), arXiv preprint, 2026.
- Netflix Technology Blog, [*Ontology-Driven Observability*](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf), October 2026.
- Graphwise, [*What Is Neuro-Symbolic AI?*](https://graphwise.ai/fundamentals/what-is-neuro-symbolic-ai/), November 2026.
