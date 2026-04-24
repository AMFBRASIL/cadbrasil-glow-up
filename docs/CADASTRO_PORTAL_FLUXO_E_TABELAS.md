# Cadastro do portal — fluxo, API e tabelas

Documento de referência para reimplementar o cadastro (nova tela, outro front ou integração) mantendo o mesmo contrato com o backend e o mesmo modelo de dados.

**Implementação de referência (código):**

- Frontend: `src/pages/Cadastro.tsx`, componentes em `src/components/cadastro/`, cliente HTTP em `src/lib/api.ts`
- Backend: `server/routes/cadastro.js` (`POST /cadastro`)
- Protocolo: `server/utils/protocolo.js` (`gerarProtocoloCadbrasil`)
- **Google Ads / UTM / conversões (detalhamento completo):** [GOOGLE_ADS_TRACKING_E_TABELAS.md](./GOOGLE_ADS_TRACKING_E_TABELAS.md)

---

## 1. Objetivo do fluxo

Registrar um **pré-cadastro** de cliente no portal: criar **usuário de acesso**, **cliente**, registro **SICAF** inicial, **nível SICAF**, **contato principal**, **contrato digital** automático e, quando possível, **sessão de tracking**. Após o commit, o servidor envia **e-mail de confirmação** (e notificação interna opcional).

Este endpoint **não** cria registros nas tabelas legado `tbl_smart_*` (pedido de credenciamento, boleto, PIX). Pagamento é outro fluxo (`/api/pagamento/*`).

---

## 2. Endpoint HTTP

| Item | Valor |
|------|--------|
| **Método** | `POST` |
| **Caminho** | `/api/cadastro` |
| **Base URL** | Valor de `VITE_API_URL` no front; em dev costuma ser `http://localhost:3001` |
| **Content-Type** | `application/json` |

---

## 3. Corpo da requisição (JSON)

Todos os campos abaixo refletem o que o backend lê de `req.body`. Nomes devem ser **exatamente** estes (camelCase), pois o Express usa o body como está.

### 3.1. Dados obrigatórios (validação 400 se faltar / inválido)

| Campo JSON | Tipo | Regra |
|------------|------|--------|
| `tipoPessoa` | string | `"cpf"` ou `"cnpj"` |
| `cnpj` | string | **CPF ou CNPJ** (nome histórico do campo). Aceita máscara; o servidor valida pelo comprimento só dígitos: 11 = CPF, 14 = CNPJ. Também usa `tipoPessoa` para `tipo_documento` em `clientes`. |
| `razaoSocial` | string | Não vazio após trim (para PF costuma ser o nome da pessoa no formulário atual). |
| `nomeResponsavel` | string | Não vazio. |
| `emailResponsavel` | string | Não vazio. |
| `emailAcesso` | string | Não vazio. Se omitido no payload, o servidor usa `emailResponsavel`. |
| `senha` | string | Mínimo **6** caracteres. |

### 3.2. Dados opcionais (endereço / empresa / licitação)

| Campo JSON | Backend | Observação |
|-------------|---------|------------|
| `nomeFantasia` | `null` se vazio | |
| `cnae` | Gravado em `clientes.ramo_atividade` | |
| `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `uf` | `bairro` é lido mas **não** persiste no `INSERT` de `clientes` atual | Endereço salvo: `logradouro`, `numero`, `complemento` concatenados com vírgula em `clientes.endereco`. |
| `cpfResponsavel` | Só dígitos em `clientes` / contato | |
| `cargoResponsavel`, `telefoneResponsavel` | Opcionais | |
| `tipoServico` | `"renovacao"` ou qualquer outro vira **`"novo"`** | |
| `segmentoAtuacao`, `objetivoLicitacao` | Entram no texto de `clientes.observacoes` | Não há colunas dedicadas de licitação neste POST. |
| `aceitaNotificacoes` | boolean | Se truthy, dispara e-mail de notificação adicional (equipe). |

### 3.3. Tracking / marketing (opcional)

Enviados pelo front atual via `getUtmForPayload()` junto com o cadastro:

| Campo | Uso |
|-------|-----|
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` | `tracking_sessoes` |
| `gclid`, `gbraid`, `gad_source`, `gad_campaignid` | Idem; `utm_campaign` no insert pode receber `utm_campaign` **ou** `gad_campaignid` |
| `landing_page`, `referrer` | Idem |
| Cabeçalho `User-Agent` | Gravado em `tracking_sessoes.user_agent` |

