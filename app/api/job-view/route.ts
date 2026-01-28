import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Aquí podrías guardar la vista en la base de datos
  return NextResponse.json({ ok: true })
}

export function GET() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405 })
}
