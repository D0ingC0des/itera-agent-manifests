export interface CreditEvent {
  id: string
  accountId: string
  amount: string // dollars, e.g. "10.50"
}

/**
 * Applies credit events to per-account balances.
 *
 * Known defects (this is the benchmark fixture an agent must fix):
 * 1. Dollar amounts are summed as floating-point numbers, so balances drift after many
 *    small credits instead of landing on an exact cent value.
 * 2. The same event id can be replayed and will be applied again, double-crediting the
 *    account — there is no idempotency guard.
 */
export class CreditLedger {
  private balances = new Map<string, number>()

  applyEvent(event: CreditEvent): number {
    const amount = parseFloat(event.amount)
    const current = this.balances.get(event.accountId) ?? 0
    const next = current + amount
    this.balances.set(event.accountId, next)
    return next
  }

  balanceOf(accountId: string): number {
    return this.balances.get(accountId) ?? 0
  }
}
