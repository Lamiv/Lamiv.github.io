---
title: In the wild, and the road ahead
subtitle: Five systems that close the loop, and how much weight each one can bear
part: 6
date: 15 November 2026
---

Ideas are cheap; architectures that survive contact with operations are not. Here are five recent systems that put an ontology or explicit rules inside an AI loop, with a note on what kind of evidence stands behind each.

## Netflix: an ontology for incidents

Netflix found that a typical investigation, about four hours in their example, went mostly into reconstructing relationships their systems already knew but had never written down. They built an Observability Ontology on RDF, OWL, SHACL and SPARQL. Dozens of *enrichers*, some using language models, read noisy input and may only emit typed triples. A correlation engine proposes causal chains scored on timing and severity, discards anything under 0.6 confidence and stores each chain with the evidence that produced it. On top sits AutoRCA, a set of specialist agents that share no vocabulary except the graph's. [Netflix](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf)

They are candid about the limits: the ranked hypotheses are sometimes wrong, which is why each carries its evidence, and an engineer still weighs it and writes the fix. AllegroGraph, a graph-database vendor, reads the article as validation of standards-based knowledge graphs for enterprise agents. [AllegroGraph](https://allegrograph.com/netflixs-ontology-driven-ai-architecture-validates-the-need-for-context-graph/)

*Decision shaped: which entities may enter the graph, and which causal hypotheses an engineer looks at first.*

*Evidence: an engineering account of a production system, without published metrics.*

## FAOS: ontologies around enterprise agents

The FAOS paper grounds enterprise agents in three ontologies: Role, Domain and Interaction. Its sharpest observation is an asymmetry: today's systems constrain what goes *into* an agent (context, tools, thresholds) but not what comes *out*, and the authors propose output-side validation. In 1,800 runs across five industries and three models, ontology-coupled agents scored significantly higher on metric accuracy and role consistency. The lift was largest where the models knew least, roughly twice as large in Vietnam-localised domains as in English ones. [Luong Tuan et al.](https://arxiv.org/abs/2604.00555)

*Decision shaped: what context and tools an agent is given and, as proposed, whether its answer is accepted.*

*Evidence: a controlled experiment, in a preprint whose lead author is affiliated with the platform; the output-side validation is a proposed framework.*

## NS-Mem: memory with rules in it

NS-Mem gives a multimodal agent a three-layer memory (episodic, semantic and logic rules) and retrieves from it with both similarity search and deterministic symbolic queries. The authors report an average 4.35% gain in reasoning accuracy over purely neural memory, and up to 12.5% on queries with constraints. [Jiang et al.](https://arxiv.org/abs/2603.15280)

*Decision shaped: which memories an agent retrieves when a question carries constraints.*

*Evidence: benchmark results in a preprint.*

## Metal printing: an ontology inside a control loop

Researchers at POSTECH put an ontology directly inside the control loop of laser powder bed fusion, a metal 3D-printing process. A description-logic reasoner classifies each upcoming feature, such as an overhang, and selects which constraints the controller must enforce, while a Gaussian process supplies the learned relationships. In a simulation calibrated to a NIST benchmark, it eliminated the dross a geometry-blind controller produced, and it retargets to new alloys by editing ontology data rather than code. The authors say the results establish feasibility, with experimental calibration as the next step. [Hong et al.](https://arxiv.org/abs/2608.05773)

*Decision shaped: which limits the controller enforces on each upcoming scan, with no person in the loop.*

*Evidence: simulation, in a preprint.*

## Ethics: rules as guardrails

A survey of hybrid models for risk-sensitive domains argues for rule-based safeguards in healthcare, compliance checks alongside anomaly detection in finance, and systems that remain auditable and human-overridable in critical infrastructure. [Kolli](https://arxiv.org/abs/2511.17644)

*Decision shaped: whether a model's recommendation clears a protocol or compliance rule.*

*Evidence: a survey with illustrative case studies.*

## The road ahead

Read together, the five share one thing: explicit knowledge shapes a specific decision somewhere in the workflow. In Netflix's graph it decides what may be recorded and which hypotheses come first. In FAOS it decides what an agent starts with. In NS-Mem it decides what an agent remembers. In the printing controller it decides the limits on the next scan. In the guardrails it decides whether an output may go any further.

Where that decision sits varies: before the model, after it, or inside a control loop. So does the role of people. Netflix keeps humans as the approvers of proposed fixes and ontology changes, and the survey argues for systems people can override. The printing controller acts on every scan with no one approving it; its safety rests on the ontology, the controller's bounds and the testing behind them. Human approval is a design choice that depends on the cost of a wrong decision and the time available to make it, not a feature every neuro-symbolic system shares.

For any system you are evaluating, two questions cut through the labels: *which decision does the explicit knowledge shape*, and *who or what acts on that decision*?

The open problems are more consistent than the architectures. Writing knowledge down precisely still takes effort. Results depend heavily on how good the graph is. Model behaviour shifts with versions and settings, which makes results hard to reproduce. And checking whole semantics at scale, rather than individual statements, remains hard. [McCain et al.](https://ceur-ws.org/Vol-4303/pdt-paper103.pdf)

:::maths
**For the mathematically curious: what a 0.6 threshold buys**

Netflix keeps a candidate causal chain only if its confidence *c* ≥ 0.6. Any threshold trades two errors. Raise it and you show engineers fewer wrong hypotheses, but you miss more real causes. Lower it and you catch more causes, but bury them in noise.

If *n* chains pass and a fraction *p* of them are real, an engineer reviewing them all sees *n*(1 − *p*) false leads. That is why Netflix's design of storing evidence with every chain matters as much as the threshold: it lowers the cost of rejecting a wrong lead, which lets you afford a lower threshold. The best threshold depends on that review cost, not on the model alone.
:::

:::question
**A question to sit with.** Which of these five is closest to a problem on your desk? And what kind of evidence would you need before you trusted it in production?
:::

Part 7 builds a small version of the loop, in Python.

## Sources

- Netflix Technology Blog, [*Ontology-Driven Observability*](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf), October 2026.
- AllegroGraph, [*Netflix's Ontology-Driven AI Architecture Validates the Need for Context Graph*](https://allegrograph.com/netflixs-ontology-driven-ai-architecture-validates-the-need-for-context-graph/), October 2026.
- Thanh Luong Tuan and colleagues, [*Ontology-Constrained Neural Reasoning in Enterprise Agentic Systems*](https://arxiv.org/abs/2604.00555), arXiv preprint, 2026.
- Rongjie Jiang and colleagues, [*Advancing Multimodal Agent Reasoning with Long-Term Neuro-Symbolic Memory*](https://arxiv.org/abs/2603.15280), arXiv preprint, 2026.
- Gisuk Hong, Jaebong Cho and Hyunbo Cho, [*Neuro-Symbolic Closed-Loop Control of Laser Powder Bed Fusion with an In-Loop Ontology*](https://arxiv.org/abs/2608.05773), arXiv preprint, August 2026.
- Chaitanya Kumar Kolli, [*Hybrid Neuro-Symbolic Models for Ethical AI in Risk-Sensitive Domains*](https://arxiv.org/abs/2511.17644), arXiv preprint, 2025.
- Michael McCain and colleagues, [*Selected Research Directions in NeuroSymbolic AI*](https://ceur-ws.org/Vol-4303/pdt-paper103.pdf), CEUR Workshop Proceedings, Vol. 4303, October 2026.
