import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

function onlyDigits(value: string): string {
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

export async function GET(_request: Request, { params }: { params: { cnpj: string } }) {
  const cnpj = onlyDigits(params.cnpj || "");

  if (cnpj.length !== 14) {
    return NextResponse.json({ error: "CNPJ inválido" }, { status: 400 });
  }

  const token = process.env.CNPJ_WS_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Token da CNPJ.ws não configurado" }, { status: 500 });
  }

  const response = await fetch(`https://comercial.cnpj.ws/cnpj/${cnpj}`, {
    headers: {
      x_api_token: token,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const status = response.status === 404 ? 404 : 502;
    return NextResponse.json({ error: "CNPJ não localizado" }, { status });
  }

  const data = (await response.json()) as CnpjWsResponse;
  const estabelecimento = data.estabelecimento;
  const dddTelefone = [estabelecimento?.ddd1, estabelecimento?.telefone1].filter(Boolean).join("");

  return NextResponse.json({
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
  });
}
