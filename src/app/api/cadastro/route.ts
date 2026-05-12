import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import { cadastroBodySchema } from "@/lib/validations/cadastro";
import { getPool } from "@/lib/db";
import { gerarProtocoloCadbrasil } from "@/lib/protocolo";
import {
  documentoClienteDigits,
  documentoClienteMasked,
  extrairUtmDoBody,
  iniciaisNome,
  mapPorteSql,
  mapTipoServico,
  montarEnderecoCliente,
  montarObservacoesCliente,
  novoSessionId,
  razaoSocialParaCliente,
  tipoDocumentoSql,
} from "@/lib/cadastro-portal";
import { dispararEmailsPosCadastro } from "@/lib/email-api";

export const dynamic = "force-dynamic";
/** Permite concluir envio de e-mails após a resposta HTTP (Vercel + waitUntil). */
export const maxDuration = 60;

function docNormalizedExpr(column: string): string {
  return `REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(${column}, '.', ''), '/', ''), '-', ''), ' ', ''), '_', '')`;
}

function isMysqlDup(e: unknown): boolean {
  return typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "ER_DUP_ENTRY";
}

function isMysqlBadField(e: unknown): boolean {
  return typeof e === "object" && e !== null && "errno" in e && (e as { errno: number }).errno === 1054;
}

async function insertClienteContato(
  conn: PoolConnection,
  clienteId: number,
  nome: string,
  cpfDigits: string,
  cargo: string | null,
  email: string,
  telefone: string | null
): Promise<void> {
  const sqlComCpf = `INSERT INTO cliente_contatos (cliente_id, nome, cpf, cargo, email, telefone, principal) VALUES (?,?,?,?,?,?,1)`;
  const valsComCpf = [clienteId, nome, cpfDigits || null, cargo, email, telefone];
  try {
    await conn.execute<ResultSetHeader>(sqlComCpf, valsComCpf);
  } catch (e) {
    if (!isMysqlBadField(e)) throw e;
    await conn.execute<ResultSetHeader>(
      `INSERT INTO cliente_contatos (cliente_id, nome, cargo, email, telefone, principal) VALUES (?,?,?,?,?,1)`,
      [clienteId, nome, cargo, email, telefone]
    );
  }
}

