import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import type { PagamentoBody } from "@/lib/validations/pagamento";
import { getPool } from "@/lib/db";
import { getValorCents } from "@/lib/efipay";

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v));
  } catch {
    return "{}";
  }
}

/** Prioriza valor em configuracoes_sistema (mesmo nome do portal fornecedor); fallback EFI_COBRANCA_VALOR_CENTS. */
export async function resolveValorCobrancaCentavos(): Promise<number> {
  try {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT valor FROM configuracoes_sistema WHERE chave = ? LIMIT 1",
      ["valor_cadastro_sicaf"]
    );
    const raw = rows[0]?.valor;
    if (raw != null && String(raw).trim() !== "") {
      const reais = parseFloat(String(raw).replace(",", "."));
      if (Number.isFinite(reais) && reais > 0) return Math.round(reais * 100);
    }
  } catch {
    /* DB opcional em dev */
  }
  return getValorCents();
}

export type ClienteSicafResolved = {
  clienteId: number;
  sicafId: number;
  razaoSocial: string;
  documento: string;
  email: string | null;
};

async function ensureSicafCadastro(conn: PoolConnection, clienteId: number): Promise<number> {
  const [rows] = await conn.query<RowDataPacket[]>(
    "SELECT id FROM sicaf_cadastros WHERE cliente_id = ? LIMIT 1",
    [clienteId]
  );
  if (rows.length > 0) return rows[0].id as number;

  const [ins] = await conn.execute<ResultSetHeader>(
    `INSERT INTO sicaf_cadastros (cliente_id, status, completude, credenciamento_anual, manutencao_ativa, dias_validade, observacoes)
     VALUES (?,?,0,0,0,0,?)`,
    [clienteId, "Pendente", "SICAF criado automaticamente — fluxo pagamento portal CADBRASIL"]
  );
  const sicafId = ins.insertId;
  await conn.execute<ResultSetHeader>(
    `INSERT INTO sicaf_niveis (sicaf_id, nivel, habilitado) VALUES (?,?,0)`,
    [sicafId, "I"]
  );
  return sicafId;
}

export async function resolveClienteSicafPorProtocolo(protocolo: string): Promise<ClienteSicafResolved | null> {
  const pool = getPool();
  const [joined] = await pool.query<RowDataPacket[]>(
    `SELECT c.id AS cliente_id, c.razao_social, c.documento, c.email, s.id AS sicaf_id
     FROM clientes c
     INNER JOIN sicaf_cadastros s ON s.cliente_id = c.id
     WHERE c.ProtocoloCadbrasil = ?
     LIMIT 1`,
    [protocolo]
  );
  if (joined.length > 0) {
    const r = joined[0];
    return {
      clienteId: r.cliente_id as number,
      sicafId: r.sicaf_id as number,
      razaoSocial: String(r.razao_social || ""),
      documento: String(r.documento || ""),
      email: r.email != null ? String(r.email) : null,
    };
  }

  const [clientes] = await pool.query<RowDataPacket[]>(
    "SELECT id, razao_social, documento, email FROM clientes WHERE ProtocoloCadbrasil = ? LIMIT 1",
    [protocolo]
  );
  if (clientes.length === 0) return null;

  const c = clientes[0];
  const clienteId = c.id as number;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sicafId = await ensureSicafCadastro(conn, clienteId);
    await conn.commit();
    return {
      clienteId,
      sicafId,
      razaoSocial: String(c.razao_social || ""),
      documento: String(c.documento || ""),
      email: c.email != null ? String(c.email) : null,
    };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

function snapshotClienteNomeDocumento(data: PagamentoBody): { nome: string; documento: string } {
  if (data.tipoPessoa === "PJ") {
    return {
      nome: (data.razaoSocial || "").trim().slice(0, 255),
      documento: (data.cnpj || "").replace(/\D/g, "").slice(0, 20),
    };
  }
  return {
    nome: data.nomeResponsavel.trim().slice(0, 255),
    documento: (data.cpf || "").replace(/\D/g, "").slice(0, 20),
  };
}

export async function ensureTaxaCadastroPortal(opts: {
  sicafId: number;
  clienteId: number;
  protocolo: string;
  valorCentavos: number;
}): Promise<number> {
  const pool = getPool();
  const ano = new Date().getFullYear();
  const descricao = `Taxa cadastro portal CADBRASIL — ${opts.protocolo}`;
  const valorReais = Math.round(opts.valorCentavos) / 100;

  const [existing] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM taxas_sicaf
     WHERE sicaf_id = ? AND cliente_id = ? AND ano_referencia = ? AND status = 'Pendente' AND descricao = ?
     LIMIT 1`,
    [opts.sicafId, opts.clienteId, ano, descricao]
  );
  if (existing.length > 0) return existing[0].id as number;

  const [ins] = await pool.execute<ResultSetHeader>(
    `INSERT INTO taxas_sicaf (sicaf_id, cliente_id, descricao, valor, ano_referencia, status)
     VALUES (?,?,?,?,?,'Pendente')`,
    [opts.sicafId, opts.clienteId, descricao, valorReais, ano]
  );
  return ins.insertId;
}

export async function insertPagamentoGerencianetAguardando(opts: {
  clienteId: number;
  taxaId: number;
  tipo: "boleto" | "pix";
  valorCentavos: number;
  protocolo: string;
  descricao: string;
  dataVencimento: string | null;
  clienteNome: string;
  clienteDocumento: string;
  clienteEmail: string;
}): Promise<number> {
  const pool = getPool();
  const valor = Math.round(opts.valorCentavos) / 100;
  const [res] = await pool.execute<ResultSetHeader>(
    `INSERT INTO pagamentos_gerencianet (
      cliente_id, origem, origem_id, tipo, valor, valor_centavos, descricao, protocolo, data_vencimento, status,
      cliente_nome, cliente_documento, cliente_email
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      opts.clienteId,
      "sicaf",
      opts.taxaId,
      opts.tipo,
      valor,
      opts.valorCentavos,
      opts.descricao.slice(0, 500),
      opts.protocolo.slice(0, 100),
      opts.dataVencimento,
      "aguardando",
      opts.clienteNome.slice(0, 255),
      opts.clienteDocumento.slice(0, 20),
      opts.clienteEmail.slice(0, 255),
    ]
  );
  return res.insertId;
}

