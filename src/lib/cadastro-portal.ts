import type { CadastroData } from "@/lib/validations/cadastro";

const onlyDigits = (s: string) => (s || "").replace(/\D/g, "");

export function iniciaisNome(nome: string): string {
  const p = nome.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "??";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

/** Endereço único em clientes.endereco (logradouro, número, complemento, bairro). */
export function montarEnderecoCliente(d: {
  rua: string;
  numero: string;
  complemento?: string | null;
  bairro?: string | null;
}): string | null {
  const parts = [d.rua?.trim(), d.numero?.trim(), d.complemento?.trim(), d.bairro?.trim()].filter(Boolean);
  if (parts.length === 0) return null;
  return parts.join(", ");
}

/** ENUM porte em SQL_SISTEMA_NOVO: MEI, ME, EPP, Média, Grande */
export function mapPorteSql(porte: string | undefined): string {
  const p = (porte || "").toUpperCase();
  if (p === "MEDIA") return "Média";
  if (p === "GRANDE") return "Grande";
  if (p === "MEI" || p === "ME" || p === "EPP") return p;
  return "ME";
}

/** tipoServico do backend legado: renovacao | novo */
export function mapTipoServico(servico: string): string {
  if (servico.includes("Atualização") || servico.toLowerCase().includes("renova")) return "renovacao";
  return "novo";
}

export function montarObservacoesCliente(
  protocolo: string,
  data: CadastroData,
  tipoServico: string
): string {
  const seg = data.segmento?.trim() || "";
  const obj = `${data.possuiSicaf}|${data.prioritario}`;
  const extra = data.observacoes?.trim();
  const lines = [
    `Protocolo: ${protocolo}`,
    "Origem: site",
    `Tipo de serviço: ${tipoServico}`,
    `SICAF atual: ${data.possuiSicaf} | Prioritário: ${data.prioritario}`,
    seg ? `Segmento: ${seg} | Objetivo: ${obj}` : `Objetivo: ${obj}`,
  ];
  if (extra) lines.push(`Observações: ${extra}`);
  return lines.join("\n");
}

/** Documento principal do cliente: CNPJ mascarado (PJ) ou CPF mascarado (PF). */
export function documentoClienteMasked(data: CadastroData): string {
  if (data.tipoPessoa === "PJ") return (data.cnpj || "").trim();
  return (data.cpf || "").trim();
}

export function documentoClienteDigits(data: CadastroData): string {
  if (data.tipoPessoa === "PJ") return onlyDigits(data.cnpj || "");
  return onlyDigits(data.cpf || "");
}

export function tipoDocumentoSql(data: CadastroData): "CPF" | "CNPJ" {
  return data.tipoPessoa === "PJ" ? "CNPJ" : "CPF";
}

export function razaoSocialParaCliente(data: CadastroData): string {
  if (data.tipoPessoa === "PJ") return data.razaoSocial?.trim() || "";
  return data.nomeResponsavel?.trim() || "";
}

export type UtmPayload = {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  gad_source?: string | null;
  gad_campaignid?: string | null;
  msclkid?: string | null;
  fbclid?: string | null;
  landing_page?: string | null;
  referrer?: string | null;
};

export function extrairUtmDoBody(body: Record<string, unknown>): UtmPayload {
  const s = (k: string) => {
    const v = body[k];
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };
  return {
    utm_source: s("utm_source"),
    utm_medium: s("utm_medium"),
    utm_campaign: s("utm_campaign") || s("gad_campaignid"),
    utm_term: s("utm_term"),
    utm_content: s("utm_content"),
    gclid: s("gclid"),
    gbraid: s("gbraid"),
    wbraid: s("wbraid"),
    gad_source: s("gad_source"),
    gad_campaignid: s("gad_campaignid"),
    msclkid: s("msclkid"),
    fbclid: s("fbclid"),
    landing_page: s("landing_page"),
    referrer: s("referrer"),
  };
}

export function novoSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
