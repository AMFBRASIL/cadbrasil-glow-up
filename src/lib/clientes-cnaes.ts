import type { ResultSetHeader } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import { dedupeCnaes, normalizeCnaeCodigo, type CnaeItem, type CnaeTipo } from "@/lib/cnae";

export type ClienteCnaeRow = {
  cnae_codigo: string;
  descricao: string;
  tipo: CnaeTipo;
  ordem: number;
};

export function mapCnaesParaInsert(cnaes: CnaeItem[]): ClienteCnaeRow[] {
  const deduped = dedupeCnaes(cnaes);
  let ordemSecundario = 1;

  return deduped.map((item) => ({
    cnae_codigo: normalizeCnaeCodigo(item.codigo),
    descricao: item.descricao.trim().slice(0, 255),
    tipo: item.tipo,
    ordem: item.tipo === "principal" ? 0 : ordemSecundario++,
  }));
}

export async function insertClientesCnaes(
  conn: PoolConnection,
  clienteId: number,
  cnaes: CnaeItem[]
): Promise<number> {
  const rows = mapCnaesParaInsert(cnaes);
  if (rows.length === 0) return 0;

  let inserted = 0;
  for (const row of rows) {
    await conn.execute<ResultSetHeader>(
      `INSERT INTO clientes_cnaes (cliente_id, cnae_codigo, descricao, tipo, ordem) VALUES (?,?,?,?,?)`,
      [clienteId, row.cnae_codigo, row.descricao, row.tipo, row.ordem]
    );
    inserted += 1;
  }
  return inserted;
}
