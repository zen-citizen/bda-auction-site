/**
 * Single source for auction timeline: dates, short ranges for lists/filters, and
 * which site serial numbers each round covers (must match `biddingSession` in site data).
 *
 * Mapping: `biddingSession === n` on a site → `rounds[n - 1]` here (Round 1 → index 0).
 * Update this file for each new auction; keep `rounds.length` in sync with
 * `biddingSession` values in `sites.json`.
 */
export const auctionSchedule = {
  commencement: '12 March 2026',
  lastDayExpressInterest: '23 March 2026, 17:00 PM',
  rounds: [
    {
      startDisplay: '24 March 2026, 11:00 AM',
      endDisplay: '25 March 2026, 17:00 PM',
      shortRange: '24-25 Mar 2026',
      sitesRange: '1 - 42',
    },
    {
      startDisplay: '25 March 2026, 11:00 AM',
      endDisplay: '26 March 2026, 17:00 PM',
      shortRange: '25-26 Mar 2026',
      sitesRange: '43 - 83',
    },
    {
      startDisplay: '26 March 2026, 11:00 AM',
      endDisplay: '27 March 2026, 17:00 PM',
      shortRange: '26-27 Mar 2026',
      sitesRange: '84 - 125',
    }
  ],
}

/**
 * @param {number|string|null|undefined} session - 1-based `biddingSession` from site data
 * @returns {{ startDisplay: string, endDisplay: string, shortRange: string, sitesRange: string } | null}
 */
export function getRoundBySession(session) {
  if (session == null || session === '') return null
  const n = typeof session === 'string' ? parseInt(session, 10) : Number(session)
  if (!Number.isFinite(n) || n < 1) return null
  return auctionSchedule.rounds[n - 1] ?? null
}
