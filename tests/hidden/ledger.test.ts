import { describe, expect, it } from 'vitest'
import { CreditLedger } from '../../src/ledger.js'

describe('CreditLedger (hidden)', () => {
  it('accumulates many small credits without floating-point drift', () => {
    const ledger = new CreditLedger()
    for (let i = 0; i < 1000; i++) {
      ledger.applyEvent({ id: `evt-${i}`, accountId: 'acc-1', amount: '0.10' })
    }
    expect(ledger.balanceOf('acc-1')).toBe(10000) // exactly $100.00 in cents
  })

  it('different event ids for the same account both apply', () => {
    const ledger = new CreditLedger()
    ledger.applyEvent({ id: 'evt-1', accountId: 'acc-1', amount: '5.00' })
    ledger.applyEvent({ id: 'evt-2', accountId: 'acc-1', amount: '3.00' })
    expect(ledger.balanceOf('acc-1')).toBe(800)
  })

  it('a replayed event id is a no-op even if the payload amount differs', () => {
    const ledger = new CreditLedger()
    ledger.applyEvent({ id: 'evt-1', accountId: 'acc-1', amount: '10.00' })
    const balance = ledger.applyEvent({ id: 'evt-1', accountId: 'acc-1', amount: '999.00' })
    expect(balance).toBe(1000)
  })

  it('keeps separate accounts independent', () => {
    const ledger = new CreditLedger()
    ledger.applyEvent({ id: 'evt-1', accountId: 'acc-1', amount: '10.00' })
    ledger.applyEvent({ id: 'evt-2', accountId: 'acc-2', amount: '7.50' })
    expect(ledger.balanceOf('acc-1')).toBe(1000)
    expect(ledger.balanceOf('acc-2')).toBe(750)
  })
})
