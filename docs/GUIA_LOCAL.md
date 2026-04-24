# 🚀 Guia para Rodar o Sistema Localmente

## 🔌 Portas (DEV vs PROD)

| Ambiente | Backend (API) | Frontend |
|----------|----------------|----------|
| **DEV**  | `3001`         | `8080` (Vite) |
| **PROD** | `3012`         | Arquivos estáticos (Nginx, etc.) |

- **DEV:** o frontend (`npm run dev`) roda em **http://localhost:8080** e chama a API em **http://localhost:3001**. Use `VITE_API_URL=http://localhost:3001` no `.env` da raiz e `PORT=3001` no `server/.env`.
- **PROD:** o backend roda na **3012**; o Nginx faz proxy de `/api` para essa porta. No build do frontend, use `VITE_API_URL=https://cadbrasil.com.br` (ou a URL do site).

## 📋 Pré-requisitos

1. **Node.js** 18+ instalado
2. **MySQL** acessível (ou usar o banco remoto configurado)
3. **npm** ou **yarn** instalado

## 🔧 Configuração

### 1. Backend (API)

```bash
# Entrar na pasta do backend
cd server

# Instalar dependências
npm install

# Verificar se o arquivo .env existe
# Se não existir, copiar do .env.example
cp .env.example .env

# Editar .env e verificar:
# - PORT=3001 em DEV (3012 em PROD)
# - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (credenciais do banco)
# - CORS_ORIGINS deve incluir http://localhost:8080 e http://localhost:5173
```

### 2. Frontend

```bash
# Voltar para a raiz do projeto
cd ..

# Instalar dependências
npm install

# Verificar se o arquivo .env existe
# Se não existir, copiar do .env.example
cp .env.example .env

# Editar .env e verificar:
# VITE_API_URL=http://localhost:3001  (DEV: mesma porta do backend)
# Em PROD: VITE_API_URL=https://cadbrasil.com.br (ou URL do site)
```

## ▶️ Como Rodar

### Terminal 1 - Backend

```bash
cd server
npm run dev
# ou
npm start
```

Você deve ver:
```
[cadbrasil-api] http://localhost:3001
[CORS] Origens permitidas: [ 'http://localhost:8080', 'http://localhost:5173', ... ]
```

### Terminal 2 - Frontend

```bash
# Na raiz do projeto
npm run dev
```

Você deve ver:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

## ✅ Verificação

### 1. Testar Backend

Abra no navegador ou use curl:
```
http://localhost:3001/health
```

Deve retornar:
```json
{
  "ok": true,
  "database": "connected",
  "timestamp": "..."
}
```

### 2. Testar Frontend

Abra no navegador:
```
http://localhost:8080
```

A página inicial deve carregar.

### 3. Testar Integração

1. Acesse `http://localhost:8080/cadastro`
2. Tente buscar um CNPJ
3. Verifique o console do navegador (F12) para erros

## 🐛 Problemas Comuns

### Erro: "Cannot connect to database"

**Solução:**
- Verifique as credenciais no `server/.env`
- Teste a conexão MySQL:
  ```bash
  mysql -h srv1314.hstgr.io -u u460638534_adm -p
  ```
- Verifique se o IP está liberado no MySQL

### Erro: "CORS policy blocked"

**Solução:**
- Verifique se `http://localhost:8080` está em `CORS_ORIGINS` no `server/.env`
- Reinicie o backend após alterar `.env`
- Verifique os logs do backend para ver qual origin está sendo bloqueada

### Erro: "Failed to fetch", "ERR_CONNECTION_REFUSED" ou "Erro ao buscar CNPJ"

**Causa:** O backend (API) não está rodando ou não está acessível em `http://localhost:3001`.

**Solução:**
1. **Subir o backend** em um terminal:
   ```bash
   cd server
   npm start
   ```
   (Use `npm run dev` só se `node --watch` funcionar no seu ambiente.)

2. **Confirmar que a API está no ar:** abra no navegador:
   ```
   http://localhost:3001/health
   ```
   Deve retornar JSON com `"ok": true` e `"database": "connected"`.

3. **Frontend:** confira no **raiz** do projeto (`.env`) se existe:
   ```
   VITE_API_URL=http://localhost:3001
   ```
   E se o frontend foi iniciado **depois** de alterar o `.env` (reinicie o `npm run dev` do frontend).

4. **Porta 3001 em uso (`EADDRINUSE`):** outro processo está usando a porta.
   - No Windows (PowerShell): `Get-NetTCPConnection -LocalPort 3001` para ver o processo.
   - Encerre o processo que usa a 3001 ou altere `PORT` no `server/.env` (ex.: `3002`) e ajuste `VITE_API_URL` no `.env` do frontend.

### Erro: "Failed to fetch" ou "Network error" (genérico)

**Solução:**
- Verifique se o backend está rodando: `http://localhost:3001/health`
- Verifique se a porta no `.env` do frontend corresponde à do backend
- Verifique o console do navegador (F12) para mais detalhes

### Erro: "Port already in use"

**Solução:**
- Verifique qual processo está usando a porta:
  ```bash
  # Windows
  netstat -ano | findstr :3001
  
  # Linux/Mac
  lsof -i :3001
  ```
- Pare o processo ou mude a porta no `.env`

### Frontend não carrega

**Solução:**
- Verifique se as dependências foram instaladas: `npm install`
- Limpe o cache: `rm -rf node_modules package-lock.json && npm install`
- Verifique se a porta 8080 está livre

## 📝 Checklist de Troubleshooting

- [ ] Backend está rodando na porta 3001?
- [ ] Frontend está rodando na porta 8080?
- [ ] Arquivo `server/.env` existe e está configurado?
- [ ] Arquivo `.env` (raiz) existe e tem `VITE_API_URL=http://localhost:3001`?
- [ ] Dependências instaladas em ambos (`npm install`)?
- [ ] CORS_ORIGINS inclui `http://localhost:8080`?
- [ ] Banco de dados está acessível?
- [ ] Console do navegador mostra algum erro?

## 🔍 Logs Úteis

### Backend
```bash
cd server
npm run dev
# Verá logs de conexão, CORS, e erros
```

### Frontend
Abra o DevTools (F12) no navegador e verifique:
- **Console**: erros JavaScript
- **Network**: requisições HTTP e respostas

## 💡 Dica

Se ainda não funcionar, compartilhe:
1. Mensagem de erro completa
2. Logs do backend (terminal onde roda `npm run dev`)
3. Logs do console do navegador (F12)
4. Resultado de `http://localhost:3001/health`
