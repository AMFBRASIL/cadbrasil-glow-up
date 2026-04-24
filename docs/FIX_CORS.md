# 🔧 Solução para Erro de CORS

## Problema
O backend não está permitindo requisições de `https://cadbrasil.com` devido à configuração de CORS.

## ✅ Solução

### 1. Verificar e Atualizar `server/.env`

Certifique-se de que o arquivo `server/.env` no servidor contém:

```env
CORS_ORIGINS=https://cadbrasil.com.br,https://www.cadbrasil.com.br,https://cadbrasil.com,https://www.cadbrasil.com,http://localhost:8080,http://localhost:5173
```

### 2. Reiniciar o Backend

**IMPORTANTE**: Após atualizar o `.env`, você DEVE reiniciar o backend para que as mudanças tenham efeito.

#### Se estiver usando PM2:
```bash
cd /www/wwwroot/cadbrasil.com/server
pm2 restart cadbrasil-api
# ou
pm2 restart all
```

#### Se estiver usando node diretamente:
```bash
# Parar o processo atual (Ctrl+C ou kill)
# Depois iniciar novamente:
cd /www/wwwroot/cadbrasil.com/server
node index.js
```

### 3. Verificar se o Backend Está Rodando

```bash
# Verificar se a porta 3013 está em uso
netstat -tulpn | grep 3013

# Ou testar o endpoint de health
curl http://localhost:3013/health
```

### 4. Testar CORS

Após reiniciar, teste se o CORS está funcionando:

```bash
# Testar de dentro do servidor
curl -H "Origin: https://cadbrasil.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3013/api/renovacao/verificar \
     -v
```

Você deve ver no cabeçalho de resposta:
```
Access-Control-Allow-Origin: https://cadbrasil.com
```

## 🔍 Verificação Adicional

Se ainda não funcionar, verifique:

1. **O arquivo `.env` está sendo lido?**
   - Adicione um `console.log` temporário no `server/index.js`:
   ```javascript
   console.log("CORS_ORIGINS:", process.env.CORS_ORIGINS);
   ```

2. **O nginx está passando os headers corretos?**
   - Verifique se o proxy do nginx está configurado corretamente para passar headers CORS

3. **Firewall/Segurança**
   - Certifique-se de que não há firewall bloqueando as requisições

## 📝 Checklist

- [ ] Arquivo `server/.env` atualizado com `https://cadbrasil.com` no `CORS_ORIGINS`
- [ ] Backend reiniciado após atualizar `.env`
- [ ] Backend está rodando na porta 3013
- [ ] Teste de CORS retorna headers corretos
- [ ] Frontend está fazendo requisições para `https://cadbrasil.com.br/api/...`
