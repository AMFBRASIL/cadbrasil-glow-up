# Troubleshooting - Pagamentos PIX e Boleto em Produção

## ⚠️ “Funciona local, não em produção”

1. **Faça o deploy do código mais recente.** Se ainda aparece *“Erro ao gerar boleto. Verifique credenciais e certificado Gerencianet.”*, a API em produção está com versão antiga. O código atual retorna a **mensagem real** do erro.
2. **Teste o diagnóstico em produção:**  
   `curl https://cadbrasil.com.br/api/pagamento/diagnostico-boleto`  
   A resposta traz `ok`, `error`, `config` (credenciais, certificado, sandbox) e ajuda a ver a causa do erro.
3. Confira **`.env`**, **certificado** e **porta** em produção (veja checklist abaixo).

---

## Checklist de Verificação

### 1. Variáveis de Ambiente no Servidor

Verifique se o arquivo `server/.env` em produção tem:

```env
NODE_ENV=production
PORT_PROD=3013

# Gerencianet - PRODUÇÃO
GERENCIANET_SANDBOX=false
GERENCIANET_CLIENT_ID=Client_Id_181699a2e3ebb57747ba0ff5d4a7ea899f7fdd4f
GERENCIANET_CLIENT_SECRET=Client_Secret_f4d3846a9b217f4c375bce0df93d88c48b18f149
GERENCIANET_CERTIFICATE_PATH=certificados/producao-790387-LicitacoesCadbrasil.p12
GERENCIANET_PIX_KEY=pix@cadbrasil.com.br
```

**⚠️ IMPORTANTE:** 
- `GERENCIANET_SANDBOX=false` (produção)
- Certificado deve ser o de **PRODUÇÃO** (não homologação)
- Credenciais devem ser de **PRODUÇÃO** (não sandbox)

---

### 2. Certificado .p12 no Servidor

O certificado deve estar em:
```
/www/wwwroot/cadbrasil/server/certificados/producao-790387-LicitacoesCadbrasil.p12
```

**Verificar:**
```bash
# No servidor de produção
ls -lh /www/wwwroot/cadbrasil/server/certificados/
# Deve mostrar o arquivo .p12 com tamanho > 200 bytes
```

**Se não existir:**
1. Baixe o certificado do painel Gerencianet (Produção → API → Certificado)
2. Faça upload para: `/www/wwwroot/cadbrasil/server/certificados/`
3. Verifique permissões: `chmod 644 certificados/*.p12`

---

### 3. Backend Rodando na Porta Correta

Verifique se o backend está rodando na porta 3013:

```bash
# Verificar processo Node.js
ps aux | grep node

# Verificar porta 3013
netstat -tulpn | grep 3013
# ou
lsof -i :3013
```

**Se não estiver rodando:**
```bash
cd /www/wwwroot/cadbrasil/server
NODE_ENV=production node index.js
# ou com PM2:
pm2 start index.js --name cadbrasil-api --env production
```

---

### 4. Logs do Backend

Verifique os logs para identificar o erro:

```bash
# Se usando PM2
pm2 logs cadbrasil-api

# Se rodando diretamente, verifique o terminal
# Procure por mensagens:
# - [Gerencianet] Certificado carregado: ...
# - [Gerencianet] Erro ao gerar PIX: ...
# - [Gerencianet] Erro ao gerar boleto: ...
```

**Erros comuns:**

1. **Certificado não encontrado:**
   ```
   [Gerencianet] Certificado não encontrado: /caminho/errado
   ```
   → Verifique o caminho no `.env` e se o arquivo existe

2. **Forbidden (403):**
   ```
   Error: Forbidden
   ```
   → Certificado/credenciais errados ou `SANDBOX=true` com certificado de produção

3. **Not Found (404) - PIX:**
   ```
   invalid_request: Not Found
   ```
   → Chave PIX não cadastrada ou escopo `cob.write` ausente

---

### 5. Endpoint de Diagnóstico

Teste o diagnóstico da Gerencianet:

```bash
# OAuth (autenticação)
curl https://cadbrasil.com.br/api/gerencianet/diagnostico

# OAuth + Cobrança PIX (teste completo)
curl https://cadbrasil.com.br/api/gerencianet/diagnostico-cob

# Boleto (teste createOneStepCharge com cobrança mínima)
curl https://cadbrasil.com.br/api/pagamento/diagnostico-boleto
```

