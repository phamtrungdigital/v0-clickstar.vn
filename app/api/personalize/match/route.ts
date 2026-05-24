// POST /api/personalize/match
// Input: { visited_pages, current_path, device, is_returning, total_visits }
// Output: { campaign: PersonalizeCampaign | null }
//
// Returns the highest-priority enabled campaign matching current context.
// Client-safe: only returns campaign metadata (no internal flags).

import { z } from 'zod'
import { getActiveCampaigns } from '@/lib/personalize/campaigns'
import { matchCampaign, type MatchContext } from '@/lib/personalize/campaign-types'

export const runtime = 'nodejs'
export const maxDuration = 10

const InputSchema = z.object({
  visited_pages: z.array(z.string()).max(50),
  current_path: z.string(),
  device: z.enum(['desktop', 'mobile']),
  is_returning: z.boolean(),
  total_visits: z.number().int().nonnegative(),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ campaign: null, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = InputSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ campaign: null, error: 'invalid_input' }, { status: 400 })
  }

  const ctx: MatchContext = parsed.data

  const campaigns = await getActiveCampaigns()
  const matched = campaigns.find((c) => matchCampaign(c, ctx)) ?? null

  return Response.json(
    { campaign: matched },
    {
      status: 200,
      headers: { 'Cache-Control': 'private, max-age=60' }, // 60s cache
    },
  )
}
