# Designing Agency: sample code

A small, runnable sketch of the boundary around an AI agent that works with a system of record,
originally written for the "Designing Agency" series; it will be developed further in "Agent Harness Engineering".

- The agent may stage and change draft purchase orders, under the requesting user's identity.
- Release and sending need a human approval bound to a fingerprint of the material terms.
- Approvals expire; the creator cannot approve their own order.
- Sending uses an idempotency key, and a timeout is reconciled before any retry.
- Every step is logged with both the executing identity (`sub`) and the agent (`act`).

```
python boundary.py
```

The system of record is a mock. Names, prices and rules are made up. Python 3.10+, standard library only.
This is teaching code, not production code.