**Resposta esperada – boleto (sucesso):**
```json
{
  "ok": true,
  "boletoStatus": 201,
  "charge_id": 123456,
  "message": "Boleto OK. createOneStepCharge respondeu com sucesso.",
  "config": { "hasClientId": true, "hasClientSecret": true, "hasCert": true, "sandbox": false }
}
```

**Se retornar erro:**
- `oauthOk: false` (PIX) → Problema de autenticação (certificado/credenciais)
- `cobStatus: 404` (PIX) → Chave PIX não cadastrada ou escopo ausente
- `error` em diagnostico-boleto → Mensagem real da Gerencianet (ex.: validation_error, invalid_request). Use para corrigir config ou payload.

### Erro "Não é possível emitir mais de três cobranças idênticas"

A Efí/Gerencianet rejeita mais de 3 cobranças **idênticas** (mesmo valor, itens, cliente, etc.).

**O que foi feito:**
1. **Idempotência do boleto:** o backend guarda `charge_id` e link em `tbl_smart_boleto`. Se já existir boleto para o mesmo `IdPedido` + valor, devolve o existente em vez de criar outro.
2. **Diagnóstico:** o `/api/pagamento/diagnostico-boleto` passa a usar cobrança única a cada execução (timestamp, valor variável), para não esbarrar no limite ao debugar.

**Obrigatório:** criar a tabela `tbl_smart_boleto` rodando a migração:
```bash
mysql -h HOST -u USER -p DATABASE < server/migrations/001_tbl_smart_boleto.sql
```
Ver `server/migrations/README.md`.

---

### 6. Frontend - URL da API

Verifique se o frontend está usando a URL correta:

**Arquivo:** `.env.production`
```env
VITE_API_URL=https://cadbrasil.com.br
```

**Após build:**
```bash
npm run build
# Verifique se dist/index.html contém a URL correta
grep -r "cadbrasil.com.br" dist/
```

---

### 7. Nginx - Proxy da API

Verifique se o Nginx está fazendo proxy correto para `/api/`:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3013;
    # ... resto da config
}
```

**Teste:**
```bash
curl https://cadbrasil.com.br/api/health
# Deve retornar: {"ok":true,"database":"connected",...}
```

---

### 8. CORS

Verifique se o CORS permite a origem de produção:

**Arquivo:** `server/.env`
```env
CORS_ORIGINS=https://cadbrasil.com.br,https://www.cadbrasil.com.br
```

**Se necessário, adicione:**
```env
CORS_ORIGINS=https://cadbrasil.com.br,https://www.cadbrasil.com.br,http://localhost:8080,http://localhost:5173
```

---

## Solução Rápida - Passo a Passo

1. **Verificar certificado:**
   ```bash
   ls -lh /www/wwwroot/cadbrasil/server/certificados/*.p12
   ```

2. **Verificar .env:**
   ```bash
   cat /www/wwwroot/cadbrasil/server/.env | grep GERENCIANET
   ```

3. **Reiniciar backend:**
   ```bash
   pm2 restart cadbrasil-api
   # ou
   cd /www/wwwroot/cadbrasil/server && NODE_ENV=production node index.js
   ```

4. **Testar diagnóstico:**
   ```bash
   curl https://cadbrasil.com.br/api/gerencianet/diagnostico-cob
   ```

5. **Verificar logs:**
   ```bash
   pm2 logs cadbrasil-api --lines 50
   ```

---

## Erros Específicos

### Erro: "Certificado não encontrado"
- **Causa:** Arquivo .p12 não está no servidor ou caminho errado
- **Solução:** Verifique item 2 acima

### Erro: "Forbidden" (403)
- **Causa:** Certificado/credenciais incorretos ou SANDBOX=true com certificado de produção
- **Solução:** Verifique `GERENCIANET_SANDBOX=false` e credenciais de produção

### Erro: "Not Found" (404) ao gerar PIX
- **Causa:** Chave PIX não cadastrada na Gerencianet ou escopo ausente
- **Solução:** 
  1. Verifique se `pix@cadbrasil.com.br` está cadastrada no painel Gerencianet (Produção)
  2. Verifique se a aplicação tem escopo `cob.write` ativo

### Erro: "Cannot GET /api/pagamento/gerar-pix"
- **Causa:** Backend não está rodando ou Nginx não está fazendo proxy
- **Solução:** Verifique itens 3 e 7 acima

---

## Contato para Suporte

Se o problema persistir, forneça:
1. Logs do backend (`pm2 logs cadbrasil-api`)
2. Resposta do diagnóstico (`/api/gerencianet/diagnostico-cob`)
3. Configuração do `.env` (sem mostrar senhas completas)
4. Saída de `ls -lh certificados/`
