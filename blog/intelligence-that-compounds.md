---
title: Memory is not learning
subtitle: Designing AI agents that improve with experience, without writing application code
part: 0
date: 24 November 2026
image: covers/intelligence-that-compounds
image_alt: Hand-drawn sketch: a learning loop of observe, predict, evaluate and adapt widens into a spiral around accumulated experience, between a database labelled evidence and a notebook labelled interpretation.
---

Imagine a colleague who is exceptionally capable. Every morning they gather information, analyse the situation and make recommendations. But they never check whether yesterday's recommendations were right, and never ask why one approach worked and another failed. Every morning, for all their intelligence, they start again.

Many AI assistants work this way. We have given them knowledge, tools, connected applications and, increasingly, the ability to act. We have rarely given them a way to learn from the consequences of what they recommend.

Memory alone is not learning. Reflection alone is not improvement. And self-improvement without measurement is only a claim.

This series explores a proposition: an AI system can get better at a task without changing the underlying model. What has to evolve is the architecture around it: its memory, its strategies, its evaluation, and its ability to build up experience that has been checked.

## A small experiment

I have been exploring this with a small market intelligence agent, assembled from ChatGPT and its scheduled tasks, a Supabase database, a Notion workspace and Firecrawl for deeper research. There is no application to build. Every piece is an existing platform, configured, and as Part 1 describes, ChatGPT did most of the configuring.

It follows one thing, Brent crude oil, and answers one question every trading day: *which way will Brent move next, how confident is it, and why?*

Any capable assistant can research the market and answer that. The difference is what happens afterwards. The agent keeps its prediction, its evidence, its confidence and the version of the strategy it used. When the real price is known, it goes back, measures the gap and writes down possible explanations, which become hypotheses to test.

Its first live forecast, frozen at 14:30 UTC on 24 November, gives a 43% chance that Brent's January futures settle higher on 25 November than on 23 November, and labels that number, honestly, as uncalibrated. [Part 2](intelligence-that-compounds-2-what-it-means.html) shows it, and what it reveals about the design.

This is an experiment in architecture, not a forecasting claim, and certainly not investment advice. Its purpose is to make one question concrete: what would it take for a system like this to *show* that it is improving?

```mermaid
flowchart LR
    T["Scheduled task<br/>starts each cycle"] --> I
    S["External sources<br/>prices, news, reports"] --> I["Ingest and<br/>add context"]
    I --> A["Reasoning agent"]
    A --> P["Prediction or<br/>recommendation"]
    P --> E["Evaluate against<br/>the real outcome"]
    E --> C["Controlled<br/>adaptation"]
    C -->|"next cycle"| A
    A <--> M1[("Empirical memory<br/>Supabase")]
    A <--> M2["Reflective memory<br/>Notion"]
    E <--> M1
    E --> M2
```

*Figure 1. The architecture is a loop, not a pipeline: each cycle ends by checking against reality, and only tested changes feed the next cycle.*

*Alt text: A scheduled task starts each cycle. External sources are ingested and given context, then passed to a reasoning agent, which makes a prediction or recommendation. That is evaluated against the real outcome, which leads to controlled adaptation and back to the agent for the next cycle. The agent reads and writes empirical memory in Supabase and reflective memory in Notion; evaluation reads and writes empirical memory and writes to reflective memory.*

## The outcome the agent does not control

An agent cannot learn from a world it cannot observe, so what it reads matters. But the most important input is the easiest to overlook: an independent record of what actually happened. Without it, an agent can produce convincing explanations indefinitely and never discover whether it is getting better. In enterprise terms, the outcome is the system of record; the agent's own account of its performance is not.

The same discipline applies to time. Every piece of evidence needs to record when it was published, so that a prediction can only use what was known before it was made. An agent that justifies yesterday's call with today's news has not learned anything; it has rewritten the past.

## Two kinds of memory

The design rests on keeping two kinds of memory apart.

**Supabase holds the evidence:** what was observed, what was predicted, with what confidence, and what actually happened. These records are never rewritten once the outcome is known, because a system that can edit its own history can always look like it is improving.

**Notion holds the interpretation:** research notes, explanations, hypotheses and proposed changes to the strategy. It turns disconnected daily reports into a continuing line of inquiry, where today's analysis can build on last week's question.