### 3.4. Exemplo mínimo de payload

```json
{
  "tipoPessoa": "cnpj",
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "Empresa Exemplo LTDA",
  "nomeFantasia": "Exemplo",
  "cnae": "6201-5/01",
  "cep": "01310-100",
  "logradouro": "Av. Paulista",
  "numero": "1000",
  "complemento": "Sala 1",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "uf": "SP",
  "nomeResponsavel": "Maria Silva",
  "cpfResponsavel": "123.456.789-00",
  "cargoResponsavel": "Sócia",
  "telefoneResponsavel": "(11) 99999-9999",
  "emailResponsavel": "maria@exemplo.com.br",
  "tipoServico": "novo",
  "segmentoAtuacao": "Serviços",
  "objetivoLicitacao": "ME",
  "emailAcesso": "acesso@exemplo.com.br",
  "senha": "senhaSegura",
  "aceitaNotificacoes": true
}
```

---

## 4. Respostas HTTP

### 4.1. Sucesso — `201 Created`

```json
{
  "success": true,
  "protocolo": "SICAF-XXXXXXXX-YYYY",
  "idUsuario": 123,
  "idCliente": 456,
  "idPedido": 789
}
```

**Importante:** `idPedido` na resposta é, na prática, o **`id` inserido em `contratos_digitais`** (variável `idContrato` no código). O nome é legado; não confundir com `tbl_smart_pedido_credenciamento`.

### 4.2. Erros

| Status | Condição | `error` (exemplo) |
|--------|----------|-------------------|
| **400** | Validação de entrada | Mensagens em português (tipo pessoa, documento, razão social, responsável, e-mails, senha). |
| **409** | CPF/CNPJ já existe em `clientes` | `Já existe cliente com este CPF/CNPJ.` |
| **409** | E-mail de acesso já existe em `usuarios` | `Já existe cadastro com este e-mail de acesso...` |
| **500** | Sem perfil `cliente` ativo em `perfis_acesso` | `Perfil de acesso do cliente não configurado na base nova.` |
| **500** | Outros erros de banco / não tratados | Mensagem genérica em produção; detalhe em desenvolvimento. |

Comparação de documento na base (só dígitos):

```sql
REPLACE(REPLACE(REPLACE(REPLACE(documento, '.', ''), '/', ''), '-', ''), ' ', '') = ?
```

E-mail de acesso: comparação exata `usuarios.email = ?`.

---

## 5. Transação: ordem das operações

Tudo abaixo ocorre após `BEGIN`, até `COMMIT`. Em qualquer falha antes do commit, há `ROLLBACK`.

1. **SELECT** duplicidade em `clientes` (documento normalizado).
2. **SELECT** duplicidade em `usuarios` (e-mail de acesso).
3. **SELECT** `perfis_acesso` → primeiro registro com `tipo = 'cliente'` e `ativo = 1`.
4. **INSERT** `usuarios`.
5. **INSERT** `clientes` (FK `usuario_id` → passo 4).
6. **INSERT** `sicaf_cadastros` (FK `cliente_id` → passo 5).
7. **INSERT** `sicaf_niveis` (FK `sicaf_id` → passo 6).
8. **INSERT** `cliente_contatos` (com fallback se a coluna `cpf` não existir — ver seção 7).
9. **INSERT** `contratos_digitais`.
10. **INSERT** `tracking_sessoes` — dentro de `try/catch`; falha **não** aborta transação (apenas log).
11. **COMMIT**.

**Depois do commit (fora da transação):**

- **SELECT** `templates_email` (template de boas-vindas).
- **SELECT** `configuracoes_sistema` (categorias `email` e `empresa`).
- Envio assíncrono: `enviarEmailCadastro`, e se `aceitaNotificacoes`, `enviarEmailNotificacao`.

---

## 6. Tabelas envolvidas

### 6.1. Somente leitura (pré-requisito / pós-cadastro)

| Tabela | Papel |
|--------|--------|
| **`clientes`** | Antes: verificar documento duplicado. |
| **`usuarios`** | Antes: verificar e-mail de acesso duplicado. |
| **`perfis_acesso`** | Obter `id` do perfil `tipo = 'cliente'` e `ativo = 1` (obrigatório para o INSERT em `usuarios`). |
| **`templates_email`** | Depois: primeiro registro `ativo = 1` e `nome LIKE 'Bem-vindo%'` (e-mail ao cliente). |
| **`configuracoes_sistema`** | Depois: chaves `categoria IN ('email','empresa')` para SMTP/dados da empresa. |

