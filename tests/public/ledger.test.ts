import { describe, expect, it } from 'vitest'
import { CreditLedger } from '../../src/ledger.js'

describe('CreditLedger (public)', () => {
  it('credits an account in integer cents, not dollars', () => {
    const ledger = new CreditLedger()
    const balance = ledger.applyEvent({ id: 'evt-1', accountId: 'acc-1', amount: '10.00' })
    expect(balance).toBe(1000)
  })

  it('replaying the same event id does not double-credit the account', () => {
    const ledger = new CreditLedger()
    ledger.applyEvent({ id: 'evt-1', accountId: 'acc-1', amount: '10.00' })
    const balance = ledger.applyEvent({ id: 'evt-1', accountId: 'acc-1', amount: '10.00' })
    expect(balance).toBe(1000)
  })
})
