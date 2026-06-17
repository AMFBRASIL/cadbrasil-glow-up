import { z } from "zod";

const cnaeItemSchema = z.object({
  codigo: z.string().trim().min(1).max(10),
  descricao: z.string().trim().min(1).max(255),
  tipo: z.enum(["principal", "secundario"]),
});

const baseSchema = {
  tipoPessoa: z.enum(["PJ", "PF"], { message: "Selecione CPF ou CNPJ" }),
  razaoSocial: z.string().trim().max(160).optional().or(z.literal("")),
  nomeFantasia: z.string().trim().max(160).optional().or(z.literal("")),
  cnpj: z.string().optional().or(z.literal("")),
  inscricaoEstadual: z.string().trim().max(30).optional().or(z.literal("")),
  porte: z.string().optional().or(z.literal("")),
  segmento: z.string().trim().max(120).optional().or(z.literal("")),
  cnaes: z.array(cnaeItemSchema).optional(),
  nomeResponsavel: z.string().trim().min(2, "Informe o nome").max(120),
  cpf: z.string().optional().or(z.literal("")),
  cargo: z.string().trim().max(60).optional().or(z.literal("")),
  telefone: z.string().refine((v) => v.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  email: z.string().trim().email("E-mail inválido").max(160),
  cep: z.string().refine((v) => v.replace(/\D/g, "").length === 8, "CEP inválido"),
  rua: z.string().trim().min(2, "Informe a rua").max(160),
  numero: z.string().trim().min(1, "Nº").max(10),
  complemento: z.string().trim().max(60).optional().or(z.literal("")),
  bairro: z.string().trim().min(2, "Informe o bairro").max(80),
  cidade: z.string().trim().min(2, "Informe a cidade").max(80),
  estado: z.string().length(2, "UF"),
  servico: z.string().min(1, "Selecione um serviço"),
  possuiSicaf: z.string().min(1, "Selecione"),
  prioritario: z.string().min(1, "Selecione"),
  observacoes: z.string().trim().max(500).optional().or(z.literal("")),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(128),
  confirmarSenha: z.string().min(1, "Confirme a senha"),
  emailAcesso: z.string().trim().max(160).optional().or(z.literal("")),
  aceitaNotificacoes: z.boolean().optional(),
  aceiteTermos: z.literal(true, { message: "Você precisa aceitar os termos" }),
  aceiteContato: z.boolean().optional(),
};

export function isValidCPF(raw: string): boolean {
  const cpf = (raw || "").replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i], 10) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cpf[9], 10)) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i], 10) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(cpf[10], 10);
}

export const cadastroSchema = z
  .object(baseSchema)
  .superRefine((data, ctx) => {
    if (data.confirmarSenha !== data.senha) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmarSenha"],
        message: "As senhas não coincidem",
      });
    }
    const ea = data.emailAcesso?.trim();
    if (ea && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ea)) {
      ctx.addIssue({ code: "custom", path: ["emailAcesso"], message: "E-mail de acesso inválido" });
    }
  })
  .superRefine((data, ctx) => {
    if (data.tipoPessoa === "PJ") {
      if (!data.cnpj || data.cnpj.replace(/\D/g, "").length !== 14)
        ctx.addIssue({ code: "custom", path: ["cnpj"], message: "CNPJ inválido" });
      if (!data.razaoSocial || data.razaoSocial.trim().length < 2)
        ctx.addIssue({ code: "custom", path: ["razaoSocial"], message: "Informe a razão social" });
      if (!data.porte) ctx.addIssue({ code: "custom", path: ["porte"], message: "Selecione o porte" });
      if (!data.segmento || data.segmento.trim().length < 2)
        ctx.addIssue({ code: "custom", path: ["segmento"], message: "Informe o segmento" });
      if (!data.cpf || !isValidCPF(data.cpf))
        ctx.addIssue({ code: "custom", path: ["cpf"], message: "CPF inválido" });
    }
    if (data.tipoPessoa === "PF") {
      if (!data.cpf || !isValidCPF(data.cpf))
        ctx.addIssue({ code: "custom", path: ["cpf"], message: "CPF inválido" });
    }
  });

/** Body JSON do formulário + campos opcionais de marketing (UTM). */
export const cadastroBodySchema = cadastroSchema.passthrough();

export type CadastroData = z.infer<typeof cadastroSchema>;
export type CadastroBodyInput = z.infer<typeof cadastroBodySchema>;