The difference matters. A hypothesis does not become knowledge because an AI wrote it down. Recent research names the danger: agents that reflect on their own work can endorse their mistakes and store them as guidance, a *self-confirmation trap*. [Zhu et al.](https://arxiv.org/abs/2606.24428) Only evaluation against outcomes the agent does not control should turn an idea into practice.

## One wrong prediction

Suppose that on Monday the agent sees a supply disruption and predicts Brent will rise 1.5%, with 80% confidence. Brent falls 0.8%.

An ordinary assistant simply writes Tuesday's analysis. This one goes back. Did it give too much weight to the supply risk, and too little to weakening demand and a stronger dollar? That suggests a hypothesis: *supply shocks may matter less when demand is falling.*

The hypothesis is not adopted. One wrong prediction proves nothing. It is recorded, compared with similar past cases, and tested: a revised strategy runs alongside the current one, on days neither has seen. It is promoted only if it does better over enough of them. That is the difference between an agent that remembers and an agent designed to learn.

```mermaid
flowchart TD
    O["Observe"] --> R["Reason"]
    R --> P["Predict"]
    P --> E["Evaluate"]
    X[("Independent<br/>outcomes")] --> E
    E --> H["Hypothesise"]
    H --> T["Experiment"]
    T --> A["Adapt"]
    A --> O
    K(("Accumulated<br/>experience"))
    K -.-> R
    E -.-> K
    T -.-> K
```

*Figure 2. The learning loop. Evaluation draws on outcomes from outside the agent, not on the agent's opinion of its own performance.*

*Alt text: A cycle: observe, reason, predict, evaluate, hypothesise, experiment, adapt, and back to observe. Independent outcomes feed into evaluate. Accumulated experience sits at the centre: evaluation and experiments add to it, and reasoning draws on it.*

## What improves, and how we would know

Nothing here retrains the model. What changes is everything around it: which sources it reads, how it weighs signals, how well its confidence matches reality, which past cases it recalls, and how it researches. Research such as Reflexion and ExpeL has shown agents improving on benchmark tasks through written reflection and extracted insights, without changing the model's weights. [Shinn et al.](https://arxiv.org/abs/2303.11366)[Zhao et al.](https://arxiv.org/abs/2308.10144) Whether that holds in a noisy market is exactly what has to be measured.

A professional analyst is a fair comparison. Their underlying abilities may not change much over a career; their methods, sources and judgement do, through experience and through being held to their record.

Measuring it honestly means three things. Comparing the learning agent with a simple baseline, and with itself running a fixed strategy that never learns, so that any improvement can be attributed to learning. Storing every prediction before the outcome exists. And testing each change only on days that come after the ones it was developed on. I have no results yet that meet that standard. The architecture's claim is narrower: it makes the question answerable, and I will publish the answer either way.

## Who decides what it learns

[Designing Agency](designing-agency-0-permission.html) asked what we are giving an agent permission to do. A learning agent raises a new question: *if we authorise an agent to do a task, have we also authorised it to change how it does it?*

Organisational learning offers a useful distinction, introduced by Chris Argyris. *Single-loop learning* corrects actions within the existing rules, like a thermostat that switches the heating on when the room is cold. *Double-loop learning* questions the rules themselves, such as whether that is the right temperature. [Wikipedia](https://en.wikipedia.org/wiki/Double-loop_learning) In this agent, adjusting a prediction is single-loop. Changing its analytical strategy is double-loop. Changing its objectives, or the way its success is measured, is a loop that should stay with people.

So the answer is: partly. It may propose and test new strategies. It may not change its objectives, its scoring or its permissions, because an agent that can rewrite how it is judged can always declare itself improved. Promotion stays a human decision, recorded and reversible.

## Beyond oil

Brent is a convenient teacher because the market publishes an independent outcome every day. Organisations generate far more experience than that, scattered across email, meetings, chat and the CRM, and almost none of it is connected to what happened next. The same pattern could connect a commercial team's signals and recommendations to deals won or lost, with one caution: a deal won after a recommendation does not prove the recommendation caused it. Claims about cause need comparison groups, not anecdotes.

| Level | Capability |
|---|---|
| 1 · Stateless | Answers requests, keeps nothing |
| 2 · Connected | Reaches outside applications and information |
| 3 · Persistent | Keeps observations, decisions and outcomes |
| 4 · Reflective | Examines its record and forms hypotheses |
| 5 · Adaptive | Tests changes and adopts only validated ones |
| 6 · Institutional | Turns validated experience into knowledge others reuse |

This is a proposed scale, not an industry standard. Connecting applications reaches level 2, and level 3 is now easy to build. The real work is the step from 4 to 5, where a claim has to become a measurement.

## Next: building it, and what it means

Connecting tools gives an agent more information. Designing a learning loop gives it a chance to get better at using that information. [Part 1](intelligence-that-compounds-1-building-it.html) is the build, and most of it was done by conversation: ChatGPT designed the database, the engines and their prompts, and deployed them. What it could not do was decide what counts as evidence, and what the agent may change about itself. That is where a person's time goes. [Part 2](intelligence-that-compounds-2-what-it-means.html) reads the first live forecast against the design, draws out what it means in practice, and extends the pattern to an organisation's own decisions.

:::question
**A question to sit with.** If an AI system in your organisation claimed it had improved last quarter, what evidence would you ask for, and does anything record it today?
:::

## Sources

- Shiding Zhu and colleagues, [*Beyond Self-Reflection: An Execute-Distill-Verify Framework for Agentic Experience Learning*](https://arxiv.org/abs/2606.24428), arXiv preprint, June 2026.
- Noah Shinn and colleagues, [*Reflexion: Language Agents with Verbal Reinforcement Learning*](https://arxiv.org/abs/2303.11366), arXiv preprint, 2023.
- Andrew Zhao and colleagues, [*ExpeL: LLM Agents Are Experiential Learners*](https://arxiv.org/abs/2308.10144), AAAI 2024.
- Wikipedia, [*Double-loop learning*](https://en.wikipedia.org/wiki/Double-loop_learning).
