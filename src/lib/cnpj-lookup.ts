import { dedupeCnaes, pickCnaeCodigo, principalCnaeCodigo, type CnaeItem } from "@/lib/cnae";

export type CnpjLookupResult = {
  razao_social: string;
  nome_fantasia: string;
  inscricao_estadual: string;
  porte: string;
  cnae_principal_codigo: string;
  cnae_fiscal_descricao: string;
  cnaes: CnaeItem[];
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  ddd_telefone_1: string;
  email: string;
};

type CnpjWsAtividade = {
  id?: string | number | null;
  subclasse?: string | null;
  descricao?: string | null;
};

type CnpjWsResponse = {
  razao_social?: string | null;
  porte?: {
    descricao?: string | null;
  } | null;
  estabelecimento?: {
    nome_fantasia?: string | null;
    tipo_logradouro?: string | null;
    logradouro?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cep?: string | null;
    ddd1?: string | null;
    telefone1?: string | null;
    email?: string | null;
    atividade_principal?: CnpjWsAtividade | null;
    atividades_secundarias?: CnpjWsAtividade[] | null;
    cidade?: {
      nome?: string | null;
    } | null;
    estado?: {
      sigla?: string | null;
    } | null;
    inscricoes_estaduais?: Array<{
      inscricao_estadual?: string | null;
      ativo?: boolean | null;
      estado?: {
        sigla?: string | null;
      } | null;
    }> | null;
  } | null;
};

export function onlyDigitsCnpj(value: string): string {
  return value.replace(/\D/g, "");
}

function normalizePorte(descricao?: string | null): string {
  const normalized = (descricao || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("micro empreendedor") || normalized.includes("mei")) return "MEI";
  if (normalized.includes("pequeno")) return "EPP";
  if (normalized.includes("micro")) return "ME";
  if (normalized.includes("demais")) return "MEDIA";
  return "MEDIA";
}

function buildLogradouro(tipo?: string | null, logradouro?: string | null): string {
  return [tipo, logradouro].filter(Boolean).join(" ").trim();
}

function pickInscricaoEstadual(data: CnpjWsResponse): string {
  const inscricoes = data.estabelecimento?.inscricoes_estaduais || [];
  const uf = data.estabelecimento?.estado?.sigla;
  const inscricao =
    inscricoes.find((item) => item.ativo && item.estado?.sigla === uf) ||
    inscricoes.find((item) => item.ativo) ||
    inscricoes[0];

  return inscricao?.inscricao_estadual || "";
}

function mapAtividade(atividade: CnpjWsAtividade, tipo: CnaeItem["tipo"]): CnaeItem | null {
  const descricao = atividade.descricao?.trim();
  if (!descricao) return null;
  const codigo = pickCnaeCodigo(atividade);
  if (!codigo) return null;
  return { codigo, descricao, tipo };
}

export function extractCnaesFromEstabelecimento(
  estabelecimento: CnpjWsResponse["estabelecimento"]
): CnaeItem[] {
  if (!estabelecimento) return [];

  const items: CnaeItem[] = [];
  const principal = estabelecimento.atividade_principal;
  if (principal) {
    const mapped = mapAtividade(principal, "principal");
    if (mapped) items.push(mapped);
  }

  for (const secundaria of estabelecimento.atividades_secundarias ?? []) {
    const mapped = mapAtividade(secundaria, "secundario");
    if (mapped) items.push(mapped);
  }

  return dedupeCnaes(items);
}

const CACHE_TTL_MS = 10 * 60 * 1000;
/** CNPJ.ws costuma levar 12–20s; timeout curto abortava CNPJs válidos. */
const FETCH_TIMEOUT_MS = 28_000;

export type CnpjProviderErrorCode =
  | "not_found"
  | "unauthorized"
  | "rate_limit"
  | "timeout"
  | "provider_error"
  | "not_configured";

export type CnpjProviderResult =
  | { ok: true; data: CnpjLookupResult }
  | { ok: false; code: CnpjProviderErrorCode; message: string };

function isFetchTimeout(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return err.name === "TimeoutError" || err.name === "AbortError";
}

type CacheEntry = { expiresAt: number; data: CnpjLookupResult };

