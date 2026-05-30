import type { SeoGuideConfig } from "./types";

const relatedAll = (current: string) =>
  [
    {
      href: "/regularizar-sicaf-empresa",
      label: "Como regularizar o SICAF",
      description: "Pendências, suspensão e retorno à situação regular.",
    },
    {
      href: "/cadastro-sicaf-licitacao-publica",
      label: "Cadastro SICAF para licitação",
      description: "Credenciamento para vender ao governo federal.",
    },
    {
      href: "/documentos-necessarios-cadastro-sicaf",
      label: "Documentos para o SICAF",
      description: "Checklist completo por categoria de habilitação.",
    },
    {
      href: "/atualizar-certificados-sicaf",
      label: "Atualizar certificados no SICAF",
      description: "Renovação de certidões e níveis de cadastro.",
    },
  ].filter((g) => g.href !== `/${current}`);

export const regularizarSicafGuide: SeoGuideConfig = {
  slug: "regularizar-sicaf-empresa",
  badge: "Regularização SICAF",
  h1: "Como regularizar o SICAF da empresa",
  intro:
    "Empresa com SICAF irregular, suspenso ou com pendências não consegue participar de licitações públicas federais. Este guia explica as causas mais comuns, o que fazer para voltar à situação regular e como a CADBRASIL conduz o processo com suporte especializado e Assistente SICAF.",
  metaTitle: "Como regularizar o SICAF da empresa — Guia completo 2026",
  metaDescription:
    "Aprenda como regularizar o SICAF da sua empresa: identifique pendências, renove certidões, atualize níveis de cadastro e volte a licitar com apoio da CADBRASIL.",
  ogTitle: "Como regularizar o SICAF da empresa",
  ogDescription:
    "Passo a passo para sair de pendências e suspensão no SICAF e retomar licitações públicas com assessoria CADBRASIL.",
  keywords: [
    "regularizar SICAF",
    "SICAF irregular",
    "SICAF suspenso",
    "pendências SICAF",
    "como regularizar SICAF empresa",
    "situação cadastral SICAF",
    "fornecedor SICAF",
    "CADBRASIL",
    "licitação pública",
    "credenciamento SICAF",
  ],
  schemaType: "HowTo",
  totalTime: "PT2H",
  steps: [
    {
      name: "Identificar a situação no SICAF",
      text: "Acesse o portal do fornecedor e consulte a Situação do Fornecedor para ver níveis, pendências e certidões vencidas.",
    },
    {
      name: "Mapear certidões e documentos vencidos",
      text: "Liste CNDs, CRF FGTS, CNDT, certidões estaduais/municipais e demais exigências com data de validade expirada.",
    },
    {
      name: "Emitir novas certidões",
      text: "Solicite certidões atualizadas nos órgãos competentes (Receita, SEFAZ, Prefeitura, Caixa, TST etc.).",
    },
    {
      name: "Enviar documentação no SICAF",
      text: "Anexe os arquivos nos níveis corretos do cadastro e aguarde a validação pelo sistema Compras.gov.br.",
    },
    {
      name: "Atualizar níveis e confirmar regularidade",
      text: "Após o processamento, confira se todos os níveis estão verdes e a situação cadastral voltou ao normal.",
    },
  ],
  sections: [
    {
      icon: "alert",
      title: "Sinais de que o SICAF precisa ser regularizado",
      subtitle: "Identifique rapidamente se sua empresa está impedida de licitar.",
      items: [
        "Situação cadastral diferente de regular ou habilitado.",
        "Níveis de cadastro com pendência (vermelho ou amarelo).",
        "Certidões vencidas ou rejeitadas pelo sistema.",
        "Empresa suspensa ou impedida de receber empenho.",
        "Participação negada em pregões por falta de habilitação no SICAF.",
      ],
    },
    {
      icon: "refresh",
      title: "Principais causas de irregularidade",
      items: [
        "Certidão negativa de débitos (CND) vencida ou com restrição.",
        "CRF do FGTS ou CNDT desatualizados.",
        "Certidões estadual e municipal fora da validade.",
        "Dados cadastrais desatualizados (endereço, sócios, CNAE).",
        "Documentos societários não enviados ou recusados.",
      ],
    },
    {
      icon: "shield",
      title: "Como a CADBRASIL ajuda na regularização",
      items: [
        "Diagnóstico da situação cadastral e lista de pendências.",
        "Orientação sobre quais certidões emitir e onde.",
        "Assistente CADBRASIL no Chrome para guiar o preenchimento no SICAF.",
        "Suporte humano especializado em licitações e Compras.gov.br.",
        "Acompanhamento até a empresa voltar à condição de licitar.",
      ],
    },
  ],
  faqs: [
    {
      question: "O que significa SICAF irregular?",
      answer:
        "Significa que a empresa possui pendências no cadastro de fornecedores do governo federal — certidões vencidas, documentos faltantes ou níveis não validados — o que impede ou limita a participação em licitações no Compras.gov.br.",
    },
    {
      question: "Quanto tempo leva para regularizar o SICAF?",
      answer:
        "Depende do número de pendências e da velocidade de emissão das certidões. Com documentação organizada, muitas empresas regularizam em poucos dias. A CADBRASIL acelera o processo com checklist e Assistente SICAF.",
    },
    {
      question: "Posso licitar com SICAF suspenso?",
      answer:
        "Não. Com SICAF suspenso ou irregular, a empresa não está habilitada para contratar com o governo federal até resolver todas as pendências cadastrais.",
    },
    {
      question: "Preciso refazer todo o cadastro para regularizar?",
      answer:
        "Na maioria dos casos, não. Basta atualizar certidões e documentos pendentes nos níveis existentes. Se o cadastro foi cancelado, pode ser necessário um novo credenciamento — a CADBRASIL orienta em cada caso.",
    },
  ],
  relatedGuides: relatedAll("regularizar-sicaf-empresa"),
  ctaTitle: "Regularize seu SICAF com a CADBRASIL",
  ctaDescription:
    "Cadastre sua empresa, receba diagnóstico das pendências e conte com especialistas + Assistente SICAF para voltar a licitar.",
  flowTitle: "Fluxo de regularização",
  flowSteps: ["Diagnóstico", "Certidões", "Envio no SICAF", "Situação regular"],
};

