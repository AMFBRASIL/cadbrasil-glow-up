"use client";

import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lookupCnpjAction } from "@/app/actions/cnpj-lookup";
import { cadastroSchema, type CadastroData, isValidCPF } from "@/lib/validations/cadastro";
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
  CreditCard,
  ScanSearch,
  CircleX,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COMPLEMENTO_MAX_LENGTH = 60;

function sanitizeComplemento(raw: string): string {
  const normalized = raw
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, COMPLEMENTO_MAX_LENGTH);

  if (!normalized || /^[\s*\-./]+$/.test(normalized)) return "";
  return normalized;
}

function getCpfValidationState(cpf: string | undefined) {
  const digits = cpf?.replace(/\D/g, "") || "";
  const complete = digits.length === 11;
  return {
    complete,
    valid: complete && isValidCPF(cpf || ""),
  };
}

function CpfInputStatusIcon({
  loading,
  cpf,
}: {
  loading?: boolean;
  cpf: string | undefined;
}) {
  const { complete, valid } = getCpfValidationState(cpf);

  if (loading) {
    return (
      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
    );
  }
  if (!complete) return null;
  if (valid) {
    return (
      <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
    );
  }
  return (
    <CircleX className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
  );
}
import { getTrackingParamsForPayload } from "@/lib/tracking";
import { trackConversion } from "@/lib/utm";
import { Button } from "@/components/ui/button";
import { PagamentoTaxaDialog, type PagamentoTaxaDados } from "@/components/PagamentoTaxaDialog";
import { SicafAnalysisModal, type SicafAnalysisCompany } from "@/components/SicafAnalysisModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

type ExistingSupplier = {
  tipo: "CPF" | "CNPJ";
  documento: string;
};

const FORNECEDOR_PORTAL_URL = "https://fornecedor.cadbrasil.com.br";

function resolvePortalUrl(): string {
  const raw = process.env.NEXT_PUBLIC_PORTAL_URL?.trim();
  if (raw && raw.length > 0) return raw.replace(/\/$/, "");
  return FORNECEDOR_PORTAL_URL;
}

function LegalModal({
  trigger,
  title,
  description,
  children,
}: {
  trigger: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-primary font-medium hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          {trigger}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 text-sm leading-6 text-foreground/80 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_strong]:text-foreground">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExistingSupplierModal({
  open,
  onOpenChange,
  supplier,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: ExistingSupplier | null;
}) {
  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        <div className="bg-gradient-soft px-6 pt-6 pb-5 border-b border-border">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-soft">
            <KeyRound className="h-8 w-8" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-display">Fornecedor já cadastrado</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Encontramos um cadastro ativo para este {supplier.tipo}. Para continuar o atendimento, acesse a
              plataforma do fornecedor com seu login e senha.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "Acesse", text: "Entre na plataforma segura da CADBRASIL." },
              { title: "Faça login", text: "Use o e-mail e senha cadastrados anteriormente." },
              { title: "Continue", text: "Acompanhe ou atualize seu processo pelo painel." },
            ].map((item, index) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                  {index + 1}
                </div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <a
            href={FORNECEDOR_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-cta px-6 py-4 text-base font-bold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.01] hover:shadow-elevated"
          >
            Acessar Plataforma Fornecedor
            <ExternalLink className="h-5 w-5" />
          </a>

          <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" />
            Caso não lembre a senha, utilize a opção de recuperação na tela de login.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExistingSupplierCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="md:col-span-2 rounded-2xl border border-primary/20 bg-primary-soft/40 p-4 shadow-soft animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-base font-bold text-foreground">Cadastro já encontrado</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Este fornecedor já possui acesso. Continue pela plataforma usando login e senha.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-cta px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.01]"
        >
          Acessar Plataforma Fornecedor
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function TermsOfUseContent() {
  return (
    <>
      <section className="space-y-2">
        <h3>Sobre a CADBRASIL</h3>
        <p>
          CADBRASIL é uma empresa privada, especialista em licitações públicas, dedicada a facilitar o acesso de
          fornecedores ao mercado governamental. Não somos órgão público, nem temos qualquer vínculo com o governo.
          Nosso objetivo é oferecer soluções inovadoras e seguras para empresas que desejam participar de licitações,
          com total transparência e ética.
        </p>
      </section>

      <section className="space-y-2">
        <h3>Nossos Serviços</h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>Sistemas inteligentes de leitura de editais com Inteligência Artificial (IA), otimizando a análise de oportunidades.</li>
          <li>Assessoria completa para cadastro no SICAF e outros sistemas de habilitação.</li>
          <li>Todos os serviços são prestados de forma independente, sem qualquer relação com órgãos governamentais.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3>Regras de Uso</h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>O usuário deve fornecer informações verdadeiras e atualizadas no momento do cadastro.</li>
          <li>O acesso ao sistema é pessoal, intransferível e protegido por senha.</li>
          <li>É proibido compartilhar dados de acesso com terceiros.</li>
          <li>O uso indevido do sistema pode resultar em bloqueio ou exclusão do cadastro.</li>
          <li>O usuário é responsável por manter a confidencialidade de suas credenciais.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h3>Proteção de Dados e LGPD</h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>Seus dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).</li>
          <li>As informações coletadas são utilizadas exclusivamente para fins de cadastro, contato e cumprimento de obrigações legais.</li>
          <li>Não compartilhamos dados pessoais com terceiros sem consentimento explícito do usuário.</li>
          <li>O usuário pode solicitar a exclusão ou atualização de seus dados a qualquer momento.</li>
          <li>Adotamos medidas técnicas e administrativas para garantir a segurança e confidencialidade das informações.</li>
        </ul>
      </section>

      <p className="text-xs text-muted-foreground">Última atualização: 01/07/2024</p>
    </>
  );
}

