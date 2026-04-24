import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

function dbEnvOk(): boolean {
  return Boolean(
    process.env.DB_HOST &&
      process.env.DB_USER &&
      process.env.DB_PASSWORD !== undefined &&
      process.env.DB_NAME
  );
}

export async function GET() {
  if (!dbEnvOk()) {
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
