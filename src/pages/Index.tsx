import { CadastroForm } from "@/components/CadastroForm";
import heroBg from "@/assets/hero-bg.jpg";
import {
  ShieldCheck,
  Sparkles,
  Headphones,
  Lock,
  CheckCircle2,
  Building2,
  FileCheck,
  Clock,
  Star,
} from "lucide-react";

const highlights = [
  { icon: Sparkles, title: "Atendimento especializado", desc: "Time dedicado a SICAF e licitações" },
  { icon: Clock, title: "Processo rápido", desc: "Cadastro em poucos minutos" },
  { icon: Headphones, title: "Suporte profissional", desc: "Consultoria humana e ágil" },
  { icon: Lock, title: "Dados seguros", desc: "Conformidade com a LGPD" },
];

const benefits = [
  "Especialistas em SICAF e licitações",
  "Suporte consultivo personalizado",
  "Atendimento ágil e prioritário",
  "Processo simplificado de ponta a ponta",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container max-w-7xl flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-extrabold text-foreground tracking-tight">CADBRASIL</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">SICAF · Licitações</p>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-success" />
            Conexão segura · Dados protegidos pela LGPD
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Decorative grid */}
        <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <section className="relative container max-w-7xl pt-10 md:pt-16 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-start">
            {/* LEFT — Institutional */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft border border-primary/10 text-xs font-semibold text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary-glow opacity-70 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-glow" />
                </span>
                Atendimento ativo agora
              </div>

              <div className="space-y-5">
                <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.05]">
                  Assistente Digital para Cadastramento no{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    SICAF
                  </span>{" "}
                  e{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Comprasnet
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground text-balance max-w-xl leading-relaxed">
                  Cadastre sua empresa com a <strong className="text-foreground font-semibold">CADBRASIL</strong> e venda para o Governo Federal com segurança. Habilitação no <strong className="text-foreground font-semibold">SICAF</strong>, suporte completo no <strong className="text-foreground font-semibold">Comprasnet</strong> e participação em licitações públicas.
                </p>
              </div>

              {/* Highlights */}
              <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
                {highlights.map((h) => (
                  <div
                    key={h.title}
                    className="group flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/70 shadow-soft hover:shadow-card hover:border-primary-glow/40 transition-smooth"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-smooth">
                      <h.icon className="w-4.5 h-4.5" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">{h.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust strip */}
              <div className="hidden lg:flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {[0,1,2,3].map((i) => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                        {["JM","RS","CL","AP"][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_,i)=>(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />))}
                    </div>
                    <p className="text-xs text-muted-foreground">+2.500 empresas atendidas</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <p className="text-2xl font-display font-extrabold text-foreground leading-none">15<span className="text-primary-glow">+</span></p>
                  <p className="text-xs text-muted-foreground mt-1">anos de mercado</p>
                </div>
              </div>
            </div>

            {/* RIGHT — Form card */}
            <div className="relative animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {/* Decorative blurred image accent */}
              <div className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl">
                <img src={heroBg} alt="" aria-hidden className="w-full h-full object-cover rounded-[2rem]" />
              </div>
              <CadastroForm />

              <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Seus dados são enviados com segurança e analisados por nossa equipe.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits band */}
        <section className="bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="container max-w-7xl py-14 md:py-20 relative">
            <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
              <div className="text-primary-foreground space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Por que CADBRASIL</p>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl text-balance leading-tight">
                  Solidez institucional. Agilidade de uma plataforma moderna.
                </h2>
                <p className="text-primary-foreground/80 max-w-md">
                  Há mais de uma década ajudando empresas a vencer licitações com processos claros, suporte humano e tecnologia.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-3 p-4 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary-glow shrink-0" />
                    <p className="text-sm font-medium text-primary-foreground">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust footer */}
        <section className="container max-w-7xl py-12">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, t: "Segurança em primeiro lugar", d: "Criptografia em trânsito e conformidade total com a LGPD." },
              { icon: Headphones, t: "Atendimento humano", d: "Especialistas reais conduzem seu processo do início ao fim." },
              { icon: FileCheck, t: "Autoridade no SICAF", d: "Anos de experiência com cadastros, recursos e atualizações." },
            ].map((c) => (
              <div key={c.t} className="p-6 rounded-2xl bg-card border border-border/70 shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-3">
                  <c.icon className="w-5 h-5" />
                </div>
                <p className="font-display font-bold text-foreground">{c.t}</p>
                <p className="text-sm text-muted-foreground mt-1">{c.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card">
        <div className="container max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CADBRASIL · Todos os direitos reservados</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-smooth">Política de Privacidade</a>
            <a href="#" className="hover:text-foreground transition-smooth">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
