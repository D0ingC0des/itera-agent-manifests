# Fix the credit ledger reconciliation bug

`src/ledger.ts` applies incoming credit events to per-account balances. It has two real bugs:

1. **Money math**: dollar amounts are parsed and summed as floating-point numbers. After many
   small credits, the balance drifts away from the exact value instead of landing on a correct
   cent amount.
2. **Idempotency**: if the same event `id` is delivered more than once (a common webhook/retry
   scenario), it gets applied again and double-credits the account. A replay of an already-seen
   event id must be a no-op — it must return the account's current balance unchanged, regardless
   of what amount the replayed payload claims.

## What "fixed" means

- `CreditLedger.applyEvent()` and `CreditLedger.balanceOf()` must return balances in **integer
  cents**, never a floating-point dollar amount.
- The same event `id` applied twice must only affect the balance once.
- Different event ids still apply independently, and different accounts stay independent of each
  other.

## Scope

Only `src/ledger.ts` needs to change. Do not modify the test files or anything outside `src/`.
