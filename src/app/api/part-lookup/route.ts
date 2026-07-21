import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

// Server-side proxy to the Florence Stock Sheet's part-lookup API. The shared secret lives only
// here (never sent to the browser) — the client calls this same-origin route instead.
export async function GET(req: NextRequest) {
  const partNumber = req.nextUrl.searchParams.get('partNumber')?.trim();
  if (!partNumber) return NextResponse.json({ error: 'partNumber query param is required' }, { status: 400 });

  const { env } = await getCloudflareContext({ async: true });
  if (!env.STOCK_SHEET_BASE_URL || !env.PART_LOOKUP_API_KEY) {
    return NextResponse.json({ error: 'Part lookup is not configured' }, { status: 500 });
  }

  const res = await fetch(`${env.STOCK_SHEET_BASE_URL}/api/public/part-lookup?partNumber=${encodeURIComponent(partNumber)}`, {
    headers: { 'X-Api-Key': env.PART_LOOKUP_API_KEY },
  });

  if (!res.ok) return NextResponse.json({ found: false }, { status: res.status === 401 ? 500 : 200 });
  const data = await res.json();
  return NextResponse.json(data);
}