async function insertTrackingPosCommit(
  pool: ReturnType<typeof getPool>,
  clienteId: number,
  usuarioId: number,
  body: Record<string, unknown>,
  userAgent: string | null
): Promise<void> {
  const utm = extrairUtmDoBody(body);
  const sessionId = novoSessionId();
  const sql = `INSERT INTO tracking_sessoes (
    session_id, cliente_id, usuario_id,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    gclid, gbraid, wbraid, gad_source, gad_campaignid, fbclid, msclkid, landing_page, referrer,
    user_agent, converted, conversion_type, conversion_at, funnel_step, last_activity_at
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,'signup',NOW(),'signup',NOW())`;
  const params = [
    sessionId,
    clienteId,
    usuarioId,
    utm.utm_source,
    utm.utm_medium,
    utm.utm_campaign,
    utm.utm_term,
    utm.utm_content,
    utm.gclid,
    utm.gbraid,
    utm.wbraid,
    utm.gad_source,
    utm.gad_campaignid,
    utm.fbclid,
    utm.msclkid,
    utm.landing_page,
    utm.referrer,
    userAgent,
  ];
  try {
    await pool.execute(sql, params);
  } catch (e) {
    console.warn("[cadastro] tracking_sessoes (não bloqueante)", e);
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido", success: false }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Corpo inválido", success: false }, { status: 400 });
  }

  const parsed = cadastroBodySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      Object.values(first).flat()[0] ||
      parsed.error.issues[0]?.message ||
      "Dados inválidos";
    return NextResponse.json({ error: msg, success: false, issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const docDigits = documentoClienteDigits(data);
  const emailResponsavel = data.email.trim().toLowerCase();
  const emailAcesso = (data.emailAcesso?.trim() || data.email).trim().toLowerCase();
  const telefoneDigits = data.telefone.replace(/\D/g, "");
  const telefoneSql = telefoneDigits || null;
  const cpfRespDigits = (data.cpf || "").replace(/\D/g, "") || null;
  const tipoServico = mapTipoServico(data.servico);
  const protocolo = gerarProtocoloCadbrasil();
  const observacoesCliente = montarObservacoesCliente(protocolo, data, tipoServico);
  const endereco = montarEnderecoCliente({
    rua: data.rua,
    numero: data.numero,
    complemento: data.complemento,
    bairro: data.bairro,
  });
  const userAgent = req.headers.get("user-agent");
  const ipAssinatura =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;

  const pool = getPool();
  let conn: PoolConnection | undefined;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [dupDoc] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM clientes WHERE ${docNormalizedExpr("documento")} = ? LIMIT 1`,
      [docDigits]
    );
    if (dupDoc.length > 0) {
      await conn.rollback();
      conn.release();
      conn = undefined;
      return NextResponse.json(
        { error: "Já existe cliente com este CPF/CNPJ.", success: false },
        { status: 409 }
      );
    }

    const [dupEmail] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
      [emailAcesso]
    );
    if (dupEmail.length > 0) {
      await conn.rollback();
      conn.release();
      conn = undefined;
      return NextResponse.json(
        {
          error: "Já existe cadastro com este e-mail de acesso. Use outro e-mail ou recupere a senha.",
          success: false,
        },
        { status: 409 }
      );
    }

    const [perfilRows] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM perfis_acesso WHERE tipo = 'cliente' AND ativo = 1 ORDER BY id ASC LIMIT 1"
    );
    const perfilId = perfilRows[0]?.id as number | undefined;
    if (!perfilId) {
      await conn.rollback();
      conn.release();
      conn = undefined;
      return NextResponse.json(
        {
          error: "Perfil de acesso do cliente não configurado na base nova.",
          success: false,
        },
        { status: 500 }
      );
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);
    const iniciais = iniciaisNome(data.nomeResponsavel);

    const [uRes] = await conn.execute<ResultSetHeader>(
      `INSERT INTO usuarios (nome, email, senha_hash, telefone, avatar_iniciais, departamento, perfil_id, status)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        data.nomeResponsavel.trim(),
        emailAcesso,
        senhaHash,
        telefoneSql,
        iniciais,
        "Portal Cliente",
        perfilId,
        "Ativo",
      ]
    );
    const idUsuario = uRes.insertId;

    const tipoDoc = tipoDocumentoSql(data);
    const docMasked = documentoClienteMasked(data);
    const razao = razaoSocialParaCliente(data);
    const porteSql = data.tipoPessoa === "PJ" ? mapPorteSql(data.porte) : "ME";
    const ie = data.tipoPessoa === "PJ" ? data.inscricaoEstadual?.trim() || null : null;
    const ramo = data.segmento?.trim() || null;

    const [cRes] = await conn.execute<ResultSetHeader>(
      `INSERT INTO clientes (
        usuario_id, tipo_documento, documento, razao_social, nome_fantasia, inscricao_estadual,
        email, telefone, celular, endereco, cidade, estado, cep, porte, ramo_atividade,
        responsavel_nome, responsavel_cpf, responsavel_email, responsavel_telefone,
        status, observacoes, ProtocoloCadbrasil
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        idUsuario,
        tipoDoc,
        docMasked,
        razao,
        data.nomeFantasia?.trim() || null,
        ie,
        emailResponsavel,
        telefoneSql,
        telefoneSql,
        endereco,
        data.cidade.trim(),
        data.estado.toUpperCase(),
        data.cep.replace(/\D/g, ""),
        porteSql,
        ramo,
        data.nomeResponsavel.trim(),
        cpfRespDigits,
        emailResponsavel,
        telefoneSql,
        "Ativo",
        observacoesCliente,
        protocolo,
      ]
    );
    const idCliente = cRes.insertId;

    const [sRes] = await conn.execute<ResultSetHeader>(
      `INSERT INTO sicaf_cadastros (cliente_id, status, completude, credenciamento_anual, manutencao_ativa, dias_validade, observacoes)
       VALUES (?,?,0,0,0,0,?)`,
      [idCliente, "Pendente", "Cadastro inicial via site CADBRASIL"]
    );
    const idSicaf = sRes.insertId;

    await conn.execute<ResultSetHeader>(
      `INSERT INTO sicaf_niveis (sicaf_id, nivel, habilitado) VALUES (?,?,0)`,
      [idSicaf, "I"]
    );

    if (data.nomeResponsavel.trim()) {
      await insertClienteContato(
        conn,
        idCliente,
        data.nomeResponsavel.trim(),
        cpfRespDigits || "",
        data.cargo?.trim() || null,
        emailResponsavel,
        telefoneSql
      );
    }

    const hoje = new Date();
    const inicio = hoje.toISOString().slice(0, 10);
    const fim = new Date(hoje);
    fim.setFullYear(fim.getFullYear() + 1);
    const vencimento = fim.toISOString().slice(0, 10);

    const [ctrRes] = await conn.execute<ResultSetHeader>(
      `INSERT INTO contratos_digitais (
        cliente_id, plano, data_inicio, data_vencimento, status, assinado_em, assinado_por, ip_assinatura, observacoes
      ) VALUES (?,?,?,?,?,NOW(),?,?,?)`,
      [
        idCliente,
        "Licença + Manutenção",
        inicio,
        vencimento,
        "Assinado",
        data.nomeResponsavel.trim(),
        ipAssinatura,
        `Contrato digital automático — protocolo ${protocolo}`,
      ]
    );
    const idContrato = ctrRes.insertId;

    await conn.commit();
    conn.release();
    conn = undefined;

    await insertTrackingPosCommit(pool, idCliente, idUsuario, body as Record<string, unknown>, userAgent);

    waitUntil(
      dispararEmailsPosCadastro({
        emailResponsavel,
        nomeResponsavel: data.nomeResponsavel.trim(),
        razaoSocial: razaoSocialParaCliente(data),
        documentoMasked: documentoClienteMasked(data),
        emailAcesso,
        protocolo,
        tipoServico,
        servicoLabel: data.servico,
        aceitaNotificacoes: Boolean(data.aceitaNotificacoes),
        plano: "Licença + Manutenção",
        dataInicio: inicio,
        dataVencimento: vencimento,
      }).catch((err) => console.error("[cadastro] dispararEmailsPosCadastro", err))
    );

    return NextResponse.json(
      {
        success: true,
        protocolo,
        idUsuario,
        idCliente,
        idPedido: idContrato,
      },
      { status: 201 }
    );
  } catch (e) {
    if (conn) {
      try {
        await conn.rollback();
      } catch {
        /* ignore */
      }
      conn.release();
    }
    if (isMysqlDup(e)) {
      return NextResponse.json(
        { error: "Dado duplicado. Verifique CPF/CNPJ ou e-mail de acesso.", success: false },
        { status: 409 }
      );
    }
    console.error("[cadastro]", e);
    const msg =
      process.env.NODE_ENV === "development" && e instanceof Error
        ? e.message
        : "Erro ao processar cadastro. Tente novamente.";
    return NextResponse.json({ error: msg, success: false }, { status: 500 });
  }
}
