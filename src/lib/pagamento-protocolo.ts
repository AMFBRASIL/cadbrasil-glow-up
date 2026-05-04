import type { RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";

export async function assertProtocoloCadastro(protocolo: string): Promise<void> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM clientes WHERE ProtocoloCadbrasil = ? LIMIT 1",
    [protocolo]
  );
  if (!Array.isArray(rows) || rows.length === 0) {
    const e = new Error("PROTOCOLO_NAO_ENCONTRADO");
    (e as Error & { code?: string }).code = "PROTOCOLO_NAO_ENCONTRADO";
    throw e;
  }
}
