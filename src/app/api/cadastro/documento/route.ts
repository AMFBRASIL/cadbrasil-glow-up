import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function docNormalizedExpr(column: string): string {
  return `REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(${column}, '.', ''), '/', ''), '-', ''), ' ', ''), '_', '')`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documento = onlyDigits(searchParams.get("documento") || "");

  if (documento.length !== 11 && documento.length !== 14) {
    return NextResponse.json({ error: "Documento inválido" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM clientes WHERE ${docNormalizedExpr("documento")} = ? LIMIT 1`,
      [documento]
    );

    return NextResponse.json({ exists: rows.length > 0 });
  } catch {
    return NextResponse.json({ error: "Não foi possível verificar o documento" }, { status: 500 });
  }
}
