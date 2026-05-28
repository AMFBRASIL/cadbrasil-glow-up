export type CnpjLookupResult = {
  razao_social: string;
  nome_fantasia: string;
  inscricao_estadual: string;
  porte: string;
  cnae_fiscal_descricao: string;
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
    atividade_principal?: {
      descricao?: string | null;
    } | null;
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
  return "";
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

export async function fetchCnpjFromProvider(cnpj: string): Promise<CnpjLookupResult | null> {
  const digits = onlyDigitsCnpj(cnpj);
  if (digits.length !== 14) return null;

  const token = process.env.CNPJ_WS_API_TOKEN;
  if (!token) {
    throw new Error("CNPJ_WS_API_TOKEN não configurado");
  }

  const response = await fetch(`https://comercial.cnpj.ws/cnpj/${digits}`, {
    headers: {
      x_api_token: token,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as CnpjWsResponse;
  const estabelecimento = data.estabelecimento;
  const dddTelefone = [estabelecimento?.ddd1, estabelecimento?.telefone1].filter(Boolean).join("");

  return {
    razao_social: data.razao_social || "",
    nome_fantasia: estabelecimento?.nome_fantasia || "",
    inscricao_estadual: pickInscricaoEstadual(data),
    porte: normalizePorte(data.porte?.descricao),
    cnae_fiscal_descricao: estabelecimento?.atividade_principal?.descricao || "",
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

