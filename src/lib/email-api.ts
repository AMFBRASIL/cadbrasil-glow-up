/**
 * Envio de e-mail via API HTTP (send.cadbr.com.br / sendCron).
 * @see docs/EMAIL_API_ENVIO.md
 */

import type { RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";

export type EmailApiPayload = {
  email_destino: string;
  nome_destino: string;
  assunto: string;
  corpo_html: string;
  corpo_texto: string;
  prioridade: 1;
  max_tentativas: 3;
  id_dominio: null;
  data_agendamento: null;
};

export function escapeHtml(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** API considerada não configurada (placeholder em .env). */
export function isEmailApiPlaceholder(): boolean {
  const raw = process.env.EMAIL_API_URL?.trim() || "";
  return raw.includes("your-");
}

export function getEmailApiUrl(): string {
  const raw = process.env.EMAIL_API_URL?.trim();
  if (raw && !raw.includes("your-") && raw.length > 0) return raw;
  return "https://send.cadbr.com.br/sendCron";
}

type EmailTemplateRow = RowDataPacket & {
  id: number;
  nome: string;
  assunto: string | null;
  corpo_html: string | null;
  ativo: number;
};

type WelcomeTemplateData = {
  nome: string;
  email: string;
  empresa: string;
  perfil: string;
  link_acesso: string;
  protocolo: string;
  servico: string;
};

function getPortalAccessUrl(): string {
  const url = process.env.PORTAL_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) return url;
  return "https://fornecedor.cadbrasil.com.br";
}

function renderPlaceholders(
  template: string,
  vars: Record<string, string>,
  opts?: { escapeValues?: boolean }
): string {
  const map = Object.entries(vars).reduce<Record<string, string>>((acc, [k, v]) => {
    acc[k.toLowerCase()] = v ?? "";
    return acc;
  }, {});
  return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (full, key: string) => {
    const val = map[key.toLowerCase()];
    if (val === undefined) return full;
    return opts?.escapeValues ? escapeHtml(val) : val;
  });
}

async function getWelcomeTemplateFromDb(): Promise<EmailTemplateRow | null> {
  try {
    const pool = getPool();
    const [rows] = await pool.query<EmailTemplateRow[]>(
      "SELECT id, nome, assunto, corpo_html, ativo FROM templates_email WHERE id = ? LIMIT 1",
      [1]
    );
    if (!rows.length) return null;
    const row = rows[0];
    if (!row.ativo || !row.corpo_html) return null;
    return row;
  } catch (e) {
    console.warn("[email-api] Falha ao carregar template id=1 (usando fallback):", e);
    return null;
  }
}

