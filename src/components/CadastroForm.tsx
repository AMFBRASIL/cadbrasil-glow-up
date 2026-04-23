import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ---------- Masks ---------- */
const maskCNPJ = (v: string) =>
  v.replace(/\D/g, "").slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");

const maskCPF = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim().replace(/-$/, "");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim().replace(/-$/, "");
};

const maskCEP = (v: string) =>
  v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

/* ---------- Schema ---------- */
const schema = z.object({
  // Empresa
  razaoSocial: z.string().trim().min(2, "Informe a razão social").max(120),
  nomeFantasia: z.string().trim().max(120).optional().or(z.literal("")),
  cnpj: z.string().refine((v) => v.replace(/\D/g, "").length === 14, "CNPJ inválido"),
  inscricaoEstadual: z.string().trim().max(30).optional().or(z.literal("")),
  porte: z.string().min(1, "Selecione o porte"),
  segmento: z.string().trim().min(2, "Informe o segmento").max(80),
  // Responsável
  nomeResponsavel: z.string().trim().min(2, "Informe o nome").max(120),
  cpf: z.string().refine((v) => v.replace(/\D/g, "").length === 11, "CPF inválido"),
  cargo: z.string().trim().min(2, "Informe o cargo").max(60),
  telefone: z.string().refine((v) => v.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  email: z.string().trim().email("E-mail inválido").max(160),
  // Endereço
  cep: z.string().refine((v) => v.replace(/\D/g, "").length === 8, "CEP inválido"),
  rua: z.string().trim().min(2, "Informe a rua").max(120),
  numero: z.string().trim().min(1, "Nº").max(10),
  complemento: z.string().trim().max(60).optional().or(z.literal("")),
  bairro: z.string().trim().min(2, "Informe o bairro").max(80),
  cidade: z.string().trim().min(2, "Informe a cidade").max(80),
  estado: z.string().length(2, "UF"),
  // Interesse
  servico: z.string().min(1, "Selecione um serviço"),
  possuiSicaf: z.string().min(1, "Selecione"),
  prioritario: z.string().min(1, "Selecione"),
  observacoes: z.string().trim().max(500).optional().or(z.literal("")),
  // Aceite
  aceiteTermos: z.literal(true, { message: "Você precisa aceitar os termos" }),
  aceiteContato: z.literal(true, { message: "Autorize o contato para prosseguir" }),
});

export type CadastroData = z.infer<typeof schema>;

const STEPS = [
  { id: 0, label: "Empresa", icon: Building2 },
  { id: 1, label: "Responsável", icon: User },
  { id: 2, label: "Endereço", icon: MapPin },
  { id: 3, label: "Atendimento", icon: Briefcase },
  { id: 4, label: "Confirmação", icon: ShieldCheck },
] as const;

const STEP_FIELDS: Record<number, (keyof CadastroData)[]> = {
  0: ["razaoSocial", "nomeFantasia", "cnpj", "inscricaoEstadual", "porte", "segmento"],
  1: ["nomeResponsavel", "cpf", "cargo", "telefone", "email"],
  2: ["cep", "rua", "numero", "complemento", "bairro", "cidade", "estado"],
  3: ["servico", "possuiSicaf", "prioritario", "observacoes"],
  4: ["aceiteTermos", "aceiteContato"],
};

/* ---------- Field primitives ---------- */
function Field({
  label, error, children, hint, required,
}: { label: string; error?: string; children: React.ReactNode; hint?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-foreground/80 flex items-center gap-1">
        {label}
        {required && <span className="text-primary-glow">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full h-11 px-4 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-smooth focus:border-primary-glow focus:ring-4 focus:ring-primary-glow/15 hover:border-primary-glow/50";

/* ---------- Main component ---------- */
export function CadastroForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const form = useForm<CadastroData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      razaoSocial: "", nomeFantasia: "", cnpj: "", inscricaoEstadual: "",
      porte: "", segmento: "",
      nomeResponsavel: "", cpf: "", cargo: "", telefone: "", email: "",
      cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
      servico: "", possuiSicaf: "", prioritario: "", observacoes: "",
      aceiteTermos: undefined as unknown as true,
      aceiteContato: undefined as unknown as true,
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = form;
  const values = watch();

  const lookupCEP = async (raw: string) => {
    const cep = raw.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      setValue("rua", data.logradouro || "", { shouldValidate: true });
      setValue("bairro", data.bairro || "", { shouldValidate: true });
      setValue("cidade", data.localidade || "", { shouldValidate: true });
      setValue("estado", (data.uf || "").toUpperCase(), { shouldValidate: true });
    } catch {
      toast.error("Não foi possível buscar o CEP");
    } finally {
      setCepLoading(false);
    }
  };

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (!ok) {
      toast.error("Verifique os campos destacados");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (_data: CadastroData) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSuccess(true);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  if (success) {
    return (
      <div className="bg-card rounded-3xl shadow-elevated p-10 text-center animate-fade-up">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-9 h-9 text-success" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
          Cadastro enviado com sucesso!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 text-balance">
          Recebemos suas informações. Nossa equipe especializada em SICAF e licitações entrará em contato em até <strong className="text-foreground">1 dia útil</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
          <div className="p-4 rounded-xl bg-primary-soft border border-primary/10">
            <Mail className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Confirmação enviada para</p>
            <p className="text-sm font-medium text-foreground truncate">{values.email}</p>
          </div>
          <div className="p-4 rounded-xl bg-primary-soft border border-primary/10">
            <Phone className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Contato</p>
            <p className="text-sm font-medium text-foreground">{values.telefone}</p>
          </div>
        </div>
        <Button
          onClick={() => { setSuccess(false); setStep(0); form.reset(); }}
          variant="ghost"
          className="mt-8 text-primary hover:text-primary hover:bg-primary-soft"
        >
          Fazer novo cadastro
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card rounded-3xl shadow-elevated overflow-hidden border border-border/60"
    >
      {/* Header + progress */}
      <div className="px-6 md:px-8 pt-7 pb-5 border-b border-border/60 bg-gradient-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              Etapa {step + 1} de {STEPS.length}
            </p>
            <h3 className="text-lg md:text-xl font-display font-bold text-foreground mt-0.5">
              {STEPS[step].label === "Empresa" && "Dados da empresa"}
              {STEPS[step].label === "Responsável" && "Dados do responsável"}
              {STEPS[step].label === "Endereço" && "Endereço da empresa"}
              {STEPS[step].label === "Atendimento" && "Interesse e atendimento"}
              {STEPS[step].label === "Confirmação" && "Revisão e envio"}
            </h3>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 rounded-full transition-smooth",
                  i < step && "w-6 bg-primary",
                  i === step && "w-10 bg-gradient-cta",
                  i > step && "w-6 bg-border"
                )}
              />
            ))}
          </div>
        </div>
        <div className="h-1 w-full rounded-full bg-border/60 overflow-hidden md:hidden">
          <div
            className="h-full bg-gradient-cta transition-smooth"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-6 md:px-8 py-7 min-h-[420px]">
        {step === 0 && (
          <div key="s0" className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-in">
            <div className="md:col-span-2">
              <Field label="Razão social" required error={errors.razaoSocial?.message}>
                <input className={inputClass} placeholder="Empresa LTDA" {...register("razaoSocial")} />
              </Field>
            </div>
            <Field label="Nome fantasia" error={errors.nomeFantasia?.message}>
              <input className={inputClass} placeholder="Como é conhecida" {...register("nomeFantasia")} />
            </Field>
            <Field label="CNPJ" required error={errors.cnpj?.message}>
              <input
                className={inputClass}
                placeholder="00.000.000/0000-00"
                inputMode="numeric"
                value={values.cnpj}
                onChange={(e) => setValue("cnpj", maskCNPJ(e.target.value), { shouldValidate: true })}
              />
            </Field>
            <Field label="Inscrição estadual" error={errors.inscricaoEstadual?.message}>
              <input className={inputClass} placeholder="Opcional / isento" {...register("inscricaoEstadual")} />
            </Field>
            <Field label="Porte da empresa" required error={errors.porte?.message}>
              <select className={inputClass} {...register("porte")}>
                <option value="">Selecione...</option>
                <option value="MEI">MEI</option>
                <option value="ME">Microempresa (ME)</option>
                <option value="EPP">Pequeno porte (EPP)</option>
                <option value="MEDIA">Médio porte</option>
                <option value="GRANDE">Grande porte</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Segmento de atuação" required error={errors.segmento?.message}>
                <input className={inputClass} placeholder="Ex.: Construção civil, TI, serviços..." {...register("segmento")} />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div key="s1" className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-in">
            <div className="md:col-span-2">
              <Field label="Nome completo" required error={errors.nomeResponsavel?.message}>
                <input className={inputClass} placeholder="Nome do responsável" {...register("nomeResponsavel")} />
              </Field>
            </div>
            <Field label="CPF" required error={errors.cpf?.message}>
              <input
                className={inputClass}
                placeholder="000.000.000-00"
                inputMode="numeric"
                value={values.cpf}
                onChange={(e) => setValue("cpf", maskCPF(e.target.value), { shouldValidate: true })}
              />
            </Field>
            <Field label="Cargo" required error={errors.cargo?.message}>
              <input className={inputClass} placeholder="Ex.: Diretor, sócio, gerente" {...register("cargo")} />
            </Field>
            <Field label="Telefone / WhatsApp" required error={errors.telefone?.message}>
              <input
                className={inputClass}
                placeholder="(00) 00000-0000"
                inputMode="tel"
                value={values.telefone}
                onChange={(e) => setValue("telefone", maskPhone(e.target.value), { shouldValidate: true })}
              />
            </Field>
            <Field label="E-mail principal" required error={errors.email?.message}>
              <input type="email" className={inputClass} placeholder="contato@empresa.com.br" {...register("email")} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div key="s2" className="grid grid-cols-1 md:grid-cols-6 gap-5 animate-slide-in">
            <div className="md:col-span-2">
              <Field label="CEP" required error={errors.cep?.message} hint={cepLoading ? "Buscando endereço..." : "Preenchimento automático"}>
                <div className="relative">
                  <input
                    className={inputClass}
                    placeholder="00000-000"
                    inputMode="numeric"
                    value={values.cep}
                    onChange={(e) => {
                      const v = maskCEP(e.target.value);
                      setValue("cep", v, { shouldValidate: true });
                      if (v.replace(/\D/g, "").length === 8) lookupCEP(v);
                    }}
                  />
                  {cepLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
                  )}
                </div>
              </Field>
            </div>
            <div className="md:col-span-4 md:col-start-1">
              <Field label="Rua / Logradouro" required error={errors.rua?.message}>
                <input className={inputClass} placeholder="Av. Paulista" {...register("rua")} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Número" required error={errors.numero?.message}>
                <input className={inputClass} placeholder="123" {...register("numero")} />
              </Field>
            </div>
            <div className="md:col-span-3">
              <Field label="Complemento" error={errors.complemento?.message}>
                <input className={inputClass} placeholder="Sala, andar..." {...register("complemento")} />
              </Field>
            </div>
            <div className="md:col-span-3">
              <Field label="Bairro" required error={errors.bairro?.message}>
                <input className={inputClass} placeholder="Centro" {...register("bairro")} />
              </Field>
            </div>
            <div className="md:col-span-4">
              <Field label="Cidade" required error={errors.cidade?.message}>
                <input className={inputClass} placeholder="São Paulo" {...register("cidade")} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="UF" required error={errors.estado?.message}>
                <input
                  className={cn(inputClass, "uppercase")}
                  placeholder="SP"
                  maxLength={2}
                  value={values.estado}
                  onChange={(e) => setValue("estado", e.target.value.toUpperCase(), { shouldValidate: true })}
                />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div key="s3" className="grid grid-cols-1 gap-5 animate-slide-in">
            <Field label="Serviço de interesse" required error={errors.servico?.message}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Cadastro no SICAF",
                  "Atualização cadastral",
                  "Consultoria em licitações",
                  "Suporte documental",
                  "Outro",
                ].map((s) => {
                  const active = values.servico === s;
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setValue("servico", s, { shouldValidate: true })}
                      className={cn(
                        "text-left px-4 py-3 rounded-xl border text-sm font-medium transition-smooth",
                        active
                          ? "border-primary bg-primary-soft text-primary shadow-soft"
                          : "border-input bg-card text-foreground/80 hover:border-primary-glow/60 hover:bg-primary-soft/40"
                      )}
                    >
                      <span className="flex items-center justify-between">
                        {s}
                        {active && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Possui cadastro no SICAF atualmente?" required error={errors.possuiSicaf?.message}>
                <select className={inputClass} {...register("possuiSicaf")}>
                  <option value="">Selecione...</option>
                  <option value="sim">Sim, está ativo</option>
                  <option value="vencido">Sim, mas está vencido</option>
                  <option value="nao">Não possuo</option>
                </select>
              </Field>
              <Field label="Deseja atendimento prioritário?" required error={errors.prioritario?.message}>
                <select className={inputClass} {...register("prioritario")}>
                  <option value="">Selecione...</option>
                  <option value="sim">Sim, com urgência</option>
                  <option value="nao">Não, atendimento padrão</option>
                </select>
              </Field>
            </div>

            <Field label="Observações" hint="Conte um pouco sobre sua necessidade (opcional)" error={errors.observacoes?.message}>
              <textarea
                className={cn(inputClass, "h-28 py-3 resize-none")}
                placeholder="Ex.: Preciso participar de um pregão na próxima semana..."
                {...register("observacoes")}
              />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div key="s4" className="space-y-6 animate-slide-in">
            <div className="rounded-2xl bg-primary-soft border border-primary/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Seus dados estão protegidos</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seguimos a LGPD. As informações serão usadas exclusivamente para o atendimento da CADBRASIL.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary-glow/60 cursor-pointer transition-smooth">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-primary"
                  checked={values.aceiteTermos === true}
                  onChange={(e) => setValue("aceiteTermos", e.target.checked as true, { shouldValidate: true })}
                />
                <span className="text-sm text-foreground/80">
                  Li e aceito os <a href="#" className="text-primary font-medium hover:underline">Termos de Uso</a> e a{" "}
                  <a href="#" className="text-primary font-medium hover:underline">Política de Privacidade</a>.
                </span>
              </label>
              {errors.aceiteTermos && (
                <p className="text-xs text-destructive flex items-center gap-1 pl-1">
                  <AlertCircle className="w-3 h-3" /> {errors.aceiteTermos.message as string}
                </p>
              )}

              <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary-glow/60 cursor-pointer transition-smooth">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-primary"
                  checked={values.aceiteContato === true}
                  onChange={(e) => setValue("aceiteContato", e.target.checked as true, { shouldValidate: true })}
                />
                <span className="text-sm text-foreground/80">
                  Autorizo a CADBRASIL a entrar em contato pelos canais informados (e-mail, telefone, WhatsApp).
                </span>
              </label>
              {errors.aceiteContato && (
                <p className="text-xs text-destructive flex items-center gap-1 pl-1">
                  <AlertCircle className="w-3 h-3" /> {errors.aceiteContato.message as string}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-gradient-soft p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Resumo</p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div><dt className="text-muted-foreground text-xs">Empresa</dt><dd className="font-medium text-foreground truncate">{values.razaoSocial || "—"}</dd></div>
                <div><dt className="text-muted-foreground text-xs">CNPJ</dt><dd className="font-medium text-foreground">{values.cnpj || "—"}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Responsável</dt><dd className="font-medium text-foreground truncate">{values.nomeResponsavel || "—"}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Serviço</dt><dd className="font-medium text-foreground truncate">{values.servico || "—"}</dd></div>
              </dl>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-6 md:px-8 py-5 border-t border-border/60 bg-gradient-soft flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={prev}
          disabled={step === 0 || submitting}
          className="text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={next}
            className="h-11 px-6 rounded-xl bg-gradient-cta text-primary-foreground font-semibold shadow-cta hover:opacity-95 hover:shadow-elevated transition-smooth"
          >
            Continuar cadastro <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 px-6 rounded-xl bg-gradient-cta text-primary-foreground font-semibold shadow-cta hover:opacity-95 hover:shadow-elevated transition-smooth disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
              </>
            ) : (
              <>Quero iniciar meu atendimento <ArrowRight className="w-4 h-4 ml-1.5" /></>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
