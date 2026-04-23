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
  Search,
  Sparkles,
  FileUp,
  Copy,
  ExternalLink,
  KeyRound,
  Eye,
  EyeOff,
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
const baseSchema = {
  // Identificação
  tipoPessoa: z.enum(["PJ", "PF"], { message: "Selecione CPF ou CNPJ" }),
  // Empresa (PJ)
  razaoSocial: z.string().trim().max(160).optional().or(z.literal("")),
  nomeFantasia: z.string().trim().max(160).optional().or(z.literal("")),
  cnpj: z.string().optional().or(z.literal("")),
  inscricaoEstadual: z.string().trim().max(30).optional().or(z.literal("")),
  porte: z.string().optional().or(z.literal("")),
  segmento: z.string().trim().max(120).optional().or(z.literal("")),
  // Responsável / Pessoa
  nomeResponsavel: z.string().trim().min(2, "Informe o nome").max(120),
  cpf: z.string().optional().or(z.literal("")),
  cargo: z.string().trim().max(60).optional().or(z.literal("")),
  telefone: z.string().refine((v) => v.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  email: z.string().trim().email("E-mail inválido").max(160),
  // Endereço
  cep: z.string().refine((v) => v.replace(/\D/g, "").length === 8, "CEP inválido"),
  rua: z.string().trim().min(2, "Informe a rua").max(160),
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
};

const isValidCPF = (raw: string): boolean => {
  const cpf = (raw || "").replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
};

const schema = z.object(baseSchema).superRefine((data, ctx) => {
  if (data.tipoPessoa === "PJ") {
    if (!data.cnpj || data.cnpj.replace(/\D/g, "").length !== 14)
      ctx.addIssue({ code: "custom", path: ["cnpj"], message: "CNPJ inválido" });
    if (!data.razaoSocial || data.razaoSocial.trim().length < 2)
      ctx.addIssue({ code: "custom", path: ["razaoSocial"], message: "Informe a razão social" });
    if (!data.porte) ctx.addIssue({ code: "custom", path: ["porte"], message: "Selecione o porte" });
    if (!data.segmento || data.segmento.trim().length < 2)
      ctx.addIssue({ code: "custom", path: ["segmento"], message: "Informe o segmento" });
    if (!data.cargo || data.cargo.trim().length < 2)
      ctx.addIssue({ code: "custom", path: ["cargo"], message: "Informe o cargo" });
    if (!data.cpf || !isValidCPF(data.cpf))
      ctx.addIssue({ code: "custom", path: ["cpf"], message: "CPF inválido" });
  }
  if (data.tipoPessoa === "PF") {
    if (!data.cpf || !isValidCPF(data.cpf))
      ctx.addIssue({ code: "custom", path: ["cpf"], message: "CPF inválido" });
  }
});

export type CadastroData = z.infer<typeof schema>;

const STEPS = [
  { id: 0, label: "Tipo", icon: Sparkles },
  { id: 1, label: "Identificação", icon: Building2 },
  { id: 2, label: "Responsável", icon: User },
  { id: 3, label: "Endereço", icon: MapPin },
  { id: 4, label: "Atendimento", icon: Briefcase },
  { id: 5, label: "Confirmação", icon: ShieldCheck },
] as const;

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
  const [protocolo, setProtocolo] = useState<string>("");
  const [senhaTemporaria, setSenhaTemporaria] = useState<string>("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjFetched, setCnpjFetched] = useState(false);

  const form = useForm<CadastroData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      tipoPessoa: undefined as unknown as "PJ",
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
  const tipoPessoa = values.tipoPessoa;

  const STEP_FIELDS: Record<number, (keyof CadastroData)[]> = {
    0: ["tipoPessoa"],
    1: tipoPessoa === "PJ"
      ? ["cnpj", "razaoSocial", "nomeFantasia", "inscricaoEstadual", "porte", "segmento"]
      : ["cpf", "nomeResponsavel"],
    2: tipoPessoa === "PJ"
      ? ["nomeResponsavel", "cpf", "cargo", "telefone", "email"]
      : ["telefone", "email"],
    3: ["cep", "rua", "numero", "complemento", "bairro", "cidade", "estado"],
    4: ["servico", "possuiSicaf", "prioritario", "observacoes"],
    5: ["aceiteTermos", "aceiteContato"],
  };

  /* ---------- CNPJ lookup (BrasilAPI / Receita Federal) ---------- */
  const porteMap: Record<string, string> = {
    "MEI": "MEI",
    "ME": "ME",
    "EPP": "EPP",
    "DEMAIS": "MEDIA",
  };

  const clearCompanyFields = () => {
    const fields: Array<keyof CadastroData> = [
      "razaoSocial",
      "nomeFantasia",
      "porte",
      "segmento",
      "cep",
      "rua",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "estado",
      "telefone",
      "email",
    ];
    fields.forEach((f) => setValue(f, "" as never, { shouldValidate: false }));
  };

  const lookupCNPJ = async (raw: string) => {
    const cnpj = raw.replace(/\D/g, "");
    if (cnpj.length !== 14) return;
    setCnpjLoading(true);
    setCnpjFetched(false);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!res.ok) {
        clearCompanyFields();
        toast.info("CNPJ não localizado. Preencha os dados manualmente.");
        return;
      }
      const d = await res.json();
      setValue("razaoSocial", d.razao_social || "", { shouldValidate: true });
      setValue("nomeFantasia", d.nome_fantasia || "", { shouldValidate: true });
      setValue("porte", porteMap[d.porte] || "MEDIA", { shouldValidate: true });
      setValue("segmento", d.cnae_fiscal_descricao || "", { shouldValidate: true });
      // endereço
      if (d.cep) setValue("cep", maskCEP(String(d.cep)), { shouldValidate: true });
      setValue("rua", d.logradouro || "", { shouldValidate: true });
      setValue("numero", d.numero || "", { shouldValidate: true });
      setValue("complemento", d.complemento || "", { shouldValidate: true });
      setValue("bairro", d.bairro || "", { shouldValidate: true });
      setValue("cidade", d.municipio || "", { shouldValidate: true });
      setValue("estado", (d.uf || "").toUpperCase(), { shouldValidate: true });
      // contatos
      if (d.ddd_telefone_1) {
        setValue("telefone", maskPhone(String(d.ddd_telefone_1)), { shouldValidate: true });
      }
      if (d.email) setValue("email", String(d.email).toLowerCase(), { shouldValidate: true });
      setCnpjFetched(true);
      toast.success("Dados preenchidos automaticamente pela Receita Federal");
    } catch {
      clearCompanyFields();
      toast.info("Não foi possível consultar agora. Preencha manualmente.");
    } finally {
      setCnpjLoading(false);
    }
  };

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
    if (step === 0 && !tipoPessoa) {
      toast.error("Selecione CPF ou CNPJ para continuar");
      return;
    }
    const ok = await trigger(STEP_FIELDS[step]);
    if (!ok) {
      toast.error("Verifique os campos destacados");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const gerarSenhaTemporaria = () => {
    const maiusculas = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const minusculas = "abcdefghijkmnpqrstuvwxyz";
    const numeros = "23456789";
    const especiais = "!@#$%&*";
    const todos = maiusculas + minusculas + numeros + especiais;
    const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
    let senha = pick(maiusculas) + pick(minusculas) + pick(numeros) + pick(especiais);
    for (let i = 0; i < 8; i++) senha += pick(todos);
    return senha.split("").sort(() => Math.random() - 0.5).join("");
  };

  const onSubmit = async (_data: CadastroData) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    setProtocolo(`CB-${year}-${rand}`);
    setSenhaTemporaria(gerarSenhaTemporaria());
    setSenhaVisivel(false);
    setSubmitting(false);
    setSuccess(true);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  if (success) {
    return (
      <div className="bg-card rounded-3xl shadow-elevated p-8 md:p-10 text-center animate-fade-up">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-9 h-9 text-success" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
          Cadastro enviado com sucesso!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6 text-balance">
          Recebemos suas informações. Para acelerar seu atendimento, envie agora os documentos necessários.
        </p>

        {/* Protocolo */}
        <div className="max-w-md mx-auto mb-6 rounded-2xl border border-primary/15 bg-gradient-soft p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Número de protocolo</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <p className="font-display font-extrabold text-2xl md:text-3xl text-foreground tracking-wider">
              {protocolo}
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(protocolo);
                toast.success("Protocolo copiado!");
              }}
              className="p-2 rounded-lg hover:bg-primary-soft text-primary transition-smooth"
              aria-label="Copiar protocolo"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Guarde este número para acompanhar seu atendimento.</p>
        </div>

        {/* Senha temporária */}
        <div className="max-w-md mx-auto mb-6 rounded-2xl border border-primary/15 bg-card p-5 text-left">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">Sua senha temporária de acesso</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-base md:text-lg font-bold tracking-wider bg-muted rounded-lg px-3 py-2.5 text-foreground select-all break-all">
              {senhaVisivel ? senhaTemporaria : "•".repeat(senhaTemporaria.length)}
            </div>
            <button
              type="button"
              onClick={() => setSenhaVisivel((v) => !v)}
              className="p-2.5 rounded-lg hover:bg-primary-soft text-primary transition-smooth border border-border"
              aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
            >
              {senhaVisivel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(senhaTemporaria);
                toast.success("Senha copiada!");
              }}
              className="p-2.5 rounded-lg hover:bg-primary-soft text-primary transition-smooth border border-border"
              aria-label="Copiar senha"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
            <Mail className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
            <p>
              Enviamos esta senha também para <span className="font-medium text-foreground">{values.email}</span>. Use-a para acessar o portal e recomendamos alterá-la no primeiro acesso.
            </p>
          </div>
        </div>

        {/* CTA principal — Enviar documentos */}
        <a
          href="https://fornecedor.cadbrasil.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center gap-2.5 w-full max-w-md mx-auto h-14 px-6 rounded-2xl bg-gradient-cta text-primary-foreground font-semibold text-base shadow-cta hover:shadow-elevated hover:opacity-95 transition-smooth"
        >
          <FileUp className="w-5 h-5" />
          Enviar Documentos agora
          <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
        </a>
        <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          Você será direcionado ao portal seguro do fornecedor
        </p>

        <Button
          onClick={() => { setSuccess(false); setStep(0); setCnpjFetched(false); setProtocolo(""); setSenhaTemporaria(""); setSenhaVisivel(false); form.reset(); }}
          variant="ghost"
          className="mt-6 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          Fazer novo cadastro
        </Button>
      </div>
    );
  }

  const stepTitle = (() => {
    switch (step) {
      case 0: return "Como deseja se cadastrar?";
      case 1: return tipoPessoa === "PJ" ? "Dados da empresa" : "Seus dados";
      case 2: return tipoPessoa === "PJ" ? "Dados do responsável" : "Contato";
      case 3: return "Endereço";
      case 4: return "Interesse e atendimento";
      case 5: return "Revisão e envio";
      default: return "";
    }
  })();

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
              {stepTitle}
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
        {/* STEP 0 — Tipo */}
        {step === 0 && (
          <div key="s0" className="animate-slide-in space-y-5">
            <p className="text-sm text-muted-foreground">
              Escolha o tipo de cadastro para começarmos. Se for empresa, vamos buscar os dados automaticamente na Receita Federal.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { id: "PJ" as const, icon: Building2, title: "Sou Empresa", desc: "Cadastro com CNPJ. Buscamos os dados automaticamente na Receita Federal.", badge: "Mais comum" as string | undefined },
                { id: "PF" as const, icon: User, title: "Sou Pessoa Física", desc: "Cadastro com CPF para atendimento individual.", badge: undefined as string | undefined },
              ]).map((opt) => {
                const active = tipoPessoa === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setValue("tipoPessoa", opt.id, { shouldValidate: true })}
                    className={cn(
                      "relative text-left p-5 rounded-2xl border-2 transition-smooth group",
                      active
                        ? "border-primary bg-primary-soft shadow-soft"
                        : "border-border bg-card hover:border-primary-glow/60 hover:bg-primary-soft/30"
                    )}
                  >
                    {opt.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-cta text-primary-foreground uppercase tracking-wider">
                        {opt.badge}
                      </span>
                    )}
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-smooth",
                        active
                          ? "bg-gradient-cta text-primary-foreground"
                          : "bg-primary-soft text-primary group-hover:bg-gradient-cta group-hover:text-primary-foreground"
                      )}
                    >
                      <opt.icon className="w-5 h-5" strokeWidth={2.2} />
                    </div>
                    <p className="font-display font-bold text-foreground text-base">{opt.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.desc}</p>
                    {active && (
                      <CheckCircle2 className="absolute bottom-4 right-4 w-5 h-5 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            {errors.tipoPessoa && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.tipoPessoa.message as string}
              </p>
            )}
          </div>
        )}

        {/* STEP 1 — Identificação */}
        {step === 1 && tipoPessoa === "PJ" && (
          <div key="s1pj" className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-in">
            <div className="md:col-span-2">
              <Field
                label="CNPJ"
                required
                error={errors.cnpj?.message}
                hint={
                  cnpjLoading
                    ? "Consultando Receita Federal..."
                    : cnpjFetched
                    ? "Dados preenchidos automaticamente. Confira e ajuste se necessário."
                    : "Digite o CNPJ completo. Buscaremos automaticamente os dados da empresa."
                }
              >
                <div className="relative">
                  <input
                    className={cn(inputClass, "pr-11 text-base font-medium tracking-wide")}
                    placeholder="00.000.000/0000-00"
                    inputMode="numeric"
                    autoFocus
                    value={values.cnpj}
                    onChange={(e) => {
                      const v = maskCNPJ(e.target.value);
                      setValue("cnpj", v, { shouldValidate: true });
                      if (v.replace(/\D/g, "").length === 14) lookupCNPJ(v);
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {cnpjLoading ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : cnpjFetched ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Search className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </Field>
            </div>

            {(cnpjFetched || values.razaoSocial) && (
              <>
                <div className="md:col-span-2 flex items-center gap-2 text-xs text-success bg-success/5 border border-success/20 rounded-xl px-3 py-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dados obtidos da Receita Federal · revise antes de continuar
                </div>
                <div className="md:col-span-2">
                  <Field label="Razão social" required error={errors.razaoSocial?.message}>
                    <input className={inputClass} placeholder="Empresa LTDA" {...register("razaoSocial")} />
                  </Field>
                </div>
                <Field label="Nome fantasia" error={errors.nomeFantasia?.message}>
                  <input className={inputClass} placeholder="Como é conhecida" {...register("nomeFantasia")} />
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
                <Field label="Segmento de atuação" required error={errors.segmento?.message}>
                  <input className={inputClass} placeholder="Ex.: Construção civil, TI..." {...register("segmento")} />
                </Field>
              </>
            )}
          </div>
        )}

        {step === 1 && tipoPessoa === "PF" && (
          <div key="s1pf" className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-in">
            <Field
              label="CPF"
              required
              error={(values.cpf?.replace(/\D/g, "").length === 11 && !isValidCPF(values.cpf)) ? "CPF inválido" : errors.cpf?.message}
              hint={values.cpf?.replace(/\D/g, "").length === 11 && isValidCPF(values.cpf) ? "CPF válido" : undefined}
            >
              <input
                className={inputClass}
                placeholder="000.000.000-00"
                inputMode="numeric"
                autoFocus
                value={values.cpf}
                onChange={(e) => {
                  const masked = maskCPF(e.target.value);
                  setValue("cpf", masked, { shouldValidate: true });
                  if (masked.replace(/\D/g, "").length === 11) form.trigger("cpf");
                }}
              />
            </Field>
            <Field label="Nome completo" required error={errors.nomeResponsavel?.message}>
              <input className={inputClass} placeholder="Seu nome" {...register("nomeResponsavel")} />
            </Field>
          </div>
        )}

        {/* STEP 2 — Responsável / Contato */}
        {step === 2 && (
          <div key="s2" className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-in">
            {tipoPessoa === "PJ" && (
              <>
                <div className="md:col-span-2">
                  <Field label="Nome completo do responsável" required error={errors.nomeResponsavel?.message}>
                    <input className={inputClass} placeholder="Nome do responsável" {...register("nomeResponsavel")} />
                  </Field>
                </div>
                <Field
                  label="CPF"
                  required
                  error={(values.cpf?.replace(/\D/g, "").length === 11 && !isValidCPF(values.cpf)) ? "CPF inválido" : errors.cpf?.message}
                  hint={values.cpf?.replace(/\D/g, "").length === 11 && isValidCPF(values.cpf) ? "CPF válido" : undefined}
                >
                  <input
                    className={inputClass}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    value={values.cpf}
                    onChange={(e) => {
                      const masked = maskCPF(e.target.value);
                      setValue("cpf", masked, { shouldValidate: true });
                      if (masked.replace(/\D/g, "").length === 11) form.trigger("cpf");
                    }}
                  />
                </Field>
                <Field label="Cargo" required error={errors.cargo?.message}>
                  <input className={inputClass} placeholder="Ex.: Diretor, sócio, gerente" {...register("cargo")} />
                </Field>
              </>
            )}
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

        {/* STEP 3 — Endereço */}
        {step === 3 && (
          <div key="s3" className="grid grid-cols-1 md:grid-cols-6 gap-5 animate-slide-in">
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

        {/* STEP 4 — Atendimento */}
        {step === 4 && (
          <div key="s4" className="grid grid-cols-1 gap-5 animate-slide-in">
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

        {/* STEP 5 — Confirmação */}
        {step === 5 && (
          <div key="s5" className="space-y-6 animate-slide-in">
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
                {tipoPessoa === "PJ" ? (
                  <>
                    <div><dt className="text-muted-foreground text-xs">Empresa</dt><dd className="font-medium text-foreground truncate">{values.razaoSocial || "—"}</dd></div>
                    <div><dt className="text-muted-foreground text-xs">CNPJ</dt><dd className="font-medium text-foreground">{values.cnpj || "—"}</dd></div>
                    <div><dt className="text-muted-foreground text-xs">Responsável</dt><dd className="font-medium text-foreground truncate">{values.nomeResponsavel || "—"}</dd></div>
                  </>
                ) : (
                  <>
                    <div><dt className="text-muted-foreground text-xs">Nome</dt><dd className="font-medium text-foreground truncate">{values.nomeResponsavel || "—"}</dd></div>
                    <div><dt className="text-muted-foreground text-xs">CPF</dt><dd className="font-medium text-foreground">{values.cpf || "—"}</dd></div>
                  </>
                )}
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
