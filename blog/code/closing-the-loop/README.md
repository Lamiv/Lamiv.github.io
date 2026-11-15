# Closing the Loop: sample code

A small neural-symbolic loop built as a LangGraph workflow, from Part 7 of the
"Closing the Loop" series.

- `procurement.ttl`: the ontology (supplier, corporate group, order, allocation line), the purchasing policy and illustrative facts.
- `shapes.ttl`: SHACL rules, including the 60% cap counted per corporate group.
- `nesy_loop.py`: the workflow: propose → verify → (revise | release gate | escalate).

```
pip install -r requirements.txt
python nesy_loop.py          # scripted proposer, runs offline
python nesy_loop.py --live   # Claude as the proposer; needs ANTHROPIC_API_KEY
```

All suppliers, groups and figures are made up. This is teaching code, not production code.
