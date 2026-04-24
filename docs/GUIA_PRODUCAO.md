# 🚀 Guia Completo para Deploy em Produção - CADBRASIL

## 📋 Checklist de Mudanças Obrigatórias

### 1. **Frontend - Arquivo `.env` (Raiz do Projeto)**

**ATUAL (DEV):**
```env
VITE_API_URL=http://localhost:3001
```

**MUDAR PARA (PROD):**
```env
VITE_API_URL=https://cadbrasil.com.br
```

⚠️ **IMPORTANTE:** Use o domínio real do seu site em produção. O Nginx fará o proxy de `/api` para o backend.

---

### 2. **Backend - Arquivo `server/.env`**

**MUDANÇAS NECESSÁRIAS:**

#### a) **Porta do Servidor**
```env
# ANTES (DEV):
PORT=3001

# DEPOIS (PROD):
PORT=3012
```

#### b) **Ambiente Node.js**
```env
# ANTES (DEV):
NODE_ENV=development

# DEPOIS (PROD):
NODE_ENV=production
```

#### c) **CORS - Origens Permitidas**
```env
# ANTES (DEV):
CORS_ORIGINS=https://cadbrasil.com.br,https://www.cadbrasil.com.br,http://localhost:8080,http://localhost:5173

# DEPOIS (PROD) - Remover localhost, manter apenas domínios de produção:
CORS_ORIGINS=https://cadbrasil.com.br,https://www.cadbrasil.com.br
```

#### d) **Gerencianet - Já está correto! ✅**
```env
# JÁ ESTÁ CORRETO (PRODUÇÃO):
GERENCIANET_SANDBOX=false
GERENCIANET_CLIENT_ID=Client_Id_181699a2e3ebb57747ba0ff5d4a7ea899f7fdd4f
GERENCIANET_CLIENT_SECRET=Client_Secret_f4d3846a9b217f4c375bce0df93d88c48b18f149
GERENCIANET_CERTIFICATE_PATH=certificados/producao-790387-LicitacoesCadbrasil.p12
GERENCIANET_PIX_KEY=pix@cadbrasil.com.br
```

#### e) **Banco de Dados - Verificar se está correto**
```env
# Verificar se o host está correto para produção:
DB_HOST=srv1314.hstgr.io
DB_PORT=3306
DB_USER=u460638534_adm
DB_PASSWORD="3IoMI5r*Mu3#"
DB_NAME=u460638534_adm
```

---

## 📝 Arquivo `server/.env` Completo para Produção

```env
# Banco MySQL
DB_HOST=srv1314.hstgr.io
DB_PORT=3306
DB_USER=u460638534_adm
DB_PASSWORD="3IoMI5r*Mu3#"
DB_NAME=u460638534_adm

# API
PORT=3012
NODE_ENV=production

# CORS - origens permitidas (apenas domínios de produção)
CORS_ORIGINS=https://cadbrasil.com.br,https://www.cadbrasil.com.br

# API ReceitaWS
RECEITAWS_API_TOKEN=f7cb99c733f15a371777cfd0844156fabfbdee28ec6920e305f2edaf1fc5d022
# Compatibilidade (mantido para não quebrar)
CNPJ_WS_API_TOKEN=f7cb99c733f15a371777cfd0844156fabfbdee28ec6920e305f2edaf1fc5d022

# API de Email Externa (send.cadbr.com.br)
EMAIL_API_URL=https://send.cadbr.com.br/sendCron
EMAIL_NOTIFICATION_EMAIL=admin@cadbr.com.br

# Gerencianet / Efipay (boleto e PIX)
# IMPORTANTE: false = produção (certificado + credenciais de produção)
GERENCIANET_SANDBOX=false
GERENCIANET_CLIENT_ID=Client_Id_181699a2e3ebb57747ba0ff5d4a7ea899f7fdd4f
GERENCIANET_CLIENT_SECRET=Client_Secret_f4d3846a9b217f4c375bce0df93d88c48b18f149
GERENCIANET_CERTIFICATE_PATH=certificados/producao-790387-LicitacoesCadbrasil.p12
GERENCIANET_PIX_KEY=pix@cadbrasil.com.br
```

---

## 🔨 Processo de Deploy

### **Passo 1: Build do Frontend**

```bash
# Na raiz do projeto
npm run build
```

Isso criará a pasta `dist/` com os arquivos otimizados para produção.

**Verificar:**
- ✅ Pasta `dist/` foi criada
- ✅ Arquivos `index.html`, `assets/` estão presentes
- ✅ Testar localmente (opcional): `npm run preview`

---

### **Passo 2: Preparar Backend no Servidor**

```bash
# No servidor, entrar na pasta do backend
cd /caminho/para/cadbrasil/server

# Instalar dependências de produção (sem devDependencies)
npm install --production

# Verificar se o arquivo .env está configurado corretamente
# (usar o conteúdo do arquivo .env de produção acima)
```

---

### **Passo 3: Upload dos Arquivos**

