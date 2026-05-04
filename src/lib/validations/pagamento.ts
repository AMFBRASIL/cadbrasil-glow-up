import { z } from "zod";

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export const pagamentoBodySchema = z
  .object({
    protocolo: z.string().regex(/^SICAF-[A-Z0-9]{8}-\d{4}$/, "Protocolo inválido"),
    tipoPessoa: z.enum(["PJ", "PF"]),
    nomeResponsavel: z.string().trim().min(2).max(120),
    razaoSocial: z.string().trim().max(160).optional().or(z.literal("")),
    cnpj: z.string().optional().or(z.literal("")),
    cpf: z.string().optional().or(z.literal("")),
    email: z.string().trim().email().max(160),
    telefone: z.string().min(10),
    rua: z.string().trim().min(2).max(160),
    numero: z.string().trim().min(1).max(10),
    complemento: z.string().trim().max(60).optional().or(z.literal("")),
    bairro: z.string().trim().min(2).max(80),
    cep: z.string().refine((v) => onlyDigits(v).length === 8, "CEP inválido"),
    cidade: z.string().trim().min(2).max(80),
    estado: z.string().length(2),
  })
  .superRefine((data, ctx) => {
    if (data.tipoPessoa === "PJ") {
      const cnpj = onlyDigits(data.cnpj || "");
      if (cnpj.length !== 14) {
        ctx.addIssue({ code: "custom", path: ["cnpj"], message: "CNPJ inválido" });
      }
      if (!data.razaoSocial || data.razaoSocial.trim().length < 2) {
        ctx.addIssue({ code: "custom", path: ["razaoSocial"], message: "Razão social obrigatória" });
      }
    } else {
      const cpf = onlyDigits(data.cpf || "");
      if (cpf.length !== 11) {
        ctx.addIssue({ code: "custom", path: ["cpf"], message: "CPF inválido" });
      }
    }
  });

export type PagamentoBody = z.infer<typeof pagamentoBodySchema>;
