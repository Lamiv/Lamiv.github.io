---
title: The ontology as rulebook
subtitle: What counts as one supplier, answered precisely
part: 3
date: 1 November 2026
---

An ontology sounds philosophical. In engineering it is practical. Netflix's engineers describe it as a formal specification of types, the properties they carry and the relationships they may have, with the triple as its unit: one fact expressed as subject, predicate and object. [Netflix](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf)

For our procurement agent, the facts look like this:

```turtle
ex:S100100  ex:memberOf  ex:GroupNorth .
ex:S100200  ex:memberOf  ex:GroupNorth .
ex:S200300  ex:memberOf  ex:GroupEast .
ex:PurchasingPolicy  ex:groupCap  0.60 .
```

Four lines answer the prologue's question. Supplier records 100100 and 100200 are different records with one parent, so a 50–50 split between them gives North Holdings the whole order.

## Model identity first

Netflix hit the same problem in operations. Its telemetry, alerting, incident and deployment tools each knew part of the picture, but they did not agree on what they were talking about: something that was an application in one system was a service in a second and a cluster in a third. Joining them needed a person who carried the mapping in their head. [Netflix](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf)

Their response is worth copying. They refused a generic “Service” type, because the word meant four different things across their tooling. Every application resolves to exactly one type and is validated against a software catalogue of roughly 49,000 entries before it is created. Their first principle for anyone building one: model identity before anything else, with one authoritative catalogue per kind of entity. [Netflix](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf)

In procurement, the equivalent decisions are which system is authoritative for suppliers, which for legal entities and which for corporate groups, and what the purchasing policy means when it says “supplier”.

## Two kinds of checking

Netflix built on the W3C standards: RDF for the data, OWL for the ontology, SHACL for validation and SPARQL for queries. [Netflix](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf) OWL and SHACL both check things, but they ask different questions, and the difference matters.

OWL reasoning asks: *could this be true, given what we know?* It assumes the world may contain facts nobody has recorded. If a supplier has no parent group on file, OWL does not complain; the group may simply be unrecorded.

SHACL validation asks: *does this data have the shape we require?* It checks what is actually there. If the policy needs every supplier to have a parent group, a SHACL rule flags the supplier that has none, because without it the cap cannot be checked.

You usually want both. OWL catches statements that contradict each other. SHACL catches data that is missing or malformed.

## The type system as a fence

Netflix's hardest-defended principle is to constrain stochastic tools with a type system. A model summarising an incident channel may write any prose it likes, but it cannot emit a triple that violates the type system. A narrow enough output contract turns a stochastic process into something a query engine can trust. [Netflix](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf)

For our agent, that means the model may reason however it likes, but its proposal must name supplier IDs that exist, shares that are numbers and quotes that can be traced. Everything else is checked against the ontology before it reaches SAP.

:::maths
**For the mathematically curious: a contradiction you can prove**

In description-logic notation, the ontology might say:

*Supplier* ⊑ ∃*memberOf*.*CorporateGroup* (every supplier belongs to some group)

⊤ ⊑ ≤1 *memberOf*.⊤ (nothing belongs to more than one group)

*North* ≠ *East* (the two groups are different)

SAP contributes the fact *memberOf*(S100200, *North*). Now suppose a model reading a contract adds *memberOf*(S100200, *East*). Call the new statement *L*. Then

KB ∪ { *L* } ⊨ ⊥

The combined knowledge entails ⊥, a contradiction, so it has no possible model. A reasoner detects this mechanically: one of the four statements has to go. Part 4 looks at how you decide which.

One honest limit: OWL cannot add up numbers across individuals, so the 60% cap itself is outside what OWL can express. In practice the sum goes into a SHACL rule with an embedded SPARQL query, which is what the code in Part 7 does.
:::

:::question
**A question to sit with.** If your ERP holds three records for what is really one supplier, which system decides that they are one? Is that decision written down anywhere a machine could read it?
:::

Ontologies are not written once. Suppliers merge, policies change and models propose new facts every day. Part 4 is about keeping the rulebook correct while it changes.

## Sources

- Netflix Technology Blog, [*Ontology-Driven Observability: Building an End-to-End Knowledge Graph at Netflix Scale*](https://netflixtechblog.com/ontology-driven-observability-building-an-end-to-end-knowledge-graph-at-netflix-scale-421392cf5adf), October 2026.