export const cadastroLicitacaoGuide: SeoGuideConfig = {
  slug: "cadastro-sicaf-licitacao-publica",
  badge: "Cadastro para licitação",
  h1: "Cadastro SICAF para licitação pública",
  intro:
    "Para vender produtos ou serviços ao Governo Federal por meio de licitações, pregões e dispensa eletrônica, sua empresa precisa estar credenciada no SICAF (Sistema de Cadastramento Unificado de Fornecedores). Veja o passo a passo completo e como iniciar com a CADBRASIL.",
  metaTitle: "Cadastro SICAF para licitação pública — Passo a passo 2026",
  metaDescription:
    "Guia completo de cadastro SICAF para licitação pública: credenciamento, pagamento, documentos, Compras.gov.br e assessoria CADBRASIL para fornecedores do governo.",
  ogTitle: "Cadastro SICAF para licitação pública",
  ogDescription:
    "Como se cadastrar no SICAF e habilitar sua empresa para licitar no governo federal com suporte CADBRASIL.",
  keywords: [
    "cadastro SICAF",
    "SICAF licitação pública",
    "credenciamento SICAF",
    "como se cadastrar no SICAF",
    "fornecedor governo federal",
    "Compras.gov.br",
    "pregão eletrônico",
    "habilitação licitação",
    "CADBRASIL",
    "vender para o governo",
  ],
  schemaType: "HowTo",
  totalTime: "PT1H",
  steps: [
    {
      name: "Cadastrar-se na CADBRASIL",
      text: "Acesse cadastro.cadbrasil.com.br, informe CNPJ e dados da empresa e crie seu acesso ao portal do fornecedor.",
    },
    {
      name: "Acessar o portal e pagar a licença",
      text: "Entre no portal do fornecedor CADBRASIL, quite a taxa de credenciamento via boleto ou PIX.",
    },
    {
      name: "Enviar documentos de habilitação",
      text: "Anexe contrato social, certidões, balanço e demais documentos exigidos nos níveis do SICAF.",
    },
    {
      name: "Instalar o Assistente CADBRASIL",
      text: "Extensão Chrome que guia o preenchimento no SICAF e reduz erros no credenciamento.",
    },
    {
      name: "Concluir níveis e participar de licitações",
      text: "Com cadastro regular, acesse o Compras.gov.br e participe de pregões e outras modalidades.",
    },
  ],
  sections: [
    {
      icon: "landmark",
      title: "O que é o SICAF e por que é obrigatório",
      items: [
        "SICAF é o cadastro unificado de fornecedores do Poder Executivo Federal.",
        "Sem SICAF regular, a empresa não contrata com órgãos federais.",
        "Substitui credenciamentos isolados por um único cadastro nacional.",
        "Integrado ao Compras.gov.br, portal de licitações do governo.",
        "Exige documentação de habilitação jurídica, fiscal, trabalhista e financeira.",
      ],
    },
    {
      icon: "clipboard",
      title: "Requisitos para o cadastro SICAF",
      items: [
        "CNPJ ativo e regular na Receita Federal.",
        "Representante legal com poderes para assinar pelo CNPJ.",
        "Certidões negativas e comprovantes de regularidade atualizados.",
        "Documentação societária (contrato social ou equivalente).",
        "Pagamento da taxa de credenciamento conforme tabela vigente.",
      ],
    },
    {
      icon: "sparkles",
      title: "Vantagens de cadastrar com a CADBRASIL",
      items: [
        "Processo guiado do cadastro inicial ao credenciamento SICAF.",
        "Assistente com IA integrado ao Compras.gov.br.",
        "Suporte consultivo de especialistas em licitações.",
        "Portal único para pagamento, documentos e acompanhamento.",
        "Mais de 15 anos de experiência com fornecedores do governo.",
      ],
    },
  ],
  faqs: [
    {
      question: "Quem precisa de cadastro SICAF?",
      answer:
        "Toda empresa (ou profissional, no caso de MEI/PF quando aplicável) que deseja fornecer bens ou serviços ao Governo Federal por licitação, pregão, dispensa ou inexigibilidade precisa estar credenciada no SICAF.",
    },
    {
      question: "Cadastro SICAF é gratuito?",
      answer:
        "O cadastro no sistema público Compras.gov.br não tem taxa direta ao governo, mas o processo de assessoria e credenciamento pela CADBRASIL inclui taxa de licença e suporte especializado — consulte valores no cadastro.",
    },
    {
      question: "MEI pode se cadastrar no SICAF?",
      answer:
        "Sim, microempreendedores individuais podem se credenciar no SICAF desde que atendam aos requisitos de documentação e habilitação exigidos para o objeto licitado.",
    },
    {
      question: "Quanto tempo demora o credenciamento?",
      answer:
        "Com documentos em mãos e assessoria CADBRASIL, o credenciamento pode ser concluído em dias. O prazo depende da emissão de certidões e da validação pelo sistema.",
    },
  ],
  relatedGuides: relatedAll("cadastro-sicaf-licitacao-publica"),
  ctaTitle: "Inicie seu cadastro SICAF agora",
  ctaDescription:
    "Cadastre sua empresa na CADBRASIL e comece o credenciamento para licitar no governo federal com suporte completo.",
  flowTitle: "Jornada de credenciamento",
  flowSteps: ["Cadastro CADBRASIL", "Pagamento", "Documentos", "SICAF ativo"],
};

