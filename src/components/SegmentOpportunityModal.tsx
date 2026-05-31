"use client";

import {
  ArrowRight,
  Building2,
  Gavel,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatLicitacoesCount, shortenSegmentLabel } from "@/lib/segment-opportunity";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segmento: string;
  licitacoesCount: number;
  onContinue: () => void;
};

export function SegmentOpportunityModal({
  open,
  onOpenChange,
  segmento,
  licitacoesCount,
  onContinue,
}: Props) {
  const displayCount = formatLicitacoesCount(licitacoesCount);
  const orgaosCount = 12 + (licitacoesCount % 18);
  const demandaLabel = licitacoesCount >= 400 ? "Alta" : licitacoesCount >= 280 ? "Elevada" : "Consistente";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden p-0 gap-0 border-primary/15">
        <div className="relative bg-gradient-to-br from-primary via-primary to-primary-glow px-6 pt-7 pb-8 text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 border border-primary-foreground/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
              </span>
              Oportunidade no seu segmento
            </div>
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-2xl md:text-[1.65rem] font-display font-extrabold text-primary-foreground leading-tight pr-6">
                Licitações qualificadas para a sua empresa
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/85 text-sm leading-relaxed">
                Com base no segmento de atuação informado, há forte demanda de compras públicas compatíveis com o perfil
                da sua empresa.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="rounded-2xl border border-primary/20 bg-primary-soft/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">Segmento de atuação</p>
            <p className="text-sm font-semibold text-foreground leading-snug">{shortenSegmentLabel(segmento)}</p>
          </div>

          <div className="text-center py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Licitações qualificadas identificadas
            </p>
            <p className="font-display text-5xl md:text-6xl font-extrabold text-foreground tracking-tight tabular-nums">
              {displayCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">oportunidades compatíveis com seu CNAE no mercado público</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: Gavel, label: "Licitações", value: displayCount, hint: "qualificadas" },
              { icon: Building2, label: "Órgãos", value: `${orgaosCount}+`, hint: "com demanda" },
              { icon: TrendingUp, label: "Demanda", value: demandaLabel, hint: "no segmento" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/70 bg-card p-3 text-center shadow-soft"
              >
                <stat.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                <p className="text-base font-display font-bold text-foreground leading-tight">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.hint}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3">
            <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Conclua seu cadastro SICAF com a CADBRASIL</span> e habilite
              sua empresa para participar dessas oportunidades com suporte especializado e Assistente SICAF.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <Users className="h-3.5 w-3.5 text-primary" />
            +2.500 empresas já credenciadas com a CADBRASIL
          </div>

          <Button
            type="button"
            className="w-full h-12 rounded-2xl bg-gradient-cta text-base font-bold shadow-glow hover:scale-[1.01] transition-smooth"
            onClick={() => {
              onContinue();
              onOpenChange(false);
            }}
          >
            Continuar meu cadastro SICAF
            <ArrowRight className="h-5 w-5 ml-1" />
          </Button>

          <p className="text-[10px] text-center text-muted-foreground leading-relaxed px-2">
            Estimativa de oportunidades com base no segmento informado. Valores ilustrativos para orientar seu
            credenciamento; consulte editais oficiais no Compras.gov.br.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