### 6.2. Escrita (núcleo do cadastro)

#### `usuarios`

| Coluna | Valor |
|--------|--------|
| `nome` | `nomeResponsavel` |
| `email` | `emailAcesso` |
| `senha_hash` | `bcrypt.hash(senha, 10)` |
| `telefone` | `telefoneResponsavel` ou `NULL` |
| `avatar_iniciais` | Iniciais derivadas do nome (2 letras) |
| `departamento` | Constante `'Portal Cliente'` |
| `perfil_id` | `perfis_acesso.id` do cliente |
| `status` | Constante `'Ativo'` |

#### `clientes`

| Coluna | Valor |
|--------|--------|
| `usuario_id` | `insertId` de `usuarios` |
| `tipo_documento` | `'CPF'` ou `'CNPJ'` (derivado de `tipoPessoa` / tamanho do documento) |
| `documento` | String **como enviada** (com máscara, se houver) |
| `razao_social` | `razaoSocial` |
| `nome_fantasia` | `nomeFantasia` ou `NULL` |
| `email` | `emailResponsavel` |
| `telefone`, `celular` | Ambos recebem `telefoneResponsavel` |
| `endereco` | `"logradouro, numero, complemento"` (partes vazias omitidas) ou `NULL` |
| `cidade`, `estado`, `cep` | Do payload (podem ser `NULL`) |
| `ramo_atividade` | `cnae` ou `NULL` |
| `responsavel_nome` | `nomeResponsavel` |
| `responsavel_cpf` | CPF só dígitos |
| `responsavel_email` | `emailResponsavel` |
| `responsavel_telefone` | `telefoneResponsavel` |
| `status` | Constante `'Pendente'` |
| `observacoes` | Texto concatenado: protocolo, `Origem: site`, tipo de serviço, `segmentoAtuacao \| objetivoLicitacao` |
| `ProtocoloCadbrasil` | Gerado no servidor (`SICAF-...`) |

**Não gravado neste fluxo:** `bairro` (existe no JSON mas não há coluna mapeada no INSERT atual).

#### `sicaf_cadastros`

| Coluna | Valor |
|--------|--------|
| `cliente_id` | `insertId` de `clientes` |
| `status` | `'Pendente'` |
| `completude` | `0.00` |
| `credenciamento_anual` | `0` |
| `manutencao_ativa` | `0` |
| `dias_validade` | `0` |
| `observacoes` | `'Cadastro inicial via site CADBRASIL'` |

#### `sicaf_niveis`

| Coluna | Valor |
|--------|--------|
| `sicaf_id` | `insertId` de `sicaf_cadastros` |
| `nivel` | `'I'` |
| `habilitado` | `0` |

#### `cliente_contatos`

**Tentativa 1** (schema com coluna `cpf`):

- `cliente_id`, `nome`, `cpf`, `cargo`, `email`, `telefone`, `principal = 1`

**Tentativa 2** (se MySQL `ER_BAD_FIELD_ERROR` na coluna `cpf`):

- `cliente_id`, `nome`, `cargo`, `email`, `telefone`, `principal = 1`

Só executa se `nomeResponsavel` estiver preenchido.

#### `contratos_digitais`

| Coluna | Valor |
|--------|--------|
| `cliente_id` | `insertId` de `clientes` |
| `plano` | Constante `'Licença + Manutenção'` |
| `data_inicio` | Data atual (UTC `YYYY-MM-DD` via `toISOString().slice(0,10)`) |
| `data_vencimento` | Mesmo dia, **+1 ano** |
| `status` | `'Assinado'` |
| `assinado_em` | `NOW()` |
| `assinado_por` | `nomeResponsavel` |
| `ip_assinatura` | `req.ip` ou `NULL` |
| `observacoes` | Texto com protocolo |

#### `tracking_sessoes` (opcional; falha isolada)

| Coluna | Valor |
|--------|--------|
| `session_id` | UUID v4 |
| `cliente_id`, `usuario_id` | IDs recém-criados |
| `utm_*`, `gclid`, `gbraid`, `gad_source` | Do body |
| `landing_page`, `referrer` | Do body |
| `user_agent` | Cabeçalho da requisição |
| `converted` | `1` |
| `conversion_type` | `'signup'` |
| `conversion_at`, `funnel_step`, `last_activity_at` | `NOW()` / `'signup'` |