export const documentosCadastroGuide: SeoGuideConfig = {
  slug: "documentos-necessarios-cadastro-sicaf",
  badge: "Documentação SICAF",
  h1: "Documentos necessários para cadastro no SICAF",
  intro:
    "A habilitação no SICAF exige documentos organizados por categoria: credenciamento, jurídico-fiscal, trabalhista e qualificação econômico-financeira. Use este checklist atualizado para evitar rejeições e acelerar seu credenciamento com a CADBRASIL.",
  metaTitle: "Documentos necessários para cadastro no SICAF — Checklist 2026",
  metaDescription:
    "Lista completa de documentos para cadastro no SICAF: credenciamento, certidões fiscais, FGTS, CNDT, balanço patrimonial e mais. Organize tudo com a CADBRASIL.",
  ogTitle: "Documentos necessários para cadastro no SICAF",
  ogDescription:
    "Checklist por categoria de habilitação no SICAF para licitações públicas federais.",
  keywords: [
    "documentos SICAF",
    "documentos cadastro SICAF",
    "certidões SICAF",
    "habilitação SICAF",
    "checklist SICAF",
    "CND SICAF",
    "FGTS SICAF",
    "balanço SICAF",
    "documentos licitação",
    "CADBRASIL",
  ],
  schemaType: "Article",
  sections: [
    {
      icon: "file",
      title: "1. Documentos de credenciamento",
      subtitle: "Identificação da empresa e do representante legal.",
      items: [
        "Contrato social ou estatuto social (e alterações contratuais).",
        "Documento de identificação do representante legal (RG ou CNH).",
        "CPF do representante legal.",
        "Comprovante de endereço da sede da empresa.",
        "Procuração, se o cadastro for feito por procurador.",
      ],
    },
    {
      icon: "landmark",
      title: "2. Habilitação jurídica e fiscal",
      subtitle: "Regularidade perante Receita, estados e municípios.",
      items: [
        "Comprovante de inscrição e situação cadastral do CNPJ.",
        "Certidão conjunta Receita Federal e PGFN (CND/CPEND).",
        "Certidão de regularidade fiscal estadual (SEFAZ/ICMS).",
        "Certidão de regularidade fiscal municipal (ISS/tributos).",
        "Certidão simplificada da Junta Comercial, quando exigida.",
      ],
    },
    {
      icon: "check",
      title: "3. Regularidade trabalhista e previdenciária",
      items: [
        "Certificado de Regularidade do FGTS (CRF).",
        "Certidão Negativa de Débitos Trabalhistas (CNDT).",
        "Comprovante de regularidade previdenciária (INSS), se solicitado.",
        "Declarações trabalhistas exigidas em editais específicos.",
      ],
    },
    {
      icon: "scale",
      title: "4. Qualificação econômico-financeira",
      items: [
        "Balanço patrimonial do último exercício social.",
        "Demonstrações contábeis (DRE e notas explicativas, se houver).",
        "Termo de abertura e encerramento do livro contábil.",
        "Certidão negativa de falência ou recuperação judicial.",
        "Índices de liquidez exigidos em editais de maior porte.",
      ],
    },
    {
      icon: "users",
      title: "5. Documentos complementares (conforme ramo)",
      items: [
        "Registro profissional em conselho de classe (CREA, CRM, CRC etc.).",
        "Alvará de funcionamento ou licença sanitária, quando aplicável.",
        "Certificações ISO ou técnicas exigidas pelo objeto licitado.",
        "Atestados de capacidade técnica de contratos anteriores.",
      ],
    },
  ],
  faqs: [
    {
      question: "Todos os documentos precisam estar dentro da validade?",
      answer:
        "Sim. Certidões negativas e comprovantes de regularidade têm prazo de validade definido por lei ou pelo edital. Documentos vencidos geram pendência no SICAF e impedem a habilitação.",
    },
    {
      question: "Posso enviar PDF escaneado?",
      answer:
        "Sim, o SICAF aceita arquivos digitais em PDF. Certifique-se de que estão legíveis, completos e correspondem ao documento exigido em cada nível de cadastro.",
    },
    {
      question: "MEI precisa de balanço patrimonial?",
      answer:
        "MEIs seguem regras simplificadas, mas podem precisar de declarações financeiras conforme o valor e o objeto da licitação. A CADBRASIL orienta caso a caso.",
    },
    {
      question: "Onde envio os documentos?",
      answer:
        "No portal Compras.gov.br / SICAF, nos níveis de habilitação correspondentes. Com a CADBRASIL, você também envia pelo portal do fornecedor com orientação do Assistente SICAF.",
    },
  ],
  relatedGuides: relatedAll("documentos-necessarios-cadastro-sicaf"),
  ctaTitle: "Organize seus documentos com a CADBRASIL",
  ctaDescription:
    "Cadastre-se, receba o checklist personalizado e envie a documentação com suporte especializado no SICAF.",
  flowTitle: "Organização recomendada",
  flowSteps: ["Separar por categoria", "Validar validade", "Digitalizar PDF", "Enviar no SICAF"],
};