export async function marcarPagamentoGerencianetGeradoBoleto(opts: {
  pagamentoId: number;
  taxaId: number;
  gnChargeId: number | null;
  barcode: string | null;
  link: string | null;
  pdf: string | null;
  gnResponse: unknown;
}): Promise<void> {
  const pool = getPool();
  await pool.execute(
    `UPDATE pagamentos_gerencianet SET
      status = 'gerado',
      gn_charge_id = ?,
      gn_barcode = ?,
      gn_link = ?,
      gn_pdf = ?,
      gn_response = ?
    WHERE id = ?`,
    [
      opts.gnChargeId,
      opts.barcode,
      opts.link,
      opts.pdf,
      safeJsonStringify(opts.gnResponse),
      opts.pagamentoId,
    ]
  );
  await pool.execute(
    `UPDATE taxas_sicaf SET forma_pagamento = 'Boleto', codigo_barras = ?, chave_pix = NULL WHERE id = ?`,
    [opts.barcode, opts.taxaId]
  );
}

export async function marcarPagamentoGerencianetGeradoPix(opts: {
  pagamentoId: number;
  taxaId: number;
  txid: string | null;
  locId: number | null;
  pixCopiaECola: string;
  qrBase64: string | null;
  gnResponse: unknown;
}): Promise<void> {
  const pool = getPool();
  await pool.execute(
    `UPDATE pagamentos_gerencianet SET
      status = 'gerado',
      gn_txid = ?,
      gn_loc_id = ?,
      gn_qrcode_text = ?,
      gn_qrcode_image = ?,
      gn_response = ?
    WHERE id = ?`,
    [
      opts.txid,
      opts.locId,
      opts.pixCopiaECola,
      opts.qrBase64,
      safeJsonStringify(opts.gnResponse),
      opts.pagamentoId,
    ]
  );
  if (opts.pixCopiaECola.length <= 255) {
    await pool.execute(`UPDATE taxas_sicaf SET forma_pagamento = 'PIX', chave_pix = ?, codigo_barras = NULL WHERE id = ?`, [
      opts.pixCopiaECola,
      opts.taxaId,
    ]);
  } else {
    await pool.execute(`UPDATE taxas_sicaf SET forma_pagamento = 'PIX', codigo_barras = NULL WHERE id = ?`, [opts.taxaId]);
  }
}

export async function marcarPagamentoGerencianetErro(pagamentoId: number, mensagem: string): Promise<void> {
  const pool = getPool();
  await pool.execute(`UPDATE pagamentos_gerencianet SET status = 'erro', gn_error = ? WHERE id = ?`, [
    mensagem.slice(0, 65000),
    pagamentoId,
  ]);
}

export function dadosPagamentoParaInsert(data: PagamentoBody): {
  clienteNome: string;
  clienteDocumento: string;
  clienteEmail: string;
} {
  const snap = snapshotClienteNomeDocumento(data);
  return {
    clienteNome: snap.nome,
    clienteDocumento: snap.documento,
    clienteEmail: data.email.trim().toLowerCase().slice(0, 255),
  };
}
