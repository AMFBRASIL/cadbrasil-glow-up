import { NextResponse } from "next/server";
import { getPool, isDbConfigured } from "@/lib/db";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, db: false, configured: false }, { status: 503 });
  }
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT 1 AS ok");
    return NextResponse.json({ ok: true, db: Array.isArray(rows) && rows.length > 0 });
  } catch (e) {
    console.error("[health]", e);
    return NextResponse.json({ ok: false, db: false }, { status: 503 });
  }
}

export const dynamic = "force-dynamic";
