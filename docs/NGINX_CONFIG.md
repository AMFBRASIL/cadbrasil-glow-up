# Configuração Nginx para CADBRASIL

## Problema
O erro "Cannot GET /" ocorre porque o nginx está fazendo proxy de todas as rotas para o backend, mas o frontend React precisa ser servido como arquivos estáticos.

## ✅ Configuração Correta

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name cadbrasil.com;
    index index.html index.htm default.htm default.html;
    
    # IMPORTANTE: root deve apontar para a pasta dist/ do frontend
    root /www/wwwroot/cadbrasil.com/dist/;
    
    #CERT-APPLY-CHECK--START
    include /www/server/panel/vhost/nginx/well-known/cadbrasilteste.conf;
    #CERT-APPLY-CHECK--END
    
    #SSL-START SSL related configuration
    #HTTP_TO_HTTPS_START
    if ($server_port !~ 443){
        rewrite ^(/.*)$ https://$host$1 permanent;
    }
    #HTTP_TO_HTTPS_END
    ssl_certificate    /www/server/panel/vhost/cert/cadbrasilteste/fullchain.pem;
    ssl_certificate_key    /www/server/panel/vhost/cert/cadbrasilteste/privkey.pem;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_tickets on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    error_page 497  https://$host$request_uri;
    #SSL-END
    
    #REWRITE-START Pseudo-static related configuration
    include /www/server/panel/vhost/rewrite/node_cadbrasilteste.conf;
    #REWRITE-END
    
    #Files or directories forbidden to access
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md|package.json|package-lock.json|\.env|node_modules) {
        return 404;
    }
    
    #One-click application for SSL certificate verification directory related settings
    location /.well-known/ {
        root  /www/wwwroot/cadbrasil.com/;
    }

    # API - Proxy reverso para o backend Node.js (porta 3013)
    location /api {
        proxy_pass http://127.0.0.1:3013;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 30s;
        proxy_read_timeout 86400s;
        proxy_send_timeout 30s;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Health check do backend
    location /health {
        proxy_pass http://127.0.0.1:3013;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend - Servir arquivos estáticos do React
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache para arquivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    access_log  /www/wwwlogs/cadbrasilteste.log;
    error_log  /www/wwwlogs/cadbrasilteste.error.log;
}
```

## 🔑 Mudanças Principais

1. **`root`**: Mudado de `/www/wwwroot/cadbrasil.com/server/` para `/www/wwwroot/cadbrasil.com/dist/`
   - A pasta `dist/` contém o build do frontend React

2. **`location /api`**: Proxy apenas para rotas da API
   - Todas as requisições `/api/*` vão para o backend na porta 3013

3. **`location /`**: Servir arquivos estáticos do frontend
   - `try_files $uri $uri/ /index.html;` - necessário para SPA routing do React

4. **`location /health`**: Endpoint de health check do backend

## 📝 Passos para Aplicar

1. **Fazer build do frontend** (se ainda não fez):
   ```bash
   cd /www/wwwroot/cadbrasil.com
   npm run build
   ```

2. **Verificar se a pasta `dist/` existe**:
   ```bash
   ls -la /www/wwwroot/cadbrasil.com/dist/
   ```

3. **Atualizar configuração do nginx** com a configuração acima

4. **Testar configuração do nginx**:
   ```bash
   nginx -t
   ```

5. **Recarregar nginx**:
   ```bash
   nginx -s reload
   # ou
   systemctl reload nginx
   ```

## ✅ Verificação

Após aplicar, teste:

1. **Frontend**: `https://cadbrasil.com` - deve carregar a página inicial
2. **API Health**: `https://cadbrasil.com/health` - deve retornar JSON com status do banco
3. **API Endpoint**: `https://cadbrasil.com/api/cnpj/12345678000190` - deve funcionar

## ⚠️ Importante

- Certifique-se de que o backend está rodando na porta 3013
- Certifique-se de que a pasta `dist/` contém os arquivos do build do frontend
- O backend deve estar configurado para aceitar requisições de `cadbrasil.com`