Se o `INSERT` falhar (schema diferente, etc.), o cadastro principal **já foi** commitado desde que o erro seja apenas neste bloco — na prática o tracking está dentro do mesmo `try` da transação **antes** do commit; falha aqui cai no `catch` que só faz `console.warn`, não relança.

---

## 7. Formato do protocolo

Função `gerarProtocoloCadbrasil()`:

- Prefixo: `SICAF-`
- 8 caracteres aleatórios em `[A-Z0-9]`
- Hífen
- 4 dígitos aleatórios `0-9`

Exemplo: `SICAF-A1B2C3D4-5678`

---

## 8. Endpoint auxiliar (CNPJ) — não grava cadastro

Para **preencher** formulário de PJ:

- **`GET /api/cnpj/:cnpj`** — apenas dígitos no parâmetro; pode responder dados da base local `clientes` ou da API externa CNPJ.ws (token em env).

Não substitui o `POST /cadastro`.

---

## 9. Endpoint auxiliar (renovação) — não grava cadastro

- **`POST /api/renovacao/verificar`** — corpo: `{ "documento": "...", "tipoPessoa": "cpf"|"cnpj" }`  
  Indica se já existe cliente com aquele documento (fluxo “renovar” / login).

---

## 10. Checklist para nova tela

1. Coletar os campos da seção 3 (mínimos + opcionais desejados).
2. Manter nomes JSON compatíveis com o backend **ou** adaptar o `cadastro.js` (fora do escopo deste doc).
3. Para PJ, opcionalmente chamar `GET /api/cnpj/:cnpj` antes do submit.
4. Enviar `POST /api/cadastro` com JSON; tratar **409** (documento ou e-mail) com mensagem clara ao usuário.
5. Em **201**, guardar `protocolo`, `idUsuario`, `idCliente` e, se necessário, `idPedido` como **id do contrato digital**.
6. Garantir que exista perfil **`perfis_acesso.tipo = 'cliente'`** ativo no banco antes de ir a produção.
7. Se a nova tela precisar de **bairro** ou colunas extras, será necessário **alterar o INSERT** em `server/routes/cadastro.js` e o schema de `clientes` (ou outra tabela).

---

## 11. Referência rápida — lista de tabelas

| Tabela | Cadastro `POST /api/cadastro` |
|--------|-------------------------------|
| `perfis_acesso` | Leitura |
| `clientes` | Leitura (dup.) + Insert |
| `usuarios` | Leitura (dup.) + Insert |
| `sicaf_cadastros` | Insert |
| `sicaf_niveis` | Insert |
| `cliente_contatos` | Insert |
| `contratos_digitais` | Insert |
| `tracking_sessoes` | Insert (não bloqueante) — ver [GOOGLE_ADS_TRACKING_E_TABELAS.md](./GOOGLE_ADS_TRACKING_E_TABELAS.md) |
| `templates_email` | Leitura (pós-commit) |
| `configuracoes_sistema` | Leitura (pós-commit) |

**Fora deste fluxo de cadastro:** `tbl_smart_pedido_credenciamento`, `tbl_smart_clientes`, `tbl_smart_boleto`, etc.  
Essas tabelas entram no **tracking offline do Google Ads** apenas no fluxo de **pagamento confirmado**; ver [GOOGLE_ADS_TRACKING_E_TABELAS.md](./GOOGLE_ADS_TRACKING_E_TABELAS.md) seção 7.

---

## 12. Google Ads e UTMs (resumo)

1. O front grava UTMs/gclid em **sessionStorage/localStorage** (`src/lib/utm.ts`) e envia no **JSON do cadastro**.
2. O backend insere uma linha em **`tracking_sessoes`** com `conversion_type = signup` (quando o INSERT não falha).
3. **Conversão no navegador** após cadastro: `trackConversion('cadastro_concluido', 985, …)` → gtag / GTM / UET.
4. **Upload de conversão na API Google** no cadastro novo: **não** há chamada; o upload offline está no **`POST /api/pagamento/verificar`** usando dados de **`tbl_smart_clientes`**.

Detalhes, DDL completo de `tracking_sessoes`, colunas não usadas e variáveis `.env`: [GOOGLE_ADS_TRACKING_E_TABELAS.md](./GOOGLE_ADS_TRACKING_E_TABELAS.md).

---

*Documento gerado a partir do código em `server/routes/cadastro.js` e `src/pages/Cadastro.tsx` / `src/lib/api.ts`. Em caso de divergência, prevalece o código-fonte.*