export async function postSendCron(payload: EmailApiPayload): Promise<unknown> {
  if (isEmailApiPlaceholder()) {
    throw new Error("EMAIL_API_URL contém placeholder (your-); envio desativado.");
  }
  const url = getEmailApiUrl();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function assuntoBoasVindas(): string {
  const hora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  return `Boas vindas - Sistema CADBRASIL SICAF - ${hora}`;
}

function getCadastroWelcomeHtml(d: {
  nomeResponsavel: string;
  razaoSocial: string;
  protocolo: string;
  tipoServico: string;
  servicoLabel: string;
  emailAcesso: string;
}): string {
  const nome = escapeHtml(d.nomeResponsavel);
  const empresa = escapeHtml(d.razaoSocial);
  const proto = escapeHtml(d.protocolo);
  const serv = escapeHtml(d.servicoLabel || d.tipoServico);
  const login = escapeHtml(d.emailAcesso);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f0f4f8;padding:24px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(30,64,175,.12);">
    <tr><td style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:28px 24px;color:#fff;">
      <h1 style="margin:0;font-size:20px;">CADBRASIL</h1>
      <p style="margin:8px 0 0;font-size:14px;opacity:.9;">Bem-vindo ao sistema SICAF</p>
    </td></tr>
    <tr><td style="padding:28px 24px;color:#334155;line-height:1.6;font-size:15px;">
      <p>Olá, <strong>${nome}</strong>,</p>
      <p>Seu cadastro foi registrado com sucesso para <strong>${empresa}</strong>.</p>
      <p><strong>Protocolo:</strong> ${proto}</p>
      <p><strong>Serviço de interesse:</strong> ${serv}</p>
      <p>Use o e-mail <strong>${login}</strong> e a senha definida no cadastro para acessar o portal.</p>
      <p style="font-size:13px;color:#64748b;">Em caso de dúvida, responda este e-mail ou fale com nosso suporte.</p>
    </td></tr>
    <tr><td style="padding:16px 24px;background:#f8fafc;font-size:12px;color:#94a3b8;text-align:center;">
      CADBRASIL · Licitações e SICAF
    </td></tr>
  </table>
</body></html>`;
}

function getCadastroWelcomeText(d: {
  nomeResponsavel: string;
  razaoSocial: string;
  protocolo: string;
  tipoServico: string;
  servicoLabel: string;
  emailAcesso: string;
}): string {
  return [
    `Olá, ${d.nomeResponsavel}`,
    "",
    `Seu cadastro foi registrado para ${d.razaoSocial}.`,
    `Protocolo: ${d.protocolo}`,
    `Serviço: ${d.servicoLabel || d.tipoServico}`,
    `Acesso ao portal: e-mail ${d.emailAcesso} e a senha que você definiu.`,
    "",
    "CADBRASIL",
  ].join("\n");
}

/** E-mail ao cliente (boas-vindas). Falha → throw (caller faz catch). */
export async function enviarEmailCadastro(d: {
  emailResponsavel: string;
  nomeResponsavel: string;
  razaoSocial: string;
  protocolo: string;
  tipoServico: string;
  servicoLabel: string;
  emailAcesso: string;
}): Promise<void> {
  if (isEmailApiPlaceholder()) {
    console.warn("[email-api] Envio ignorado: EMAIL_API_URL é placeholder.");
    return;
  }
  const vars: WelcomeTemplateData = {
    nome: d.nomeResponsavel,
    email: d.emailAcesso,
    empresa: d.razaoSocial,
    perfil: d.servicoLabel || d.tipoServico,
    link_acesso: getPortalAccessUrl(),
    protocolo: d.protocolo,
    servico: d.servicoLabel || d.tipoServico,
  };
  const dbTemplate = await getWelcomeTemplateFromDb();
  const assunto = dbTemplate?.assunto
    ? renderPlaceholders(dbTemplate.assunto, vars, { escapeValues: false })
    : assuntoBoasVindas();
  const corpoHtml = dbTemplate?.corpo_html
    ? renderPlaceholders(dbTemplate.corpo_html, vars, { escapeValues: true })
    : getCadastroWelcomeHtml(d);
  const payload: EmailApiPayload = {
    email_destino: d.emailResponsavel,
    nome_destino: d.razaoSocial,
    assunto,
    corpo_html: corpoHtml,
    corpo_texto: getCadastroWelcomeText(d),
    prioridade: 1,
    max_tentativas: 3,
    id_dominio: null,
    data_agendamento: null,
  };
  const result = await postSendCron(payload);
  console.log("[email-api] Boas-vindas enviado:", d.emailResponsavel, result);
}

function getNotificacaoInternaHtml(d: {
  razaoSocial: string;
  documentoMasked: string;
  protocolo: string;
  tipoServico: string;
  servicoLabel: string;
  emailResponsavel: string;
}): string {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/></head><body style="font-family:system-ui,sans-serif;padding:16px;">
<h2 style="color:#1e3a5f;">Novo cadastro — CADBRASIL</h2>
<table style="border-collapse:collapse;font-size:14px;">
<tr><td style="padding:6px 12px 6px 0;color:#64748b;">Empresa</td><td><strong>${escapeHtml(d.razaoSocial)}</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b;">Documento</td><td>${escapeHtml(d.documentoMasked)}</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b;">Protocolo</td><td>${escapeHtml(d.protocolo)}</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b;">Serviço</td><td>${escapeHtml(d.servicoLabel || d.tipoServico)}</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b;">E-mail responsável</td><td>${escapeHtml(d.emailResponsavel)}</td></tr>
</table>
</body></html>`;
}

/** Notificação interna; não relança erro — retorna resultado. */
export async function enviarEmailNotificacao(d: {
  razaoSocial: string;
  documentoMasked: string;
  protocolo: string;
  tipoServico: string;
  servicoLabel: string;
  emailResponsavel: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  const destino = process.env.EMAIL_NOTIFICATION_EMAIL?.trim();
  if (!destino) {
    return { success: false, error: "EMAIL_NOTIFICATION_EMAIL não configurado." };
  }
  if (isEmailApiPlaceholder()) {
    return { success: false, error: "EMAIL_API_URL é placeholder." };
  }
  try {
    const assunto = `[CADBRASIL] Novo Cadastro - ${d.protocolo}`;
    const payload: EmailApiPayload = {
      email_destino: destino,
      nome_destino: "Equipe CADBRASIL",
      assunto,
      corpo_html: getNotificacaoInternaHtml(d),
      corpo_texto: [
        "Novo cadastro",
        `Empresa: ${d.razaoSocial}`,
        `Documento: ${d.documentoMasked}`,
        `Protocolo: ${d.protocolo}`,
        `Serviço: ${d.servicoLabel || d.tipoServico}`,
        `E-mail responsável: ${d.emailResponsavel}`,
      ].join("\n"),
      prioridade: 1,
      max_tentativas: 3,
      id_dominio: null,
      data_agendamento: null,
    };
    await postSendCron(payload);
    console.log("[email-api] Notificação interna enviada para", destino);
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[email-api] enviarEmailNotificacao", e);
    return { success: false, error: msg };
  }
}

/** Pós-cadastro: boas-vindas + opcional notificação interna (não afeta HTTP 201). */
export async function dispararEmailsPosCadastro(d: {
  emailResponsavel: string;
  nomeResponsavel: string;
  razaoSocial: string;
  documentoMasked: string;
  emailAcesso: string;
  protocolo: string;
  tipoServico: string;
  servicoLabel: string;
  aceitaNotificacoes: boolean;
}): Promise<void> {
  const boasVindas = enviarEmailCadastro({
    emailResponsavel: d.emailResponsavel,
    nomeResponsavel: d.nomeResponsavel,
    razaoSocial: d.razaoSocial,
    protocolo: d.protocolo,
    tipoServico: d.tipoServico,
    servicoLabel: d.servicoLabel,
    emailAcesso: d.emailAcesso,
  }).catch((e) => {
    console.error("[cadastro] enviarEmailCadastro", e);
  });

  if (!d.aceitaNotificacoes) {
    await boasVindas;
    return;
  }

  const notif = enviarEmailNotificacao({
    razaoSocial: d.razaoSocial,
    documentoMasked: d.documentoMasked,
    protocolo: d.protocolo,
    tipoServico: d.tipoServico,
    servicoLabel: d.servicoLabel,
    emailResponsavel: d.emailResponsavel,
  }).then((r) => {
    if (r.success === false) console.warn("[cadastro] enviarEmailNotificacao", r.error);
  });

  await Promise.all([boasVindas, notif]);
}
