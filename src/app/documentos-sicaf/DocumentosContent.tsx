"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileText,
  Landmark,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

type DocSection = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  docs: string[];
};

const docSections: DocSection[] = [
  {
    icon: UserCheck,
    title: "1. Documentos de credenciamento",
    subtitle: "Base inicial para habilitação da empresa no SICAF.",
    docs: [
      "Contrato social ou ato constitutivo (e alterações, se houver).",
      "Documento de identificação do responsável legal.",
      "CPF do responsável legal.",
      "Comprovante de endereço atualizado da empresa.",
    ],
  },
  {
    icon: Landmark,
    title: "2. Habilitação jurídica e fiscal",
    subtitle: "Documentação societária e regularidade perante órgãos públicos.",
    docs: [
      "Certidão simplificada da Junta Comercial (quando aplicável).",
      "Comprovante de inscrição e situação cadastral no CNPJ.",
      "Certidão de regularidade com a Receita Federal e Dívida Ativa (CND/CPEND).",
      "Certidão de regularidade estadual (ICMS/SEFAZ).",
      "Certidão de regularidade municipal (ISS/tributos municipais).",
    ],
  },
  {
    icon: FileCheck2,
    title: "3. Regularidade trabalhista e previdenciária",
    subtitle: "Comprovação de conformidade com obrigações trabalhistas e sociais.",
    docs: [
      "Certificado de Regularidade do FGTS (CRF).",
      "Certidão Negativa de Débitos Trabalhistas (CNDT).",
      "Certidão de regularidade previdenciária (INSS), quando exigida no processo.",
      "Comprovantes complementares conforme o ramo da empresa.",
    ],
  },
  {
    icon: FileText,
    title: "4. Qualificação econômico-financeira",
    subtitle: "Evidências financeiras para participação em licitações.",
    docs: [
      "Balanço patrimonial e demonstrações contábeis (último exercício).",
      "Termo de abertura e encerramento (quando aplicável).",
      "Certidão negativa de falência e recuperação judicial.",
      "Documentos de suporte contábil solicitados no edital/órgão.",
    ],
  },
];

const quickFlow = ["Organizar documentos", "Validar certidões", "Enviar no SICAF", "Acompanhar pendências"];

export default function DocumentosContent() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container max-w-7xl flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-extrabold text-foreground tracking-tight">CADBRASIL</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">SICAF · Licitações</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-success" />
            Documentos SICAF
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <section className="relative container max-w-7xl pt-10 md:pt-16 pb-10 md:pb-14">
          <div className="max-w-4xl space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft border border-primary/10 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary-glow opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-glow" />
              </span>
              Checklist de documentos SICAF
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl leading-[1.05]">
                Documentos necessários para cadastro e atualização no SICAF
              </h1>
              <p className="text-lg text-muted-foreground text-balance max-w-3xl leading-relaxed">
                Organize os documentos por categoria para evitar pendências e acelerar a habilitação da sua empresa
                em licitações públicas.
              </p>
            </div>
          </div>
        </section>

        <section className="container max-w-7xl pb-12 md:pb-16">
          <div className="grid gap-4">
            {docSections.map((section) => (
              <article
                key={section.title}
                className="p-6 md:p-7 rounded-2xl bg-card border border-border/70 shadow-soft hover:shadow-card transition-smooth"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="font-display font-bold text-xl text-foreground">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                    <ul className="space-y-2.5">
                      {section.docs.map((doc) => (
                        <li key={doc} className="flex items-start gap-2.5 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-primary-glow shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="container max-w-7xl pb-14">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-soft/80 to-card p-6 md:p-8 shadow-soft">
            <h3 className="font-display text-2xl font-bold text-foreground">Pronto para começar seu processo?</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Com os documentos organizados, siga para o cadastro da CADBRASIL e inicie seu atendimento com suporte
              especializado no SICAF.
            </p>
            <a
              href="https://cadastro.cadbrasil.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-card transition-smooth"
            >
              Ir para cadastro CADBRASIL
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        <section className="bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="container max-w-7xl py-14 md:py-16 relative">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Fluxo recomendado</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-foreground leading-tight">
                Como manter o SICAF sempre atualizado
              </h2>
              <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
                {quickFlow.map((item, index) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="px-3.5 py-2 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-semibold text-primary-foreground">
                      {item}
                    </span>
                    {index < quickFlow.length - 1 ? <ArrowRight className="w-4 h-4 text-primary-foreground/70" /> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card">
        <div className="container max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CADBRASIL · Todos os direitos reservados</p>
          <div className="flex items-center gap-5">
            <Link href="/beneficios-cadbrasil" className="hover:text-foreground transition-smooth">
              Ver benefícios CADBRASIL
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
