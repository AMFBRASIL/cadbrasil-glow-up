# Configuração Nginx para cadbrasil.com.br (Baseada na Config que Funciona)

## ✅ Configuração Completa

```nginx
server
{
    listen 80;
    listen 443 ssl http2;
    server_name cadbrasil.com.br;
    index index.html index.htm default.htm default.html;
    
    # IMPORTANTE: Pasta do frontend (build do React/Vite)
    root /www/wwwroot/cadbrasil.com.br/dist;
    
    #SSL-START SSL related configuration
    #error_page 404/404.html;
    #HTTP_TO_HTTPS_START
    if ($server_port !~ 443){
        rewrite ^(/.*)$ https://$host$1 permanent;
    }
    #HTTP_TO_HTTPS_END
    ssl_certificate    /www/server/panel/vhost/cert/cadbrasil/fullchain.pem;
    ssl_certificate_key    /www/server/panel/vhost/cert/cadbrasil/privkey.pem;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_tickets on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    error_page 497  https://$host$request_uri;
    #SSL-END
    
    #ERROR-PAGE-START  Error page configuration, allowed to be commented
    #error_page 404 /404.html;
    #error_page 502 /502.html;
    #ERROR-PAGE-END
    
    #REWRITE-START Pseudo-static related configuration
    include /www/server/panel/vhost/rewrite/node_cadbrasil.conf;
    #REWRITE-END
    
    #Files or directories forbidden to access
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md|package.json|package-lock.json|\.env|node_modules) {
        return 404;
    }
    
    #One-click application for SSL certificate verification directory related settings
    location /.well-known/ {
        root  /www/wwwroot/cadbrasil.com.br/;
    }

    # HTTP reverse proxy related settings begin >>>
    location ~ /purge(/.*) {
        proxy_cache_purge cache_one $host$request_uri$is_args$args;
    }

    # API Backend - Proxy reverso para Node.js (APENAS /api)
    location /api {
        proxy_pass http://127.0.0.1:3013;
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
    # End of HTTP reverse proxy related settings <<<

    # Frontend - Servir arquivos estáticos do React/Vite
    location / {
        # Tentar servir arquivo, se não existir, servir index.html (SPA routing)
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    access_log  /www/wwwlogs/cadbrasil.log;
    error_log  /www/wwwlogs/cadbrasil.error.log;
}
```

## 🔑 Mudanças em Relação à Config Original

1. **`root`**: Mudado para `/www/wwwroot/cadbrasil.com/dist` (sem barra final)
2. **`location /api`**: Adicionado antes do `location /` para fazer proxy apenas das rotas da API
3. **`location /`**: Configurado para servir arquivos estáticos com `try_files` (SPA routing)
4. **Cache de assets**: Adicionado para melhor performance
5. **Porta do backend**: `3013` (ajustado para o seu caso)

## ✅ Esta Configuração Deve Funcionar Porque:

- ✅ Mantém a estrutura SSL exatamente como o painel espera
- ✅ Tem a seção ERROR-PAGE-START/END comentada (permitida pelo painel)
- ✅ Separa claramente API (`/api`) do frontend (`/`)
- ✅ Usa `try_files` para SPA routing do React
- ✅ Baseada em uma config que já funciona em produção

## 📝 Para Aplicar

1. Copie a configuração completa acima
2. Cole no painel do nginx substituindo a configuração atual
3. Salve
4. Teste: `nginx -t`
5. Recarregue: `nginx -s reload`

## ⚠️ Verificações Antes de Aplicar

1. Certifique-se de que a pasta `dist/` existe:
   ```bash
   ls -la /www/wwwroot/cadbrasil.com/dist/
   ```

2. Certifique-se de que o backend está rodando na porta 3013:
   ```bash
   netstat -tulpn | grep 3013
   ```

3. Certifique-se de que os certificados SSL estão no caminho correto:
   - `/www/server/panel/vhost/cert/cadbrasil/fullchain.pem`
   - `/www/server/panel/vhost/cert/cadbrasil/privkey.pem`
