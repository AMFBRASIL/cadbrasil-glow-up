"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { montarWhatsAppHref } from "@/lib/cadbrasil-atendimento";
import {
  buildSicafDiagnosis,
  CADBRASIL_SOLUTION_ITEMS,
  formatPlanPrice,
  PLAN_HIGHLIGHTS,
  SICAF_SCAN_STEPS,
  type SicafDiagnosis,
} from "@/lib/sicaf-diagnosis";
import { formatLicitacoesCount } from "@/lib/segment-opportunity";
import { cn } from "@/lib/utils";

export type SicafAnalysisCompany = {
  cnpj: string;
  razaoSocial: string;
  segmento: string;
  cnpjFetched: boolean;
};

type Phase = "scan" | "diagnosis" | "solution" | "offer";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: SicafAnalysisCompany | null;
  onRegularizar: () => void;
};

const PHASES: { id: Phase; label: string }[] = [
  { id: "scan", label: "Análise" },
  { id: "diagnosis", label: "Diagnóstico" },
  { id: "solution", label: "Solução" },
  { id: "offer", label: "Plano" },
];

function phaseIndex(phase: Phase): number {
  return PHASES.findIndex((p) => p.id === phase);
}

export function SicafAnalysisModal({ open, onOpenChange, company, onRegularizar }: Props) {
  const [phase, setPhase] = useState<Phase>("scan");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [diagnosis, setDiagnosis] = useState<SicafDiagnosis | null>(null);

  const resetFlow = useCallback(() => {
    setPhase("scan");
    setActiveStepIndex(0);
    setCompletedSteps([]);
    setScanProgress(0);
    setDiagnosis(null);
  }, []);

  useEffect(() => {
    if (!open) resetFlow();
  }, [open, resetFlow]);

  useEffect(() => {
    if (!open || !company) return;

    setDiagnosis(buildSicafDiagnosis(company));
    setPhase("scan");
    setActiveStepIndex(0);
    setCompletedSteps([]);
    setScanProgress(0);

    let elapsed = 0;
    const totalMs = SICAF_SCAN_STEPS.reduce((s, step) => s + step.durationMs, 0);
    const timers: ReturnType<typeof setTimeout>[] = [];

    SICAF_SCAN_STEPS.forEach((step, index) => {
      timers.push(setTimeout(() => setActiveStepIndex(index), elapsed));
      elapsed += step.durationMs;
      timers.push(
        setTimeout(() => {
          setCompletedSteps((prev) => (prev.includes(index) ? prev : [...prev, index]));
          setScanProgress(Math.round(((index + 1) / SICAF_SCAN_STEPS.length) * 100));
        }, elapsed)
      );
    });

    timers.push(
      setTimeout(() => {
        setScanProgress(100);
        setPhase("diagnosis");
      }, totalMs + 400)
    );

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => (prev >= 95 ? prev : prev + 2));
    }, totalMs / 45);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [open, company?.cnpj, company]);

  const planPrice = useMemo(() => formatPlanPrice(), []);
  const displayName = company?.razaoSocial?.trim() || "Empresa identificada";
  const displayCnpj = company?.cnpj || "—";

  const whatsappHref = useMemo(() => {
    const msg = `Olá! Realizei a análise preliminar SICAF na CADBRASIL e gostaria de falar com um especialista.\n\nCNPJ: ${displayCnpj}\nEmpresa: ${displayName}`;
    return montarWhatsAppHref(msg);
  }, [displayCnpj, displayName]);

  const currentPhaseIndex = phaseIndex(phase);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-hidden p-0 gap-0 border-primary/15">
        <DialogTitle className="sr-only">Análise SICAF CADBRASIL</DialogTitle>
        <DialogDescription className="sr-only">
          Diagnóstico preliminar da situação cadastral da empresa no SICAF
        </DialogDescription>

        {/* Progress bar + steps */}
        <div className="border-b border-border/60 bg-muted/30 px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            {PHASES.map((p, i) => (
              <div key={p.id} className="flex flex-1 flex-col items-center gap-1 min-w-0">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-smooth",
                    i < currentPhaseIndex && "bg-primary text-primary-foreground",
                    i === currentPhaseIndex && "bg-gradient-cta text-primary-foreground ring-4 ring-primary/20",
                    i > currentPhaseIndex && "bg-border text-muted-foreground"
                  )}
                >
                  {i < currentPhaseIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wide truncate w-full text-center",
                    i <= currentPhaseIndex ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-gradient-cta transition-all duration-500 ease-out"
              style={{
                width: `${((currentPhaseIndex + (phase === "scan" ? scanProgress / 100 : 1)) / PHASES.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-88px)]">
          {/* SCAN */}
          {phase === "scan" && (
            <div className="px-6 py-8 md:py-10 animate-fade-up">
              <div className="text-center mb-8">
                <div className="mx-auto mb-5 relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary shadow-soft">
                    <Loader2 className="h-9 w-9 text-primary-foreground animate-spin" />
                  </div>
                </div>
                <h2 className="font-display text-2xl font-extrabold text-foreground">Analisando sua empresa</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Estamos cruzando dados públicos e parâmetros de habilitação para montar seu diagnóstico preliminar
                  SICAF.
                </p>
              </div>

              <ul className="space-y-3 max-w-md mx-auto">
                {SICAF_SCAN_STEPS.map((step, index) => {
                  const done = completedSteps.includes(index);
                  const active = activeStepIndex === index && !done;
                  return (
                    <li
                      key={step.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300",
                        done && "border-emerald-500/30 bg-emerald-500/5",
                        active && "border-primary/40 bg-primary-soft/60 shadow-soft scale-[1.02]",
                        !done && !active && "border-border/60 bg-card/50 opacity-60"
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      ) : active ? (
                        <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-border shrink-0" />
                      )}
                      <span className={cn("text-sm font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                {scanProgress}% concluído · análise em andamento
              </p>
            </div>
          )}

          {/* DIAGNOSIS */}
          {phase === "diagnosis" && diagnosis && (
            <div className="animate-fade-up">
              <div className="bg-gradient-to-br from-amber-500/10 via-card to-card px-6 py-6 border-b border-amber-500/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">
                  Diagnóstico preliminar
                </p>
                <h2 className="font-display text-xl md:text-2xl font-extrabold text-foreground">Empresa identificada</h2>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-card p-4">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Razão social</p>
                    <p className="mt-1 text-sm font-semibold text-foreground leading-snug">{displayName}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-card p-4">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">CNPJ</p>
                    <p className="mt-1 text-sm font-mono font-semibold text-foreground">{displayCnpj}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
                  <div className="flex-1 min-w-[140px]">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Status geral</p>
                    <p className="mt-1 text-2xl font-display font-extrabold text-amber-700 dark:text-amber-400">
                      {diagnosis.statusLabel}
                    </p>
                  </div>
                  <div className="flex-1 min-w-[140px] text-center sm:text-right">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Pontuação preliminar</p>
                    <p className="mt-1 text-4xl font-display font-extrabold text-foreground tabular-nums">
                      {diagnosis.score}
                      <span className="text-lg text-muted-foreground">%</span>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Indicadores</p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {diagnosis.indicators.map((item) => (
                      <li
                        key={item.label}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm",
                          item.status === "ok"
                            ? "bg-emerald-500/8 border border-emerald-500/20 text-foreground"
                            : "bg-amber-500/8 border border-amber-500/20 text-foreground"
                        )}
                      >
                        {item.status === "ok" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        )}
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/25 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                  {diagnosis.message}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-1">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  +2.500 empresas assessoradas pela CADBRASIL
                </div>

                <Button
                  type="button"
                  className="w-full h-12 rounded-2xl bg-gradient-cta text-base font-bold shadow-glow"
                  onClick={() => setPhase("solution")}
                >
                  Continuar análise completa
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* SOLUTION */}
          {phase === "solution" && diagnosis && (
            <div className="animate-fade-up px-6 py-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Apresentação da solução</p>
                <h2 className="font-display text-2xl font-extrabold text-foreground leading-tight">
                  Podemos resolver tudo isso para você
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  A CADBRASIL conduz credenciamento, documentação e monitoramento SICAF com linguagem consultiva e equipe
                  especializada — ideal para quem busca segurança ao licitar.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                {CADBRASIL_SOLUTION_ITEMS.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2.5 text-sm"
                  >
                    <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-5">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> Fazer sozinho
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Alto risco de erros no credenciamento</li>
                    <li>• Processo demorado e burocrático</li>
                    <li>• Falta de acompanhamento contínuo</li>
                  </ul>
                </div>
                <div className="rounded-2xl border-2 border-primary/30 bg-primary-soft/40 p-5 shadow-soft">
                  <p className="text-xs font-bold uppercase text-primary mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Com CADBRASIL
                  </p>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li>• Processo assistido passo a passo</li>
                    <li>• Monitoramento e alertas de vencimento</li>
                    <li>• Equipe especializada em SICAF</li>
                  </ul>
                </div>
              </div>

              {company?.segmento ? (
                <div className="rounded-xl border border-primary/20 bg-primary-soft/30 px-4 py-3 flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{formatLicitacoesCount(diagnosis.licitacoesEstimadas)}</span>{" "}
                    oportunidades estimadas compatíveis com seu segmento de atuação.
                  </p>
                </div>
              ) : null}

              <Button
                type="button"
                className="w-full h-12 rounded-2xl bg-gradient-cta text-base font-bold"
                onClick={() => setPhase("offer")}
              >
                Ver plano recomendado
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          )}

          {/* OFFER */}
          {phase === "offer" && (
            <div className="animate-fade-up px-6 py-6 space-y-5">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Oferta</p>
                <h2 className="font-display text-2xl font-extrabold text-foreground">Plano CADBRASIL</h2>
                <p className="text-sm text-muted-foreground mt-1">Licença anual · assessoria completa SICAF</p>
              </div>

              <div className="relative rounded-3xl border-2 border-primary/35 bg-gradient-to-br from-primary-soft/60 to-card p-6 shadow-elevated overflow-hidden">
                <div className="absolute top-3 right-3 rounded-full bg-gradient-cta px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground">
                  Recomendado
                </div>
                <Sparkles className="absolute -left-4 -bottom-4 h-24 w-24 text-primary/10" />
                <p className="text-sm font-semibold text-muted-foreground">Investimento anual</p>
                <p className="font-display text-4xl md:text-5xl font-extrabold text-foreground mt-1 tabular-nums">
                  {planPrice}
                </p>
                <ul className="mt-5 grid sm:grid-cols-2 gap-2">
                  {PLAN_HIGHLIGHTS.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-center text-muted-foreground leading-relaxed px-2">
                Milhares de empresas confiam na CADBRASIL para manter o SICAF regular e participar de licitações com
                mais segurança. Vagas de onboarding limitadas por consultor esta semana.
              </p>

              <Button
                type="button"
                className="w-full h-12 rounded-2xl bg-gradient-cta text-base font-bold shadow-glow hover:scale-[1.01] transition-smooth"
                onClick={() => {
                  onRegularizar();
                  onOpenChange(false);
                }}
              >
                Regularizar minha empresa agora
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>

              <Button type="button" variant="outline" className="w-full h-11 rounded-2xl" asChild>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Falar com especialista
                </a>
              </Button>

              <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                Diagnóstico preliminar com base em dados informados e parâmetros de habilitação. Não substitui consulta
                oficial ao Compras.gov.br.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
