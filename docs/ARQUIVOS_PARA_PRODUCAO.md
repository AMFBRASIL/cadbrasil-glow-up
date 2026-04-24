# 📦 Arquivos para subir em produção – CADBRASIL

Resumo do que enviar ao servidor e o que fazer **antes** e **depois** do upload.

---

## 1. Frontend (React / Vite)

### O que subir

| Onde no projeto | Destino no servidor |
|-----------------|---------------------|
| **Pasta `dist/`** (inteira) | `/www/wwwroot/cadbrasil/dist` |

A pasta `dist/` **não existe** até você rodar o build. Gere assim:

```bash
# Na raiz do projeto (usa .env.production automaticamente)
npm run build
```

Depois faça upload **somente** do conteúdo de `dist/` para o servidor (ex.: via FTP/SFTP no caminho acima).

### O que NÃO subir (frontend)

- `node_modules/`
- `src/`, `public/`, `index.html`, etc. (só o resultado do build em `dist/`)
- `.env`, `.env.development`, `.env.production` (não vão junto; o build já embute o que precisa)

### Conteúdo típico de `dist/`

```
dist/
├── index.html
├── assets/
│   ├── index-*.js
│   ├── index-*.css
│   └── ...
├── favicon.ico
├── og-image.jpg
├── robots.txt
├── sitemap.xml
└── placeholder.svg  (se existir)
```

---

## 2. Backend (Node.js / API)

### O que subir

Envie a pasta **`server/`** para o servidor, **exceto** `node_modules` e `.env`:

| Arquivo ou pasta | Subir? |
|------------------|--------|
| `server/index.js` | ✅ Sim |
| `server/db.js` | ✅ Sim |
| `server/package.json` | ✅ Sim |
| `server/package-lock.json` | ✅ Sim |
| `server/routes/` (toda a pasta) | ✅ Sim |
| `server/services/` (toda a pasta) | ✅ Sim |
| `server/utils/` (toda a pasta) | ✅ Sim |
| `server/migrations/` (toda a pasta) | ✅ Sim |
| `server/certificados/` (pasta) | ✅ Sim (vazia ou só README; o .p12 vai separado) |
| `server/node_modules/` | ❌ Não (instalar no servidor com `npm install --production`) |
| `server/.env` | ❌ Não (criar/editar **no servidor** com os valores de produção) |

### Certificado Gerencianet (.p12)

- **Não** versionar no Git.
- Enviar o `.p12` por canal seguro (ex.: SFTP) para:
  ```
  server/certificados/producao-790387-LicitacoesCadbrasil.p12
  ```
- Ou o nome que estiver em `GERENCIANET_CERTIFICATE_PATH` no `server/.env`.

### `server/.env` em produção

Criar/atualizar **no servidor** (nunca subir esse arquivo). Exemplo base:

```env
NODE_ENV=production
PORT_DEV=3001
PORT_PROD=3013

DB_HOST=...
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=...

CORS_ORIGINS=https://cadbrasil.com.br,https://www.cadbrasil.com.br

RECEITAWS_API_TOKEN=...
CNPJ_WS_API_TOKEN=...

EMAIL_API_URL=https://send.cadbr.com.br/sendCron
EMAIL_NOTIFICATION_EMAIL=...

GERENCIANET_SANDBOX=false
GERENCIANET_CLIENT_ID=...
GERENCIANET_CLIENT_SECRET=...
GERENCIANET_CERTIFICATE_PATH=certificados/producao-790387-LicitacoesCadbrasil.p12
GERENCIANET_PIX_KEY=pix@cadbrasil.com.br
```

Ajuste hosts, usuários, senhas e tokens conforme seu ambiente.

---

## 3. Checklist rápido

### Antes do upload

- [ ] `npm run build` na raiz → pasta `dist/` gerada.
- [ ] `server/.env` de produção pronto (no servidor).
- [ ] Certificado `.p12` em `server/certificados/` no servidor.

### Upload

- [ ] Conteúdo de `dist/` → `/www/wwwroot/cadbrasil/dist`.
- [ ] `server/` (sem `node_modules`, sem `.env`) → pasta do backend no servidor.
- [ ] `.p12` em `server/certificados/` (se ainda não estiver).

### No servidor (backend)

```bash
cd /caminho/para/cadbrasil/server
npm install --production
pm2 start index.js --name cadbrasil-api
pm2 save
```

### Nginx

- [ ] `root` apontando para a pasta do `dist` (ex.: `/www/wwwroot/cadbrasil/dist`).
- [ ] `location /api/` com `proxy_pass` para a porta da API (ex.: `http://127.0.0.1:3013`).
- [ ] `location /` com `try_files $uri $uri/ /index.html;` para o SPA.

---

## 4. Resumo em uma frase

**Frontend:** build (`npm run build`) → subir **só `dist/`**.  
**Backend:** subir **`server/`** (sem `node_modules` e sem `.env`), colocar `.p12` em `server/certificados/`, criar `server/.env` no servidor, rodar `npm install --production` e iniciar com PM2.

---

*Atualizado em 26/01/2026*
