"use client";

import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  KeyRound,
  RefreshCcw,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "1. Novo Cadastro",
    points: [
      "Acesse a plataforma CADBRASIL e clique em cadastro.",
      "Preencha os dados solicitados corretamente (CPF/CNPJ, e-mail e telefone).",
      "Conclua o cadastro para liberar o acesso inicial.",
    ],
    ctaLabel: "Abrir pagina de cadastro",
    ctaHref: "https://cadastro.cadbrasil.com.br",
  },
  {
    icon: KeyRound,
    title: "2. Recuperando senha",
    points: [
      "Na tela de login, clique em recuperar senha.",
      "Informe o e-mail cadastrado para receber o link de redefinicao.",
      "Acesse o e-mail e siga as instrucoes para criar uma nova senha.",
    ],
    ctaLabel: "Recuperar senha",
    ctaHref: "https://fornecedor.cadbrasil.com.br/forgot-password",
  },
  {
    icon: RefreshCcw,
    title: "3. Senha com erros: criar nova senha",
    points: [
      "Se a senha falhar varias vezes, use novamente a opcao de recuperar senha.",
      "Defina uma senha forte, com combinacao de letras, numeros e caractere especial.",
      "Salve a nova senha e tente o login novamente.",
    ],
    ctaLabel: "Recuperar senha novamente",
    ctaHref: "https://fornecedor.cadbrasil.com.br/forgot-password",
  },
];

const quickFlow = ["Novo Cadastro", "Recuperar Senha", "Nova Senha", "Acesso"];

export default function LoginSenhaContent() {
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
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">SICAF · Licitacoes</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-success" />
            Procedimento de login e senha
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
              Procedimento CADBRASIL
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl leading-[1.05]">
                Guia rapido para login e senha na plataforma CADBRASIL
              </h1>
              <p className="text-lg text-muted-foreground text-balance max-w-3xl leading-relaxed">
                Siga este passo a passo para criar cadastro, recuperar acesso e redefinir senha quando necessario.
              </p>
            </div>
          </div>
        </section>

        <section className="container max-w-7xl pb-12 md:pb-16">
          <div className="grid gap-4">
            {steps.map((step) => (
              <article
                key={step.title}
                className="p-6 md:p-7 rounded-2xl bg-card border border-border/70 shadow-soft hover:shadow-card transition-smooth"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="font-display font-bold text-xl text-foreground">{step.title}</h2>
                    <ul className="space-y-2.5">
                      {step.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-primary-glow shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {"ctaHref" in step && step.ctaHref ? (
                      <a
                        href={step.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-card transition-smooth"
                      >
                        {step.ctaLabel}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="container max-w-7xl py-14 md:py-16 relative">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Resumo visual</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-foreground leading-tight">
                Fluxo rapido de acesso
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
            <Link href="/" className="hover:text-foreground transition-smooth">
              Voltar para pagina inicial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
