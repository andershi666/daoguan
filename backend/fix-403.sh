#!/bin/bash

# 修复 Nginx 403 错误,让 Certbot 能正常获取证书
# 使用方法: sudo bash fix-403.sh daoguan.oinkoo.com

if [ -z "$1" ]; then
    echo "使用方法: sudo bash fix-403.sh your-domain.com"
    exit 1
fi

DOMAIN=$1

echo "=========================================="
echo "  修复 Certbot 403 错误"
echo "  域名: $DOMAIN"
echo "=========================================="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "请使用 root 用户或 sudo 运行此脚本"
    exit 1
fi

# 步骤 1: 创建验证目录
echo -e "\n[1/4] 创建验证目录..."
mkdir -p /var/www/html/.well-known/acme-challenge
chown -R www-data:www-data /var/www/html/.well-known
chmod -R 755 /var/www/html/.well-known

# 创建测试文件
echo "test" > /var/www/html/.well-known/acme-challenge/test.html
chown www-data:www-data /var/www/html/.well-known/acme-challenge/test.html

echo "✅ 验证目录创建成功"

# 步骤 2: 测试目录访问
echo -e "\n[2/4] 测试目录访问..."
curl -I http://localhost/.well-known/acme-challenge/test.html
if [ $? -eq 0 ]; then
    echo "✅ 目录可访问"
else
    echo "❌ 目录不可访问"
fi

# 步骤 3: 更新 Nginx 配置
echo -e "\n[3/4] 更新 Nginx 配置..."

cat > /etc/nginx/sites-available/daoguan-backend << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # 优先处理 Let's Encrypt 验证请求
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files \$uri =200;
    }

    # 其他请求
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

echo "✅ Nginx 配置已更新"

# 步骤 4: 测试并重载
echo -e "\n[4/4] 测试并重载 Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx 配置测试通过"
    systemctl reload nginx
    echo "✅ Nginx 已重载"
else
    echo "❌ Nginx 配置测试失败"
    exit 1
fi

echo -e "\n=========================================="
echo "  修复完成!"
echo "=========================================="
echo ""
echo "现在运行以下命令获取证书:"
echo "  sudo certbot --nginx -d $DOMAIN"
echo ""