function PrivacyPolicyContent() {
  return (
    <>
      <section className="space-y-2">
        <h3>1. Introdução</h3>
        <p>
          A CADBRASIL, empresa especializada em serviços de licitações e cadastros para órgãos públicos, está
          comprometida em proteger a privacidade e os dados pessoais de seus usuários. Esta Política de Privacidade
          descreve como coletamos, utilizamos, armazenamos e protegemos suas informações pessoais, em conformidade com
          a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>
      </section>

      <section className="space-y-3">
        <h3>2. Dados Coletados</h3>
        <div>
          <strong>Dados da Empresa</strong>
          <p>CNPJ, razão social, nome fantasia, CNAE, endereço completo, telefone, email.</p>
        </div>
        <div>
          <strong>Dados do Representante</strong>
          <p>Nome completo, CPF, telefone, email.</p>
        </div>
        <div>
          <strong>Dados de Licitação</strong>
          <p>Área de atuação, experiência em licitações, certificações.</p>
        </div>
        <div>
          <strong>Dados de Acesso</strong>
          <p>Email e senha para acesso ao sistema.</p>
        </div>
      </section>

      <section className="space-y-2">
        <h3>3. Finalidade do Tratamento</h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>Cadastro e gestão de fornecedores no sistema CADBRASIL.</li>
          <li>Processamento de cadastros para SICAF e outros órgãos públicos.</li>
          <li>Análise de editais e oportunidades de licitação.</li>
          <li>Comunicação sobre serviços, atualizações e oportunidades.</li>
          <li>Cumprimento de obrigações legais e regulamentares.</li>
          <li>Melhoria dos nossos serviços e experiência do usuário.</li>
          <li>Prevenção de fraudes e segurança do sistema.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3>4. Base Legal</h3>
        <div>
          <strong>Execução de Contrato</strong>
          <p>Para prestação dos serviços contratados.</p>
        </div>
        <div>
          <strong>Interesse Legítimo</strong>
          <p>Para melhorar nossos serviços e comunicação.</p>
        </div>
        <div>
          <strong>Obrigação Legal</strong>
          <p>Para cumprir determinações legais e regulamentares.</p>
        </div>
        <div>
          <strong>Consentimento</strong>
          <p>Para finalidades específicas quando solicitado.</p>
        </div>
      </section>

      <section className="space-y-2">
        <h3>5. Compartilhamento de Dados</h3>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Órgãos Públicos:</strong> Para cadastros em SICAF, Comprasnet e outros sistemas.</li>
          <li><strong>Prestadores de Serviços:</strong> Empresas que nos auxiliam na prestação dos serviços.</li>
          <li><strong>Autoridades Competentes:</strong> Quando exigido por lei ou determinação judicial.</li>
        </ul>
        <p>Não vendemos, alugamos ou comercializamos seus dados pessoais com terceiros para fins comerciais.</p>
      </section>

      <section className="space-y-2">
        <h3>6. Armazenamento e Segurança</h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>Criptografia de dados.</li>
          <li>Controle de acesso rigoroso.</li>
          <li>Monitoramento contínuo.</li>
          <li>Backup regular e seguro.</li>
          <li>Treinamento da equipe.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3>7. Retenção de Dados</h3>
        <p>Mantemos seus dados pelo tempo necessário para:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Prestação dos serviços contratados.</li>
          <li>Cumprimento de obrigações legais.</li>
          <li>Resolução de disputas.</li>
          <li>Exercício de direitos em processos judiciais.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3>8. Seus Direitos (LGPD)</h3>
        <div>
          <strong>Acesso</strong>
          <p>Solicitar informações sobre seus dados.</p>
        </div>
        <div>
          <strong>Correção</strong>
          <p>Corrigir dados incorretos.</p>
        </div>
        <div>
          <strong>Exclusão</strong>
          <p>Solicitar exclusão de dados.</p>
        </div>
        <div>
          <strong>Portabilidade</strong>
          <p>Receber dados em formato estruturado.</p>
        </div>
        <div>
          <strong>Revogação</strong>
          <p>Revogar consentimento.</p>
        </div>
        <div>
          <strong>Oposição</strong>
          <p>Opor-se ao tratamento.</p>
        </div>
      </section>

      <section className="space-y-2">
        <h3>9. Cookies e Tecnologias Similares</h3>
        <p>
          Utilizamos cookies para melhorar a experiência de navegação, analisar o uso do sistema, personalizar conteúdo
          e garantir a segurança. Você pode gerenciar as configurações através do seu navegador.
        </p>
      </section>

      <section className="space-y-2">
        <h3>10. Transferências Internacionais</h3>
        <p>
          Seus dados podem ser transferidos para países que ofereçam grau de proteção adequado à LGPD ou mediante
          garantias contratuais específicas.
        </p>
      </section>

      <section className="space-y-2">
        <h3>11. Alterações na Política</h3>
        <p>
          Esta Política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através do
          sistema ou por email.
        </p>
      </section>

      <section className="space-y-2">
        <h3>12. Contato</h3>
        <p>privacidade@cadbrasil.com.br</p>
        <p>(11) 2122-0202</p>
        <p>Rua Dr. Luis Migliano, 1986 - São Paulo/SP - CEP: 48152-000</p>
        <p>Encarregado de Dados (DPO): dpo@cadbrasil.com.br</p>
      </section>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p>Última atualização: 15/01/2025</p>
        <p>Versão: 1.0</p>
      </div>
    </>
  );
}

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
  const [cepLoading, setCepLoading] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjFetched, setCnpjFetched] = useState(false);
  const [cnpjManualFill, setCnpjManualFill] = useState(false);
  const [documentCheckLoading, setDocumentCheckLoading] = useState(false);
  const [lastCheckedDocument, setLastCheckedDocument] = useState("");
  const [existingSupplier, setExistingSupplier] = useState<ExistingSupplier | null>(null);
  const [existingSupplierModalOpen, setExistingSupplierModalOpen] = useState(false);
  const [pagamentoDialogOpen, setPagamentoDialogOpen] = useState(false);
  const [sicafAnalysisOpen, setSicafAnalysisOpen] = useState(false);
  const [analysisCompanySnapshot, setAnalysisCompanySnapshot] = useState<SicafAnalysisCompany | null>(null);

  const form = useForm<CadastroData>({
    resolver: zodResolver(cadastroSchema),
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      tipoPessoa: undefined as unknown as "PJ",
      razaoSocial: "", nomeFantasia: "", cnpj: "", inscricaoEstadual: "",
      porte: "", segmento: "",
      cnaes: [] as CadastroData["cnaes"],
      nomeResponsavel: "", cpf: "", cargo: "", telefone: "", email: "",
      cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
      servico: "Novo Cadastro SICAF", possuiSicaf: "nao", prioritario: "nao", observacoes: "",
      senha: "", confirmarSenha: "", emailAcesso: "", aceitaNotificacoes: false,
      aceiteTermos: undefined as unknown as true,
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger, getValues, getFieldState } = form;
  const values = watch();
  const tipoPessoa = values.tipoPessoa;

  const STEP_FIELDS: Record<number, (keyof CadastroData)[]> = {
    0: ["tipoPessoa"],
    1: tipoPessoa === "PJ"
      ? ["cnpj", "razaoSocial", "porte", "segmento"]
      : ["cpf", "nomeResponsavel"],
    2: tipoPessoa === "PJ"
      ? ["nomeResponsavel", "cpf", "telefone", "email"]
      : ["telefone", "email"],
    3: ["cep", "rua", "numero", "complemento", "bairro", "cidade", "estado"],
    4: ["servico", "observacoes"],
    5: ["senha", "confirmarSenha", "emailAcesso", "aceiteTermos"],
  };

  const resetExistingSupplierIfDocumentChanged = (documento: string) => {
    if (lastCheckedDocument && lastCheckedDocument !== documento) {
      setLastCheckedDocument("");
    }
    if (existingSupplier && existingSupplier.documento !== documento) {
      setExistingSupplier(null);
      setExistingSupplierModalOpen(false);
    }
  };

  const checkExistingSupplier = async (raw: string, tipo: ExistingSupplier["tipo"]) => {
    const documento = raw.replace(/\D/g, "");
    const expectedLength = tipo === "CNPJ" ? 14 : 11;

    if (documento.length !== expectedLength) {
      resetExistingSupplierIfDocumentChanged(documento);
      return false;
    }

    if (tipo === "CPF" && !isValidCPF(raw)) return false;

    if (lastCheckedDocument === documento) {
      return existingSupplier?.documento === documento;
    }

    if (existingSupplier && existingSupplier.documento !== documento) {
      setExistingSupplier(null);
      setExistingSupplierModalOpen(false);
    }

    setDocumentCheckLoading(true);
    try {
      const res = await fetch(`/api/cadastro/documento?documento=${documento}`, { cache: "no-store" });
      const json = (await res.json().catch(() => ({}))) as { exists?: boolean };

      if (!res.ok) {
        toast.error("Não foi possível verificar se o fornecedor já existe.");
        return false;
      }

      setLastCheckedDocument(documento);

      if (json.exists) {
        const supplier = { tipo, documento };
        setExistingSupplier(supplier);
        setExistingSupplierModalOpen(true);
        return true;
      }

      setExistingSupplier(null);
      return false;
    } catch {
      toast.error("Não foi possível verificar se o fornecedor já existe.");
      return false;
    } finally {
      setDocumentCheckLoading(false);
    }
  };

  /* ---------- CNPJ lookup (CNPJ.ws / Receita Federal) ---------- */
  const clearCompanyFields = () => {
    const fields: Array<keyof CadastroData> = [
      "razaoSocial",
      "nomeFantasia",
      "inscricaoEstadual",
      "porte",
      "segmento",
      "cnaes",
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
    fields.forEach((f) => {
      if (f === "cnaes") {
        setValue("cnaes", [], { shouldValidate: false });
        return;
      }
      setValue(f, "" as never, { shouldValidate: false });
    });
  };

  const resetCnpjCompanyState = () => {
    setCnpjFetched(false);
    setCnpjManualFill(false);
    setSicafAnalysisOpen(false);
    clearCompanyFields();
  };

  const lookupCNPJ = async (raw: string): Promise<SicafAnalysisCompany | null> => {
    const cnpj = raw.replace(/\D/g, "");
    if (cnpj.length !== 14) return null;
    setCnpjLoading(true);
    setCnpjFetched(false);
    setCnpjManualFill(false);
    try {
      const result = await lookupCnpjAction(cnpj);
      if (result.ok === false) {
        clearCompanyFields();
        setValue("porte", "MEDIA", { shouldValidate: true });
        setValue("segmento", "Atividade empresarial", { shouldValidate: true });
        setValue("cnaes", [], { shouldValidate: false });
        setCnpjFetched(false);
        setCnpjManualFill(true);
        if (result.error === "Serviço de consulta indisponível") {
          toast.error("Consulta CNPJ indisponível no momento. Preencha manualmente.");
        } else {
          toast.info("CNPJ não localizado. Preencha os dados manualmente.");
        }
        return {
          cnpj: raw,
          razaoSocial: "",
          segmento: "",
          cnpjFetched: false,
        };
      }
      const d = result.data;
      setValue("razaoSocial", d.razao_social || "", { shouldValidate: true });
      setValue("nomeFantasia", d.nome_fantasia || "", { shouldValidate: true });
      setValue("inscricaoEstadual", d.inscricao_estadual || "", { shouldValidate: true });
      setValue("porte", d.porte || "MEDIA", { shouldValidate: true });
      setValue("segmento", d.cnae_fiscal_descricao?.trim() || "Atividade empresarial", { shouldValidate: true });
      setValue("cnaes", d.cnaes ?? [], { shouldValidate: false });
      // endereço
      if (d.cep) setValue("cep", maskCEP(String(d.cep)), { shouldValidate: true });
      setValue("rua", d.logradouro || "", { shouldValidate: true });
      setValue("numero", d.numero || "", { shouldValidate: true });
      setValue("complemento", sanitizeComplemento(d.complemento || ""), { shouldValidate: true });
      setValue("bairro", d.bairro || "", { shouldValidate: true });
      setValue("cidade", d.municipio || "", { shouldValidate: true });
      setValue("estado", (d.uf || "").toUpperCase(), { shouldValidate: true });
      // contatos
      if (d.ddd_telefone_1) {
        setValue("telefone", maskPhone(String(d.ddd_telefone_1)), { shouldValidate: true });
      }
      if (d.email) setValue("email", String(d.email).toLowerCase(), { shouldValidate: true });
      setCnpjManualFill(false);
      setCnpjFetched(true);
      toast.success("Dados preenchidos automaticamente pela Receita Federal");
      return {
        cnpj: raw,
        razaoSocial: d.razao_social || "",
        segmento: d.cnae_fiscal_descricao || "",
        cnpjFetched: true,
      };
    } catch {
      clearCompanyFields();
      setValue("porte", "MEDIA", { shouldValidate: true });
      setValue("segmento", "Atividade empresarial", { shouldValidate: true });
      setCnpjFetched(false);
      setCnpjManualFill(true);
      toast.info("Não foi possível consultar agora. Preencha manualmente.");
      return {
        cnpj: raw,
        razaoSocial: "",
        segmento: "",
        cnpjFetched: false,
      };
    } finally {
      setCnpjLoading(false);
    }
  };

  const handleAnalisarSicaf = async () => {
    const cnpjRaw = values.cnpj || "";
    const digits = cnpjRaw.replace(/\D/g, "");
    if (digits.length !== 14) {
      toast.info("Informe um CNPJ completo para analisar.");
      return;
    }
    if (existingSupplier?.tipo === "CNPJ") return;
    if (documentCheckLoading || cnpjLoading) {
      toast.info("Aguarde a verificação do CNPJ.");
      return;
    }

    let snapshot: SicafAnalysisCompany;
    if (cnpjFetched || cnpjManualFill) {
      snapshot = {
        cnpj: cnpjRaw,
        razaoSocial: values.razaoSocial || "",
        segmento: values.segmento || "",
        cnpjFetched,
      };
    } else {
      const lookedUp = await lookupCNPJ(cnpjRaw);
      snapshot = lookedUp ?? {
        cnpj: cnpjRaw,
        razaoSocial: "",
        segmento: "",
        cnpjFetched: false,
      };
    }

    setAnalysisCompanySnapshot(snapshot);
    setSicafAnalysisOpen(true);
  };

  const handleCnpjCompleted = async (raw: string) => {
    const exists = await checkExistingSupplier(raw, "CNPJ");
    if (!exists) await lookupCNPJ(raw);
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

  const ensurePjCompanyDefaults = () => {
    if (tipoPessoa !== "PJ") return;
    if (!getValues("porte")) {
      setValue("porte", "MEDIA", { shouldValidate: true });
    }
    const segmento = getValues("segmento")?.trim() || "";
    if (segmento.length < 2) {
      setValue("segmento", "Atividade empresarial", { shouldValidate: true });
    }
  };

  const next = async () => {
    if (step === 0 && !tipoPessoa) {
      toast.error("Selecione CPF ou CNPJ para continuar");
      return;
    }
    if (existingSupplier) {
      setExistingSupplierModalOpen(true);
      toast.info("Fornecedor já cadastrado. Acesse a plataforma para continuar.");
      return;
    }
    if (step === 1 && tipoPessoa === "PF") {
      const cpfDigits = values.cpf?.replace(/\D/g, "") || "";
      if (cpfDigits.length !== 11 || !isValidCPF(values.cpf || "")) {
        await trigger("cpf");
        toast.error("Informe um CPF válido para continuar.");
        return;
      }
      if (documentCheckLoading) {
        toast.info("Aguarde a verificação do CPF.");
        return;
      }
    }
    if (step === 1 && tipoPessoa === "PJ") {
      const cnpjDigits = values.cnpj?.replace(/\D/g, "") || "";
      if (cnpjDigits.length === 14) {
        if (documentCheckLoading || cnpjLoading) {
          toast.info("Aguarde a consulta do CNPJ.");
          return;
        }
        if (!cnpjFetched && !cnpjManualFill) {
          toast.info("Aguarde o carregamento dos dados do CNPJ.");
          return;
        }
      }
      ensurePjCompanyDefaults();
    }
    const ok = await trigger(STEP_FIELDS[step]);
    if (!ok) {
      const firstError = STEP_FIELDS[step]
        .map((field) => ({ field, message: getFieldState(field).error?.message }))
        .find((item) => item.message);
      toast.error(firstError?.message || "Verifique os campos destacados");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onInvalidSubmit = (fieldErrors: typeof errors) => {
    const first = Object.values(fieldErrors)
      .map((err) => err?.message)
      .find(Boolean);
    toast.error(first || "Verifique os campos obrigatórios antes de enviar.");
  };

  const onSubmit = async (data: CadastroData) => {
    if (existingSupplier) {
      setExistingSupplierModalOpen(true);
      toast.info("Fornecedor já cadastrado. Acesse a plataforma para continuar.");
      return;
    }
    setSubmitting(true);
    try {
      const trackingParams = getTrackingParamsForPayload();
      const payload: CadastroData = {
        ...data,
        possuiSicaf: data.possuiSicaf || "nao",
        prioritario: data.prioritario || "nao",
        cnaes: data.tipoPessoa === "PJ" ? data.cnaes ?? getValues("cnaes") ?? [] : [],
      };
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, ...trackingParams }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        success?: boolean;
        protocolo?: string;
      };
      if (!res.ok) {
        toast.error(json.error || json.message || "Não foi possível enviar o cadastro.");
        return;
      }
      if (!json.success || !json.protocolo) {
        toast.error("Resposta inválida do servidor.");
        return;
      }
      window.location.href = `/conclusao-cadastro?protocolo=${encodeURIComponent(json.protocolo)}`;
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  if (success) {
    const portalUrl = resolvePortalUrl();
    const emailLogin = values.emailAcesso?.trim() || values.email;
    const pagamentoDados: PagamentoTaxaDados | null =
      values.tipoPessoa === "PJ" || values.tipoPessoa === "PF"
        ? {
            protocolo,
            tipoPessoa: values.tipoPessoa,
            nomeResponsavel: values.nomeResponsavel,
            razaoSocial: values.razaoSocial,
            cnpj: values.cnpj,
            cpf: values.cpf,
            email: values.email,
            telefone: values.telefone,
            rua: values.rua,
            numero: values.numero,
            complemento: values.complemento,
            bairro: values.bairro,
            cep: values.cep,
            cidade: values.cidade,
            estado: values.estado,
          }
        : null;

    return (
      <div className="bg-card rounded-3xl shadow-elevated border border-border/60 p-6 md:p-8 animate-fade-up max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
            Cadastro enviado com sucesso
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg text-balance mb-5 leading-relaxed">
            Para agilizar: entre no portal,{" "}
            <strong className="font-semibold text-foreground">quite a taxa da licença</strong> e envie os documentos.
            Assim o processo já pode ser iniciado.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-muted/25 px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Protocolo</span>
            <code className="font-mono text-xs md:text-sm font-semibold text-foreground tracking-tight">{protocolo}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(protocolo);
                toast.success("Protocolo copiado!");
              }}
              className="rounded-md p-1.5 text-primary hover:bg-primary-soft transition-smooth"
              aria-label="Copiar protocolo"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Guarde o protocolo para falar com o suporte, se precisar.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setPagamentoDialogOpen(true)}
            className="group flex flex-col rounded-2xl border-2 border-primary/25 bg-gradient-soft p-5 text-left shadow-soft transition-smooth hover:border-primary/45 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 text-left"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-cta text-primary-foreground shadow-soft">
              <CreditCard className="h-5 w-5" />
            </div>
            <p className="font-display text-base font-bold text-foreground">Pagar taxa da licença</p>
            <p className="mt-2 flex-1 text-xs text-muted-foreground leading-relaxed">
              Gere <strong className="font-medium text-foreground">boleto</strong> ou{" "}
              <strong className="font-medium text-foreground">PIX</strong> pela Efí (Gerencianet). O valor é cobrado para o protocolo do seu cadastro.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Boleto ou PIX — gerar cobrança
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>

          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-border/80 bg-card p-5 text-left shadow-soft transition-smooth hover:border-primary/30 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <FileUp className="h-5 w-5" />
            </div>
            <p className="font-display text-base font-bold text-foreground">Enviar documentos</p>
            <p className="mt-2 flex-1 text-xs text-muted-foreground leading-relaxed">
              Envie a documentação solicitada pelo sistema no portal do fornecedor. Você pode fazer isso após o pagamento ou conforme as instruções na sua área logada.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Abrir portal — documentos
              <ExternalLink className="h-4 w-4 opacity-80 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>

        <div className="mt-5 flex items-start justify-center gap-2 rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-center sm:text-left">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Acesso ao portal:</span> use o e-mail{" "}
            <span className="font-medium text-foreground">{emailLogin}</span> e a senha definida no cadastro.
            <span className="hidden sm:inline"> </span>
            <span className="block sm:inline text-muted-foreground/90">
              Conexão segura · mesmo site para pagamento e envio de arquivos.
            </span>
          </p>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center text-balance">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success" />
          Pagamento via Efí · envio de documentos no portal oficial CADBRASIL
        </p>

        <PagamentoTaxaDialog
          open={pagamentoDialogOpen}
          onOpenChange={setPagamentoDialogOpen}
          dados={pagamentoDados}
        />

        <div className="mt-5 flex justify-center">
          <Button
            onClick={() => {
              setSuccess(false);
              setStep(0);
              setCnpjFetched(false);
              setProtocolo("");
              setExistingSupplier(null);
              setExistingSupplierModalOpen(false);
              setLastCheckedDocument("");
              form.reset();
            }}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            Fazer novo cadastro
          </Button>
        </div>
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
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className="bg-card rounded-3xl shadow-elevated overflow-hidden border border-border/60"
    >
      <input type="hidden" {...register("possuiSicaf")} />
      <input type="hidden" {...register("prioritario")} />
      <ExistingSupplierModal
        open={existingSupplierModalOpen}
        onOpenChange={setExistingSupplierModalOpen}
        supplier={existingSupplier}
      />

      {analysisCompanySnapshot ? (
        <SicafAnalysisModal
          open={sicafAnalysisOpen}
          onOpenChange={setSicafAnalysisOpen}
          company={analysisCompanySnapshot}
          onRegularizar={() => {
            toast.success("Continue o cadastro para regularizar sua empresa com a CADBRASIL.");
          }}
        />
      ) : null}

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
                    onClick={() => {
                      setValue("tipoPessoa", opt.id, { shouldValidate: true });
                      setExistingSupplier(null);
                      setExistingSupplierModalOpen(false);
                      setLastCheckedDocument("");
                      if (opt.id === "PF") {
                        resetCnpjCompanyState();
                        setValue("cnpj", "", { shouldValidate: false });
                        setValue("razaoSocial", "", { shouldValidate: false });
                        setValue("nomeFantasia", "", { shouldValidate: false });
                        setValue("inscricaoEstadual", "", { shouldValidate: false });
                        setValue("porte", "", { shouldValidate: false });
                        setValue("segmento", "", { shouldValidate: false });
                        setValue("cnaes", [], { shouldValidate: false });
                      }
                    }}
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
                  documentCheckLoading
                    ? "Verificando se este fornecedor já existe..."
                    : existingSupplier?.tipo === "CNPJ"
                    ? "Fornecedor já cadastrado. Acesse a plataforma para continuar."
                    : cnpjLoading
                    ? "Consultando Receita Federal..."
                    : cnpjFetched
                    ? "Dados obtidos da Receita Federal. Use o botão abaixo para analisar seu SICAF."
                    : cnpjManualFill
                    ? "CNPJ não localizado. Informe a razão social da empresa."
                    : "Digite o CNPJ completo. Buscaremos automaticamente os dados da empresa."
                }
              >
                <div className="relative">
                  <input
                    className={cn(inputClass, "pr-11 text-base font-medium tracking-wide")}
                    placeholder="00.000.000/0000-00"
                    inputMode="numeric"
                    autoFocus
                    {...register("cnpj")}
                    onChange={(e) => {
                      const v = maskCNPJ(e.target.value);
                      const digits = v.replace(/\D/g, "");
                      setValue("cnpj", v, { shouldValidate: true, shouldDirty: true });
                      if (digits.length < 14) {
                        resetExistingSupplierIfDocumentChanged(digits);
                        resetCnpjCompanyState();
                      }
                      if (digits.length === 14) void handleCnpjCompleted(v);
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {documentCheckLoading || cnpjLoading ? (
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

            {cnpjFetched &&
              !cnpjManualFill &&
              values.cnpj?.replace(/\D/g, "").length === 14 &&
              existingSupplier?.tipo !== "CNPJ" &&
              !documentCheckLoading &&
              !cnpjLoading && (
                <div className="md:col-span-2 mt-1">
                  <button
                    type="button"
                    onClick={() => void handleAnalisarSicaf()}
                    className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl bg-gradient-cta px-6 py-5 sm:py-6 text-primary-foreground shadow-glow transition-smooth hover:scale-[1.01] hover:shadow-elevated"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-2 ring-white/25">
                      <ScanSearch className="h-7 w-7" />
                    </span>
                    <span className="relative flex-1 text-left">
                      <span className="block font-display text-lg sm:text-xl font-bold tracking-tight">
                        Analisar meu SICAF
                      </span>
                      <span className="block text-sm text-primary-foreground/85 mt-1">
                        Diagnóstico gratuito · Receita Federal, certidões e habilitação
                      </span>
                    </span>
                    <ArrowRight className="relative h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              )}

            {existingSupplier?.tipo === "CNPJ" && (
              <ExistingSupplierCard onOpen={() => setExistingSupplierModalOpen(true)} />
            )}

            {(cnpjFetched || cnpjManualFill) && (
              <>
                {cnpjFetched ? (
                  <div className="md:col-span-2 flex items-center gap-2 text-xs text-success bg-success/5 border border-success/20 rounded-xl px-3 py-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Dados obtidos da Receita Federal · revise antes de continuar
                  </div>
                ) : (
                  <div className="md:col-span-2 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200 bg-amber-500/10 border border-amber-500/25 rounded-xl px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    CNPJ não localizado na Receita Federal · informe a razão social
                  </div>
                )}
                <div className="md:col-span-2">
                  <Field label="Razão social" required error={errors.razaoSocial?.message}>
                    <input className={inputClass} placeholder="Empresa LTDA" {...register("razaoSocial")} />
                  </Field>
                </div>
              </>
            )}
          </div>
        )}

        {step === 1 && tipoPessoa === "PF" && (
          <div key="s1pf" className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-in">
            <Field
              label="CPF"
              required
              error={errors.cpf?.message}
              hint={
                documentCheckLoading
                  ? "Verificando se este CPF já está cadastrado..."
                  : existingSupplier?.tipo === "CPF"
                  ? "CPF já cadastrado. Acesse a plataforma para continuar."
                  : undefined
              }
            >
              <div className="relative">
                <input
                  className={cn(inputClass, "pr-11")}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  autoFocus
                  {...register("cpf")}
                  onChange={(e) => {
                    const masked = maskCPF(e.target.value);
                    const digits = masked.replace(/\D/g, "");
                    setValue("cpf", masked, { shouldValidate: true, shouldDirty: true });
                    if (digits.length < 11) resetExistingSupplierIfDocumentChanged(digits);
                    if (digits.length === 11) {
                      void form.trigger("cpf");
                      void checkExistingSupplier(masked, "CPF");
                    }
                  }}
                />
                <CpfInputStatusIcon loading={documentCheckLoading} cpf={values.cpf} />
              </div>
            </Field>
            {existingSupplier?.tipo === "CPF" && (
              <div className="md:col-span-2">
                <ExistingSupplierCard onOpen={() => setExistingSupplierModalOpen(true)} />
              </div>
            )}
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
                <Field label="CPF do responsável" required error={errors.cpf?.message}>
                  <div className="relative">
                    <input
                      className={cn(inputClass, "pr-11")}
                      placeholder="000.000.000-00"
                      inputMode="numeric"
                      {...register("cpf")}
                      onChange={(e) => {
                        const masked = maskCPF(e.target.value);
                        setValue("cpf", masked, { shouldValidate: true, shouldDirty: true });
                        if (masked.replace(/\D/g, "").length === 11) form.trigger("cpf");
                      }}
                    />
                    <CpfInputStatusIcon cpf={values.cpf} />
                  </div>
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
                <input
                  className={inputClass}
                  placeholder="Sala, andar..."
                  maxLength={COMPLEMENTO_MAX_LENGTH}
                  value={values.complemento}
                  onChange={(e) => setValue("complemento", sanitizeComplemento(e.target.value), { shouldValidate: true })}
                />
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
            <div className="rounded-xl border border-primary/15 bg-primary-soft/40 p-4 shadow-soft">
              <div className="mb-3">
                <p className="font-display text-lg font-bold text-foreground">Serviço de interesse</p>
                <p className="text-xs text-muted-foreground mt-1">Selecione o que você precisa.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { label: "Novo Cadastro SICAF", desc: "Primeira habilitação no SICAF" },
                  { label: "Atualizacao SICAF", desc: "Renovar ou corrigir cadastro" },
                  { label: "Suporte Documental", desc: "Certidões e documentação" },
                  { label: "Outro", desc: "Descreva nas observações" },
                ].map(({ label, desc }) => {
                  const active = values.servico === label;
                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => setValue("servico", label, { shouldValidate: true })}
                      className={cn(
                        "group w-full rounded-xl border px-3.5 py-3 text-left transition-smooth",
                        active
                          ? "border-primary bg-gradient-cta text-primary-foreground shadow-soft"
                          : "border-input bg-card text-foreground hover:border-primary/40 hover:bg-primary-soft/50"
                      )}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="min-w-0">
                          <span className={cn("block text-sm font-bold", !active && "text-foreground")}>
                            {label}
                          </span>
                          <span
                            className={cn(
                              "block text-xs mt-0.5",
                              active ? "text-primary-foreground/85" : "text-muted-foreground"
                            )}
                          >
                            {desc}
                          </span>
                        </span>
                        {active ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground opacity-60 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.servico && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-3">
                  <AlertCircle className="w-3 h-3" /> {errors.servico.message as string}
                </p>
              )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Senha de acesso ao portal" required error={errors.senha?.message}>
                <input
                  type="password"
                  className={inputClass}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  {...register("senha")}
                />
              </Field>
              <Field label="Confirmar senha" required error={errors.confirmarSenha?.message}>
                <input
                  type="password"
                  className={inputClass}
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  {...register("confirmarSenha")}
                />
              </Field>
              <div className="md:col-span-2">
                <Field
                  label="E-mail de login (opcional)"
                  hint="Se vazio, usamos o mesmo e-mail principal do passo anterior."
                  error={errors.emailAcesso?.message}
                >
                  <input type="email" className={inputClass} placeholder="login@suaempresa.com.br" {...register("emailAcesso")} />
                </Field>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary-glow/60 cursor-pointer transition-smooth">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-primary"
                  checked={values.aceitaNotificacoes === true}
                  onChange={(e) => setValue("aceitaNotificacoes", e.target.checked, { shouldValidate: true })}
                />
                <span className="text-sm text-foreground/80">
                  Autorizo enviar uma <strong className="text-foreground">notificação interna</strong> à equipe CADBRASIL sobre este cadastro (e-mail operacional).
                </span>
              </label>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary-glow/60 transition-smooth">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-primary"
                  checked={values.aceiteTermos === true}
                  onChange={(e) => setValue("aceiteTermos", e.target.checked as true, { shouldValidate: true })}
                />
                <span className="text-sm text-foreground/80">
                  Li e aceito os{" "}
                  <LegalModal
                    trigger="Termos de Uso"
                    title="Termos de Uso"
                    description="CADBRASIL - Assessoria em Licitações"
                  >
                    <TermsOfUseContent />
                  </LegalModal>{" "}
                  e a{" "}
                  <LegalModal
                    trigger="Política de Privacidade"
                    title="Política de Privacidade"
                    description="CADBRASIL - Em conformidade com a LGPD"
                  >
                    <PrivacyPolicyContent />
                  </LegalModal>
                  .
                </span>
              </div>
              {errors.aceiteTermos && (
                <p className="text-xs text-destructive flex items-center gap-1 pl-1">
                  <AlertCircle className="w-3 h-3" /> {errors.aceiteTermos.message as string}
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
              <>INICIAR PROCESSO CADBRASIL <ArrowRight className="w-4 h-4 ml-1.5" /></>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
