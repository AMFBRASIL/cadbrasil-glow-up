export type DiagnosisIndicator = {
  label: string;
  status: "ok" | "warn";
};

export type SicafDiagnosis = {
  score: number;
  statusLabel: "ATENÇÃO" | "REGULAR";
  statusTone: "amber" | "emerald";
  indicators: DiagnosisIndicator[];
  message: string;
  licitacoesEstimadas: number;
};

const SCAN_STEPS = [
  { id: "receita", label: "Consultando Receita Federal", durationMs: 1400 },
  { id: "cadastro", label: "Validando dados cadastrais", durationMs: 1300 },
  { id: "sicaf", label: "Consultando situação no SICAF", durationMs: 1600 },
  { id: "certidoes", label: "Verificando certidões", durationMs: 1500 },
  { id: "diagnostico", label: "Gerando diagnóstico", durationMs: 1400 },
] as const;

export const SICAF_SCAN_STEPS = SCAN_STEPS;

export function getTotalScanDurationMs(): number {
  return SCAN_STEPS.reduce((sum, step) => sum + step.durationMs, 0);
}

function hashDigits(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function buildSicafDiagnosis(opts: {
  cnpj: string;
  cnpjFetched: boolean;
  segmento: string;
}): SicafDiagnosis {
  const digits = opts.cnpj.replace(/\D/g, "");
  const hash = hashDigits(`${digits}|${opts.segmento.trim().toLowerCase()}`);
  const score = 58 + (hash % 12);
  const licitacoesEstimadas = 180 + (hash % 520);

  if (opts.cnpjFetched) {
    return {
      score,
      statusLabel: "ATENÇÃO",
      statusTone: "amber",
      licitacoesEstimadas,
      indicators: [
        { label: "Receita Federal OK", status: "ok" },
        { label: "Empresa Ativa", status: "ok" },
        { label: "SICAF não localizado", status: "warn" },
        { label: "Certidões pendentes", status: "warn" },
        { label: "Documentação incompleta", status: "warn" },
      ],
      message:
        "Identificamos possíveis pontos que podem impedir sua empresa de participar de licitações. Um credenciamento assistido reduz riscos e acelera a habilitação.",
    };
  }

  return {
    score: Math.min(score, 54),
    statusLabel: "ATENÇÃO",
    statusTone: "amber",
    licitacoesEstimadas,
    indicators: [
      { label: "Dados cadastrais a confirmar", status: "warn" },
      { label: "Situação SICAF não verificada", status: "warn" },
      { label: "Certidões pendentes", status: "warn" },
      { label: "Documentação incompleta", status: "warn" },
    ],
    message:
      "Com base no CNPJ informado, há indícios de pendências que podem limitar sua participação em licitações. Recomendamos uma análise completa com especialistas.",
  };
}

export function formatPlanPrice(): string {
  const raw = process.env.NEXT_PUBLIC_COBRANCA_VALOR_CENTS?.trim();
  const cents = raw ? Number(raw) : 98500;
  const value = Number.isFinite(cents) && cents > 0 ? cents : 98500;
  return (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const CADBRASIL_SOLUTION_ITEMS = [
  "Plataforma CADBRASIL",
  "Assessoria especializada",
  "Atualização documental",
  "Monitoramento contínuo",
  "Alertas automáticos",
  "Suporte especializado",
  "Acompanhamento SICAF",
  "Gestão de vencimentos",
] as const;

export const PLAN_HIGHLIGHTS = [
  "Plataforma completa",
  "Credenciamento SICAF",
  "Monitoramento",
  "Gestão documental",
  "Alertas automáticos",
  "Equipe especializada",
] as const;
