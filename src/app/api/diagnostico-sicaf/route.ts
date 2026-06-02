import { NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  whatsapp: z.string().trim().min(10).max(20),
  cnpj: z.string().trim().length(14),
  score: z.number().min(0).max(100),
  classificacao: z.string().trim().max(40),
  situacao: z.string().trim().max(80).optional(),
  origem: z.string().trim().max(60),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  gclid: z.string().optional(),
  gbraid: z.string().optional(),
  gad_source: z.string().optional(),
  gad_campaignid: z.string().optional(),
  msclkid: z.string().optional(),
  landing_page: z.string().optional(),
  referrer: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Payload inválido." }, { status: 400 });
    }

    const lead = {
      ...parsed.data,
      criado_em: new Date().toISOString(),
      ferramenta: "diagnostico-sicaf",
    };

    const webhook = process.env.DIAGNOSTICO_SICAF_WEBHOOK_URL?.trim();
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } else {
      console.info("[diagnostico-sicaf] lead capturado", {
        cnpj: lead.cnpj,
        email: lead.email,
        score: lead.score,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[diagnostico-sicaf] erro:", error);
    return NextResponse.json({ ok: false, error: "Erro interno." }, { status: 500 });
  }
}

