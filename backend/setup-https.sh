#!/bin/bash

# HTTPS 配置脚本
# 使用方法: sudo bash setup-https.sh your-domain.com

if [ -z "$1" ]; then
    echo "使用方法: sudo bash setup-https.sh your-domain.com"
    exit 1
fi

DOMAIN=$1

echo "=========================================="
echo "  配置 HTTPS 域名: $DOMAIN"
echo "=========================================="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "请使用 root 用户或 sudo 运行此脚本"
    exit 1
fi

# 更新 Nginx 配置
cat > /etc/nginx/sites-available/daoguan-backend << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # 将 HTTP 重定向到 HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    # SSL 证书配置 (使用 Certbot 自动生成)
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    # ssl_protocols TLSv1.2 TLSv1.3;
    # ssl_ciphers HIGH:!aNULL:!MD5;

    # 如果没有证书,先临时注释掉 SSL 配置
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/daoguan-backend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试 Nginx 配置
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx 配置测试通过"
    systemctl reload nginx
    echo "✅ Nginx 已重载"
else
    echo "❌ Nginx 配置测试失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "  下一步: 获取 SSL 证书"
echo "=========================================="
echo ""
echo "请先确保:"
echo "  1. 域名 $DOMAIN 已解析到此服务器"
echo "  2. 防火墙已开放 80 和 443 端口"
echo ""
echo "然后运行以下命令获取证书:"
echo "  sudo certbot --nginx -d $DOMAIN"
echo ""
