import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

interface ClienteRow extends RowDataPacket {
  id: number;
  tipo_documento: string;
  documento: string;
  razao_social: string;
  nome_fantasia: string | null;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavel_nome: string;
  responsavel_cpf: string | null;
  responsavel_email: string;
  responsavel_telefone: string;
  ProtocoloCadbrasil: string;
}

function parseEndereco(raw: string | null): { rua: string; numero: string; complemento: string; bairro: string } {
  if (!raw) return { rua: "", numero: "S/N", complemento: "", bairro: "" };
  const parts = raw.split(",").map((p) => p.trim());
  if (parts.length >= 4) {
    return {
      rua: parts[0] || "",
      numero: parts[1] || "S/N",
      complemento: parts[2] || "",
      bairro: parts[3] || "",
    };
  }
  if (parts.length === 3) {
    return {
      rua: parts[0] || "",
      numero: parts[1] || "S/N",
      complemento: "",
      bairro: parts[2] || "",
    };
  }
  return {
    rua: parts[0] || "",
    numero: parts[1] || "S/N",
    complemento: "",
    bairro: "",
  };
}

interface UsuarioRow extends RowDataPacket {
  email: string;
}

interface ContratoRow extends RowDataPacket {
  plano: string;
  data_inicio: string;
  data_vencimento: string;
  status: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ protocolo: string }> }
) {
  const { protocolo } = await params;

  if (!protocolo || protocolo.length < 5) {
    return NextResponse.json({ error: "Protocolo inválido." }, { status: 400 });
  }

  try {
    const pool = getPool();

    const [clientes] = await pool.query<ClienteRow[]>(
      `SELECT c.id, c.tipo_documento, c.documento, c.razao_social, c.nome_fantasia,
              c.email, c.telefone, c.endereco, c.cidade, c.estado, c.cep,
              c.responsavel_nome, c.responsavel_cpf, c.responsavel_email, c.responsavel_telefone,
              c.ProtocoloCadbrasil
       FROM clientes c
       WHERE c.ProtocoloCadbrasil = ?
       LIMIT 1`,
      [protocolo]
    );

    if (!clientes.length) {
      return NextResponse.json({ error: "Protocolo não encontrado." }, { status: 404 });
    }

    const cliente = clientes[0];

    const [usuarios] = await pool.query<UsuarioRow[]>(
      `SELECT email FROM usuarios WHERE id = (
        SELECT usuario_id FROM clientes WHERE id = ? LIMIT 1
      )`,
      [cliente.id]
    );

    const [contratos] = await pool.query<ContratoRow[]>(
      `SELECT plano, data_inicio, data_vencimento, status
       FROM contratos_digitais
       WHERE cliente_id = ?
       ORDER BY id DESC LIMIT 1`,
      [cliente.id]
    );

    const emailAcesso = usuarios[0]?.email || cliente.email;
    const contrato = contratos[0] || null;
    const tipoPessoa = cliente.tipo_documento === "CNPJ" ? "PJ" : "PF";
    const addr = parseEndereco(cliente.endereco);

    return NextResponse.json({
      protocolo: cliente.ProtocoloCadbrasil,
      nome: cliente.responsavel_nome,
      email: cliente.email,
      emailAcesso,
      tipoPessoa,
      razaoSocial: cliente.razao_social,
      nomeFantasia: cliente.nome_fantasia,
      documento: cliente.documento,
      telefone: cliente.telefone,
      rua: addr.rua,
      numero: addr.numero,
      complemento: addr.complemento,
      bairro: addr.bairro,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      contrato: contrato
        ? {
            plano: contrato.plano,
            inicio: contrato.data_inicio,
            vencimento: contrato.data_vencimento,
            status: contrato.status,
          }
        : null,
    });
  } catch (err) {
    console.error("[api/cadastro/protocolo] erro:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
