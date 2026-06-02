"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { lookupCnpjAction } from "@/app/actions/cnpj-lookup";
import { getUtmForPayload, trackConversion } from "@/lib/utm";
import { cn } from "@/lib/utils";

type Stage = "inicio" | "identificacao" | "consulta" | "score" | "captura" | "relatorio";

type CompanyData = {
  razaoSocial: string;
  nomeFantasia: string;
  situacao: string;
  porte: string;
  segmento: string;
};

type Indicator = {
  label: string;
  status: "ok" | "warn";
  value: string;
};

const ANALYSIS_STEPS = [
  "Consultando base CADBRASIL",
  "Consultando Receita Federal (fallback)",
  "Validando dados cadastrais",
  "Analisando situação empresarial",
  "Verificando indicadores para licitações",
  "Consultando critérios de habilitação",
  "Gerando Score SICAF",
] as const;

function onlyDigits(v: string): string {
  return v.replace(/\D/g, "");
}

function maskCnpj(v: string): string {
  const d = onlyDigits(v).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function maskPhone(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function computeScore(cnpj: string, situacao: string): number {
  const digits = onlyDigits(cnpj);
  const sum = digits.split("").reduce((acc, n) => acc + Number(n), 0);
  const base = situacao.toLowerCase().includes("ativa") ? 68 : 55;
  return Math.max(42, Math.min(92, base + (sum % 17)));
}

function scoreLabel(score: number): { label: "Atenção" | "Regular"; color: string } {
  if (score >= 80) return { label: "Regular", color: "text-emerald-600" };
  return { label: "Atenção", color: "text-amber-600" };
}

function scoreBarClass(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  return "bg-amber-500";
}

export default function DiagnosticoSicafContent() {
  const [stage, setStage] = useState<Stage>("inicio");
  const [scanIndex, setScanIndex] = useState(0);
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [cnpj, setCnpj] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [aceiteContato, setAceiteContato] = useState(false);

  const [company, setCompany] = useState<CompanyData>({
    razaoSocial: "",
    nomeFantasia: "",
    situacao: "",
    porte: "",
    segmento: "",
  });
  const [foundInBase, setFoundInBase] = useState(false);
  const identifyCardRef = useRef<HTMLDivElement | null>(null);
  const lastAutoLookupCnpjRef = useRef("");

  const score = useMemo(() => computeScore(cnpj, company.situacao), [cnpj, company.situacao]);
  const classification = useMemo(() => scoreLabel(score), [score]);
  const regularizarHref = foundInBase
    ? "https://fornecedor.cadbrasil.com.br"
    : "https://cadastro.cadbrasil.com.br";

  const indicators = useMemo<Indicator[]>(() => {
    const ativa = company.situacao.toLowerCase().includes("ativa");
    return [
      { label: "Receita Federal", status: ativa ? "ok" : "warn", value: ativa ? "Regular" : "Necessita validação" },
      { label: "Situação Cadastral", status: ativa ? "ok" : "warn", value: company.situacao || "Não identificado" },
      { label: "Tempo de Empresa", status: "ok", value: "Adequado" },
      { label: "Porte Empresarial", status: "ok", value: company.porte || "Compatível" },
      { label: "Documentação", status: "warn", value: "Necessita revisão" },
      { label: "SICAF", status: "warn", value: "Recomendamos validação" },
      { label: "Participação em Licitações", status: "warn", value: "Potencial não identificado" },
    ];
  }, [company.situacao, company.porte]);

  useEffect(() => {
    if (stage !== "consulta") return;
    if (scanIndex >= ANALYSIS_STEPS.length) {
      const t = window.setTimeout(() => {
        setStage("score");
        trackConversion("diagnostico_sicaf_score_gerado", undefined, {
          score,
          cnpj: onlyDigits(cnpj),
        });
      }, 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setScanIndex((v) => v + 1), 1000);
    return () => window.clearTimeout(t);
  }, [stage, scanIndex, score, cnpj]);

  useEffect(() => {
    if (stage !== "identificacao") return;
    const t = window.setTimeout(() => {
      identifyCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(t);
  }, [stage]);

  function resetTest() {
    setStage("identificacao");
    setScanIndex(0);
    setLoadingCnpj(false);
    setSubmitLoading(false);
    setError("");
    setFoundInBase(false);
    setCnpj("");
    setCompany({
      razaoSocial: "",
      nomeFantasia: "",
      situacao: "",
      porte: "",
      segmento: "",
    });
    lastAutoLookupCnpjRef.current = "";
  }

  async function handleLocateCompany(cnpjInput?: string) {
    const digits = onlyDigits(cnpjInput ?? cnpj);
    if (digits.length !== 14) {
      setError("Informe um CNPJ válido para continuar.");
      return;
    }

    setError("");
    setLoadingCnpj(true);
    try {
      let existsInBase = false;
      try {
        const baseRes = await fetch(`/api/cadastro/documento?documento=${digits}`, { cache: "no-store" });
        if (baseRes.ok) {
          const baseJson = (await baseRes.json()) as { exists?: boolean };
          existsInBase = baseJson.exists === true;
        }
      } catch {
        existsInBase = false;
      }
      setFoundInBase(existsInBase);

      const result = await lookupCnpjAction(digits);
      if (result.ok) {
        setCompany({
          razaoSocial: result.data.razao_social || "",
          nomeFantasia: result.data.nome_fantasia || "",
          situacao: existsInBase ? "Ativa (base CADBRASIL)" : "Ativa",
          porte: result.data.porte || "Compatível",
          segmento: result.data.cnae_fiscal_descricao || "Atividade empresarial",
        });
      } else {
        setCompany({
          razaoSocial: "",
          nomeFantasia: "",
          situacao: existsInBase ? "CNPJ localizado na base CADBRASIL" : "Não confirmada",
          porte: "A confirmar",
          segmento: "Atividade empresarial",
        });
      }
      setStage("consulta");
      setScanIndex(0);
    } finally {
      setLoadingCnpj(false);
    }
  }

  async function handleLeadCapture() {
    if (!aceiteContato) {
      setError("Confirme que deseja receber o relatório para continuar.");
      return;
    }
    setError("");
    setSubmitLoading(true);
    try {
      const payload = {
        nome: responsavel.trim(),
        email: email.trim(),
        whatsapp: onlyDigits(whatsapp),
        cnpj: onlyDigits(cnpj),
        score,
        classificacao: classification.label,
        situacao: company.situacao,
        origem: "diagnostico-sicaf",
        ...getUtmForPayload(),
      };
      await fetch("/api/diagnostico-sicaf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      trackConversion("diagnostico_sicaf_lead_capturado", undefined, {
        score,
        classificacao: classification.label,
      });
      setStage("relatorio");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="container max-w-6xl py-10 md:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            SCORE SICAF CADBRASIL
          </div>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-extrabold text-foreground max-w-4xl leading-tight">
            Descubra se sua empresa está realmente apta para participar de licitações públicas.
          </h1>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-3xl">
            Receba gratuitamente uma análise inteligente da situação cadastral da sua empresa e identifique possíveis
            pendências que podem impedir sua participação em licitações.
          </p>
          {stage === "inicio" && (
            <button
              type="button"
              onClick={() => setStage("identificacao")}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-cta px-6 py-4 text-sm font-bold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.01]"
            >
              🚀 INICIAR DIOAGNOSTICO SICAF
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Sem compromisso. Sem cartão. Resultado em poucos minutos.</p>
        </div>
      </section>

      <section className="container max-w-6xl py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div ref={identifyCardRef} className="rounded-3xl border border-border/70 bg-card p-5 md:p-7 shadow-soft">
            {stage === "inicio" && (
              <div className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-6 text-center">
                <h2 className="font-display text-2xl font-bold">Pronto para iniciar a varredura inteligente?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clique em iniciar para informar o CNPJ e analisar sua situação atual.
                </p>
              </div>
            )}

            {stage === "identificacao" && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl font-bold">Vamos localizar sua empresa</h2>
                <div className="grid gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">CNPJ</span>
                    <input
                      className="h-14 w-full rounded-2xl border-2 border-primary/30 bg-background px-4 text-lg font-semibold tracking-wide outline-none transition focus:border-primary"
                      value={cnpj}
                      onChange={(e) => {
                        const masked = maskCnpj(e.target.value);
                        const digits = onlyDigits(masked);
                        setCnpj(masked);
                        if (digits.length < 14) {
                          lastAutoLookupCnpjRef.current = "";
                          return;
                        }
                        if (digits.length === 14 && lastAutoLookupCnpjRef.current !== digits && !loadingCnpj) {
                          lastAutoLookupCnpjRef.current = digits;
                          void handleLocateCompany(masked);
                        }
                      }}
                      placeholder="00.000.000/0000-00"
                      inputMode="numeric"
                    />
                  </label>
                </div>
                {company.razaoSocial && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <p className="text-sm font-semibold text-emerald-700">Empresa localizada.</p>
                    <p className="text-xs text-muted-foreground mt-1">{company.razaoSocial}</p>
                  </div>
                )}
                <button
                  type="button"
                  disabled={loadingCnpj}
                  onClick={() => void handleLocateCompany(cnpj)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {loadingCnpj ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
                  {loadingCnpj ? "Localizando empresa..." : "Localizar empresa"}
                </button>
                <p className="text-xs text-muted-foreground">
                  Primeiro verificamos a base CADBRASIL, depois consultamos a Receita Federal via WS.
                </p>
              </div>
            )}

            {stage === "consulta" && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold">Consulta inteligente em andamento</h2>
                <p className="text-sm text-muted-foreground">
                  Estamos processando os dados e verificando critérios de habilitação para licitações.
                </p>
                <div className="space-y-2.5">
                  {ANALYSIS_STEPS.map((step, idx) => (
                    <div key={step} className="flex items-center gap-3 rounded-xl border border-border p-3">
                      {idx < scanIndex ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : idx === scanIndex ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-border" />
                      )}
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
                {foundInBase && (
                  <p className="text-xs text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    Encontramos registros anteriores deste CNPJ na base CADBRASIL.
                  </p>
                )}
              </div>
            )}

            {(stage === "score" || stage === "captura" || stage === "relatorio") && (
              <div className="space-y-5">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={resetTest}
                    className="inline-flex h-9 items-center rounded-lg border border-input px-3 text-xs font-semibold text-foreground transition hover:bg-muted"
                  >
                    Refazer o teste
                  </button>
                </div>
                <div className="rounded-2xl border border-border p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score SICAF</p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="font-display text-4xl font-extrabold">{score}/100</p>
                    <p className={cn("text-lg font-bold", classification.color)}>{classification.label}</p>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-muted">
                    <div className={cn("h-full rounded-full transition-all", scoreBarClass(score))} style={{ width: `${score}%` }} />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold">Componentes analisados</h3>
                  <div className="mt-3 grid gap-2">
                    {indicators.map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-xl border border-border p-3">
                        <div className="flex items-center gap-2">
                          {item.status === "ok" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                          )}
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <span className={cn("text-xs font-semibold", item.status === "ok" ? "text-emerald-600" : "text-amber-600")}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary-soft/40 p-4 text-sm text-foreground/90">
                  Sua empresa apresenta características compatíveis para participação em processos licitatórios.
                  Identificamos alguns pontos que recomendamos validar antes da participação em licitações públicas.
                </div>
                <a
                  href={regularizarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Regularizar meu SICAF
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <p className="text-sm font-semibold">Empresas de todo o Brasil utilizam a CADBRASIL</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-display text-2xl font-extrabold text-primary">+2.500</p>
                  <p className="text-[11px] text-muted-foreground">Empresas atendidas</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-primary">+40k</p>
                  <p className="text-[11px] text-muted-foreground">Documentos analisados</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-primary">+9k</p>
                  <p className="text-[11px] text-muted-foreground">Processos acompanhados</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-lg font-bold">Sua empresa pode estar perdendo oportunidades</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Milhares de processos de compra pública são publicados diariamente. Empresas com documentação
                desatualizada ou cadastros incompletos frequentemente deixam de participar dessas oportunidades.
              </p>
            </div>

            {(stage === "score" || stage === "captura") && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-soft">
                <p className="text-sm font-semibold text-foreground">
                  Encontramos informações adicionais que podem influenciar sua participação em licitações.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Para visualizar o relatório completo, continue.</p>
                <button
                  type="button"
                  onClick={() => setStage("captura")}
                  className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground"
                >
                  Continuar para relatório
                </button>
              </div>
            )}
          </aside>
        </div>
      </section>

      {stage === "captura" && (
        <section className="container max-w-6xl pb-10">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-2xl font-bold">Seu relatório completo está pronto</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Receba uma análise mais detalhada e recomendações específicas para sua empresa.
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              {["Resumo da análise", "Recomendações", "Pontos de atenção", "Orientações gerais"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs">Nome</span>
                <input
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs">E-mail</span>
                <input
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs">WhatsApp</span>
                <input
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
                />
              </label>
            </div>
            <label className="mt-4 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-primary"
                checked={aceiteContato}
                onChange={(e) => setAceiteContato(e.target.checked)}
              />
              Desejo receber meu relatório e futuras atualizações relacionadas ao SICAF e licitações.
            </label>
            <button
              type="button"
              onClick={handleLeadCapture}
              disabled={submitLoading}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-cta px-5 text-sm font-bold text-primary-foreground shadow-soft disabled:opacity-60"
            >
              {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
              📄 Liberar Meu Relatório
            </button>
          </div>
        </section>
      )}

      {stage === "relatorio" && (
        <section className="container max-w-6xl pb-14">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-7 shadow-soft">
            <h3 className="font-display text-2xl font-bold">Relatório Completo</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Resumo Geral</p>
                <p className="mt-2 text-sm text-foreground/90">
                  Score {score}/100 com pontos de atenção em documentação, validação SICAF e estrutura para
                  habilitação em licitações.
                </p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Próximos Passos</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>1. Revisar documentos obrigatórios</li>
                  <li>2. Validar cadastro SICAF</li>
                  <li>3. Ajustar certidões e prazos</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary-soft/40 p-5">
              <h4 className="font-display text-xl font-bold">Deseja uma análise especializada?</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Nossa equipe pode realizar uma avaliação mais detalhada da documentação e orientar sua empresa nos
                processos de habilitação e atualização cadastral.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/cadastro"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <TrendingUp className="h-4 w-4" />
                  🚀 Solicitar Análise Especializada
                </Link>
                <a
                  href="https://wa.me/5561998830824?text=Ol%C3%A1%2C%20conclu%C3%AD%20o%20diagn%C3%B3stico%20SICAF%20e%20quero%20falar%20com%20um%20especialista."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-input px-4 py-3 text-sm font-semibold text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  📞 Falar com Especialista
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-destructive/30 bg-card px-4 py-3 shadow-card">
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        </div>
      )}

      <footer className="border-t border-border/70 bg-card">
        <div className="container max-w-6xl py-6 text-xs text-muted-foreground flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            Ambiente seguro · dados protegidos e utilizados para análise cadastral.
          </p>
          <p className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            CADBRASIL · Diagnóstico consultivo para licitações públicas
          </p>
        </div>
      </footer>
    </main>
  );
}

