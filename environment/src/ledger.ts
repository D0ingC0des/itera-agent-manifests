export interface CreditEvent {
  id: string
  accountId: string
  amount: string // dollars, e.g. "10.50"
}

/** Applies credit events to per-account balances, tracked in integer cents. */
export class CreditLedger {
  private balances = new Map<string, number>() // cents
  private seenEventIds = new Set<string>()

  applyEvent(event: CreditEvent): number {
    if (!this.seenEventIds.has(event.id)) {
      const amountCents = Math.round(parseFloat(event.amount) * 100)
      const current = this.balances.get(event.accountId) ?? 0
      this.balances.set(event.accountId, current + amountCents)
      this.seenEventIds.add(event.id)
    }
    return this.balances.get(event.accountId) ?? 0
  }

  balanceOf(accountId: string): number {
    return this.balances.get(accountId) ?? 0
  }
}