export const atualizarCertificadosGuide: SeoGuideConfig = {
  slug: "atualizar-certificados-sicaf",
  badge: "Certificados e certidões",
  h1: "Como atualizar certificados no SICAF",
  intro:
    "Certidões e certificados vencem periodicamente. Manter o SICAF atualizado é essencial para não perder licitações. Aprenda quando renovar, onde emitir cada documento e como usar o Assistente CADBRASIL para atualizar os níveis de cadastro sem erro.",
  metaTitle: "Como atualizar certificados no SICAF — Guia prático 2026",
  metaDescription:
    "Saiba como atualizar certidões e certificados no SICAF: CND, FGTS, CNDT, certidões estaduais e municipais. Passo a passo com CADBRASIL e Assistente SICAF.",
  ogTitle: "Como atualizar certificados no SICAF",
  ogDescription:
    "Renove certidões e mantenha níveis de cadastro verdes no SICAF para continuar licitando.",
  keywords: [
    "atualizar certificados SICAF",
    "renovar certidões SICAF",
    "certidões vencidas SICAF",
    "atualizar SICAF",
    "níveis cadastro SICAF",
    "CND SICAF renovação",
    "situação fornecedor SICAF",
    "Assistente CADBRASIL",
    "Compras.gov.br",
    "CADBRASIL",
  ],
  schemaType: "HowTo",
  totalTime: "PT1H30M",
  steps: [
    {
      name: "Consultar validade das certidões",
      text: "No SICAF ou portal CADBRASIL, verifique quais certidões estão próximas do vencimento ou já expiraram.",
    },
    {
      name: "Emitir novas certidões nos órgãos",
      text: "Acesse Receita Federal, SEFAZ, Prefeitura, Caixa (FGTS), TST (CNDT) e demais emissores para obter versões atualizadas.",
    },
    {
      name: "Substituir arquivos no SICAF",
      text: "No nível correspondente, remova ou substitua o documento vencido pelo PDF da nova certidão.",
    },
    {
      name: "Enviar Situação do Fornecedor",
      text: "Gere o PDF da Situação do Fornecedor atualizada e envie conforme orientação do Assistente CADBRASIL.",
    },
    {
      name: "Confirmar níveis verdes",
      text: "Aguarde processamento e confirme que todos os níveis de habilitação estão regulares.",
    },
  ],
  sections: [
    {
      icon: "refresh",
      title: "Certidões que mais vencem no SICAF",
      items: [
        "CND conjunta Receita Federal e Dívida Ativa da União (180 dias).",
        "CRF — Certificado de Regularidade do FGTS.",
        "CNDT — Certidão Negativa de Débitos Trabalhistas.",
        "Certidão de regularidade fiscal estadual (SEFAZ).",
        "Certidão de regularidade municipal (ISS).",
      ],
    },
    {
      icon: "clipboard",
      title: "Onde emitir cada certificado",
      items: [
        "CND Federal: site da Receita Federal / Regularize.",
        "FGTS: portal da Caixa Econômica Federal.",
        "CNDT: site do TST (Certidão Negativa de Débitos Trabalhistas).",
        "Estadual: portal SEFAZ do estado de inscrição.",
        "Municipal: site da Prefeitura ou portal de tributos municipais.",
      ],
    },
    {
      icon: "sparkles",
      title: "Assistente CADBRASIL na atualização",
      items: [
        "Extensão Chrome que acompanha o preenchimento no SICAF.",
        "Indica qual nível atualizar e qual documento enviar.",
        "Chat com IA para dúvidas sobre certidões e prazos.",
        "Guia para envio do PDF da Situação do Fornecedor.",
        "Suporte humano CADBRASIL quando precisar de ajuda extra.",
      ],
    },
  ],
  faqs: [
    {
      question: "Com que frequência devo atualizar certidões no SICAF?",
      answer:
        "Recomenda-se monitorar mensalmente. Certidões federais costumam valer 180 dias; outras têm prazos próprios. A CADBRASIL alerta clientes sobre vencimentos próximos.",
    },
    {
      question: "O que acontece se uma certidão vencer?",
      answer:
        "O nível de habilitação correspondente fica pendente, a situação cadastral pode ficar irregular e a empresa fica impedida de licitar até renovar o documento.",
    },
    {
      question: "Preciso atualizar todo o cadastro?",
      answer:
        "Não. Apenas substitua os documentos vencidos nos níveis afetados. O restante do cadastro permanece válido.",
    },
    {
      question: "Como instalar o Assistente CADBRASIL?",
      answer:
        "Após cadastrar-se na CADBRASIL, acesse o guia de instalação em instalador-assistente-cadbrasil no site ou pelo portal do fornecedor e adicione a extensão no Chrome.",
    },
  ],
  relatedGuides: relatedAll("atualizar-certificados-sicaf"),
  ctaTitle: "Mantenha seu SICAF sempre em dia",
  ctaDescription:
    "Cadastre-se na CADBRASIL e conte com Assistente SICAF + suporte para renovar certidões sem perder licitações.",
  flowTitle: "Ciclo de atualização",
  flowSteps: ["Monitorar validade", "Emitir certidões", "Substituir no SICAF", "Confirmar níveis"],
};

export const SEO_GUIDES = {
  "regularizar-sicaf-empresa": regularizarSicafGuide,
  "cadastro-sicaf-licitacao-publica": cadastroLicitacaoGuide,
  "documentos-necessarios-cadastro-sicaf": documentosCadastroGuide,
  "atualizar-certificados-sicaf": atualizarCertificadosGuide,
} as const;

export type SeoGuideSlug = keyof typeof SEO_GUIDES;
