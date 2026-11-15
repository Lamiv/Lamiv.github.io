# Designing Agency: sample code

A small, runnable sketch of the boundary around an AI agent that works with SAP,
from Part 7 of the "Designing Agency" series.

- The agent may stage and change draft purchase orders, under the requesting user's identity.
- Release and sending need a human approval bound to a fingerprint of the material terms.
- Approvals expire; the creator cannot approve their own order.
- Sending uses an idempotency key, and a timeout is reconciled before any retry.
- Every step is logged with both the SAP identity (`sub`) and the agent (`act`).

```
python boundary.py
```

SAP is a mock. Names, prices and rules are made up. Python 3.10+, standard library only.
This is teaching code, not production code.