const globalCnpjCache = globalThis as unknown as {
  cnpjLookupCache?: Map<string, CacheEntry>;
};

function getCnpjCache(): Map<string, CacheEntry> {
  if (!globalCnpjCache.cnpjLookupCache) {
    globalCnpjCache.cnpjLookupCache = new Map();
  }
  return globalCnpjCache.cnpjLookupCache;
}

function readCachedCnpj(digits: string): CnpjLookupResult | null {
  const entry = getCnpjCache().get(digits);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    getCnpjCache().delete(digits);
    return null;
  }
  return entry.data;
}

function writeCachedCnpj(digits: string, data: CnpjLookupResult): void {
  getCnpjCache().set(digits, { expiresAt: Date.now() + CACHE_TTL_MS, data });
}

function mapCnpjWsResponse(data: CnpjWsResponse): CnpjLookupResult {
  const estabelecimento = data.estabelecimento;
  const dddTelefone = [estabelecimento?.ddd1, estabelecimento?.telefone1].filter(Boolean).join("");
  const cnaes = extractCnaesFromEstabelecimento(estabelecimento);
  const principalCodigo = principalCnaeCodigo(cnaes) || "";
  const principalDescricao =
    cnaes.find((c) => c.tipo === "principal")?.descricao ||
    estabelecimento?.atividade_principal?.descricao?.trim() ||
    "";

  return {
    razao_social: data.razao_social || "",
    nome_fantasia: estabelecimento?.nome_fantasia || "",
    inscricao_estadual: pickInscricaoEstadual(data),
    porte: normalizePorte(data.porte?.descricao),
    cnae_principal_codigo: principalCodigo,
    cnae_fiscal_descricao: principalDescricao,
    cnaes,
    cep: estabelecimento?.cep || "",
    logradouro: buildLogradouro(estabelecimento?.tipo_logradouro, estabelecimento?.logradouro),
    numero: estabelecimento?.numero || "",
    complemento: estabelecimento?.complemento || "",
    bairro: estabelecimento?.bairro || "",
    municipio: estabelecimento?.cidade?.nome || "",
    uf: estabelecimento?.estado?.sigla || "",
    ddd_telefone_1: dddTelefone,
    email: estabelecimento?.email || "",
  };
}

export async function fetchCnpjFromProvider(cnpj: string): Promise<CnpjProviderResult> {
  const digits = onlyDigitsCnpj(cnpj);
  if (digits.length !== 14) {
    return { ok: false, code: "not_found", message: "CNPJ inválido." };
  }

  const cached = readCachedCnpj(digits);
  if (cached) return { ok: true, data: cached };

  const token = process.env.CNPJ_WS_API_TOKEN;
  if (!token) {
    return {
      ok: false,
      code: "not_configured",
      message: "Serviço de consulta CNPJ não configurado no servidor.",
    };
  }

  try {
    const response = await fetch(`https://comercial.cnpj.ws/cnpj/${digits}`, {
      headers: {
        x_api_token: token,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (response.status === 404) {
      return {
        ok: false,
        code: "not_found",
        message: "CNPJ não localizado na Receita Federal.",
      };
    }
    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        code: "unauthorized",
        message: "Consulta CNPJ indisponível (credencial inválida).",
      };
    }
    if (response.status === 429) {
      return {
        ok: false,
        code: "rate_limit",
        message: "Limite de consultas CNPJ atingido. Aguarde e tente novamente.",
      };
    }
    if (!response.ok) {
      console.error("[cnpj-lookup] provider HTTP", response.status, digits);
      return {
        ok: false,
        code: "provider_error",
        message: "Consulta CNPJ indisponível no momento. Tente novamente.",
      };
    }

    const data = (await response.json()) as CnpjWsResponse;
    const mapped = mapCnpjWsResponse(data);
    writeCachedCnpj(digits, mapped);
    return { ok: true, data: mapped };
  } catch (err) {
    if (isFetchTimeout(err)) {
      return {
        ok: false,
        code: "timeout",
        message: "Consulta CNPJ demorou demais. Tente novamente.",
      };
    }
    console.error("[cnpj-lookup] provider error", err);
    return {
      ok: false,
      code: "provider_error",
      message: "Erro ao consultar CNPJ. Tente novamente.",
    };
  }
}
