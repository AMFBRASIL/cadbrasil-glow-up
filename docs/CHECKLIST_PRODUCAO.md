# ✅ Checklist de Produção - CADBRASIL

## 🔴 ANTES DE SUBIR PARA PRODUÇÃO

### 1. **Configurar Variáveis de Ambiente - Frontend**
- [ ] Criar arquivo `.env` na raiz com:
  ```env
  VITE_API_URL=https://api.cadbr.com.br
  ```
  ⚠️ **Substituir pelo domínio real da API**

### 2. **Configurar Variáveis de Ambiente - Backend**
- [ ] Atualizar `server/.env`:
  - [ ] Mudar `NODE_ENV=production` (atualmente está `development`)
  - [ ] Atualizar `CORS_ORIGINS` com domínios de produção:
    ```env
    CORS_ORIGINS=https://cadbr.com.br,https://www.cadbr.com.br,https://cadastro.cadbr.com.br
    ```
  - [ ] Verificar se `DB_HOST` está correto (atualmente: `srv1314.hstgr.io`)
  - [ ] Confirmar credenciais do banco estão corretas

### 3. **Build do Frontend**
- [ ] Executar: `npm run build`
- [ ] Verificar se a pasta `dist/` foi criada
- [ ] Testar build localmente: `npm run preview`

### 4. **Testar Backend Localmente**
- [ ] Testar endpoint: `http://localhost:3013/health`
- [ ] Verificar se retorna `"database": "connected"`
- [ ] Testar busca de CNPJ: `GET /api/cnpj/:cnpj`
- [ ] Testar verificação de renovação: `POST /api/renovacao/verificar`

### 5. **Verificar Segurança**
- [ ] Confirmar que `.env` e `server/.env` estão no `.gitignore` ✅ (já está)
- [ ] Verificar se não há senhas/tokens hardcoded no código ✅
- [ ] Confirmar que CORS está restrito aos domínios corretos

### 6. **Preparar Servidor**
- [ ] Instalar Node.js 18+ no servidor
- [ ] Instalar PM2 (process manager): `npm install -g pm2`
- [ ] Configurar firewall (porta 3013 para API)
- [ ] Configurar servidor web (nginx/Apache) para frontend

## 🚀 DEPLOY

### Frontend
```bash
npm run build
# Upload da pasta dist/ para servidor web
```

### Backend
```bash
cd server
npm install --production
pm2 start index.js --name cadbrasil-api --env production
pm2 save
```

## ✅ PÓS-DEPLOY

- [ ] Testar frontend em produção
- [ ] Testar API: `GET /health`
- [ ] Testar cadastro completo
- [ ] Verificar logs: `pm2 logs cadbrasil-api`
- [ ] Testar busca de CNPJ
- [ ] Testar busca de CEP
- [ ] Verificar se emails estão sendo enviados

## 📝 NOTAS IMPORTANTES

1. **URL da API**: O frontend precisa saber onde está a API. Configure `VITE_API_URL` no `.env` do frontend.

2. **CORS**: O backend precisa permitir requisições do domínio do frontend. Configure `CORS_ORIGINS` no `.env` do backend.

3. **Banco de Dados**: Certifique-se de que o IP do servidor está liberado no MySQL.

4. **HTTPS**: Use HTTPS em produção para segurança.

---

**📖 Para mais detalhes, consulte `DEPLOY.md`**
