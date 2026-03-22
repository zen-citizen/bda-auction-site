/**
 * Single source for auction timeline: dates, short ranges for lists/filters, and
 * which site serial numbers each round covers (must match `biddingSession` in site data).
 *
 * Mapping: `biddingSession === n` on a site → `rounds[n - 1]` here (Round 1 → index 0).
 * Update this file for each new auction; keep `rounds.length` in sync with
 * `biddingSession` values in `sites.json`.
 */
export const auctionSchedule = {
  commencement: '27 January 2026',
  lastDayExpressInterest: '13 February 2026, 17:00 PM',
  rounds: [
    {
      startDisplay: '16 February 2026, 11:00 AM',
      endDisplay: '17 February 2026, 17:00 PM',
      shortRange: '16-17 Feb 2026',
      sitesRange: '1 - 42',
    },
    {
      startDisplay: '17 February 2026, 11:00 AM',
      endDisplay: '18 February 2026, 17:00 PM',
      shortRange: '17-18 Feb 2026',
      sitesRange: '43 - 83',
    },
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