#### **Frontend:**
- Upload da pasta `dist/` para: `/www/wwwroot/cadbrasil.com.br/dist`
- Ou o caminho configurado no seu servidor web

#### **Backend:**
- Upload da pasta `server/` completa para o servidor
- **IMPORTANTE:** Incluir a pasta `server/certificados/` com o arquivo `.p12` do Gerencianet

---

### **Passo 4: Configurar PM2 (Process Manager)**

```bash
# Instalar PM2 globalmente (se ainda não tiver)
npm install -g pm2

# Entrar na pasta do backend
cd /caminho/para/cadbrasil/server

# Iniciar o backend com PM2
pm2 start index.js --name cadbrasil-api --env production

# Salvar a configuração do PM2
pm2 save

# Configurar PM2 para iniciar automaticamente no boot
pm2 startup
```

**Comandos úteis do PM2:**
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs cadbrasil-api

# Reiniciar
pm2 restart cadbrasil-api

# Parar
pm2 stop cadbrasil-api

# Ver informações detalhadas
pm2 info cadbrasil-api
```

---

### **Passo 5: Configurar Nginx**

Use a configuração do arquivo `NGINX_CONFIG_FINAL.md`. **IMPORTANTE:** A porta do backend no Nginx deve ser `3012` (não 3013).

**Ajuste necessário no Nginx:**
```nginx
# API Backend - Proxy reverso para Node.js (APENAS /api)
location /api {
    proxy_pass http://127.0.0.1:3012;  # ← Porta 3012 (não 3013)
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header REMOTE-HOST $remote_addr;
    add_header X-Cache $upstream_cache_status;

    proxy_connect_timeout 30s;
    proxy_read_timeout 86400s;
    proxy_send_timeout 30s;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_cache_bypass $http_upgrade;
}
```

**Aplicar configuração:**
```bash
# Testar configuração
nginx -t

# Recarregar Nginx
nginx -s reload
# ou
systemctl reload nginx
```

---

## ✅ Verificações Pós-Deploy

### **1. Testar Backend Diretamente**

```bash
# No servidor, testar se o backend está respondendo
curl http://localhost:3012/health
```

**Resposta esperada:**
```json
{
  "ok": true,
  "database": "connected",
  "timestamp": "..."
}
```

### **2. Testar API via Nginx**

```bash
# Testar via domínio (deve passar pelo Nginx)
curl https://cadbrasil.com.br/api/health
```

### **3. Testar Frontend**

- Acessar: `https://cadbrasil.com.br`
- Verificar se a página carrega
- Testar busca de CNPJ
- Testar busca de CEP
- Testar fluxo completo de cadastro

### **4. Testar Gerencianet (PIX/Boleto)**

- Fazer um cadastro de teste
- Verificar se o PIX é gerado corretamente
- Verificar se o Boleto é gerado corretamente
- Verificar se a verificação de pagamento funciona

### **5. Verificar Logs**

```bash
# Logs do PM2
pm2 logs cadbrasil-api

# Logs do Nginx
tail -f /www/wwwlogs/cadbrasil.log
tail -f /www/wwwlogs/cadbrasil.error.log
```

---

## 🔒 Segurança - Checklist Final

- [ ] Arquivos `.env` não estão no repositório Git (verificar `.gitignore`)
- [ ] `NODE_ENV=production` no backend
- [ ] CORS configurado apenas para domínios de produção
- [ ] HTTPS habilitado no Nginx
- [ ] Certificado SSL válido
- [ ] Firewall configurado (porta 3012 apenas para localhost)
- [ ] Senhas e tokens não estão hardcoded no código
- [ ] Certificado Gerencianet (.p12) está no servidor e com permissões corretas

---

## 🐛 Troubleshooting

### **Erro: "Cannot connect to database"**
- Verificar se o IP do servidor está liberado no MySQL
- Verificar credenciais no `server/.env`
- Testar conexão: `mysql -h srv1314.hstgr.io -u u460638534_adm -p`

### **Erro: "CORS policy"**
- Verificar se o domínio do frontend está em `CORS_ORIGINS`
- Verificar se o Nginx está fazendo proxy corretamente

### **Erro: "404 Not Found" na API**
- Verificar se o backend está rodando: `pm2 status`
- Verificar se a porta no Nginx (`3012`) está correta
- Verificar logs: `pm2 logs cadbrasil-api`

### **Erro: "PIX/Boleto não gera"**
- Verificar se o certificado `.p12` está na pasta `server/certificados/`
- Verificar se `GERENCIANET_SANDBOX=false`
- Verificar logs do Gerencianet: `pm2 logs cadbrasil-api | grep Gerencianet`

---

## 📞 Suporte

Em caso de problemas, verificar:
1. Logs do PM2: `pm2 logs cadbrasil-api`
2. Logs do Nginx: `/www/wwwlogs/cadbrasil.error.log`
3. Status do backend: `pm2 status`
4. Teste de conectividade: `curl http://localhost:3012/health`

---

**Última atualização:** 26/01/2026
