import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Falta el parámetro id' }, { status: 400 })
  }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('posted_by')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }
  return NextResponse.json({ owner: data.posted_by })
}
