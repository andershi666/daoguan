#!/bin/bash

# 阿里云 ECS 自动部署脚本
# 使用方法: ./deploy.sh

set -e

echo "=========================================="
echo "  道观小程序后端部署脚本"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="daoguan"
GITHUB_REPO="https://github.com/andershi666/daoguan.git"
DEPLOY_DIR="/opt/daoguan"
SERVICE_NAME="daoguan-backend"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 root 用户或 sudo 运行此脚本${NC}"
    exit 1
fi

# 更新系统
echo -e "${GREEN}[1/10] 更新系统包...${NC}"
apt-get update && apt-get upgrade -y

# 安装必要工具
echo -e "${GREEN}[2/10] 安装必要工具...${NC}"
apt-get install -y git curl wget build-essential

# 安装 Node.js (使用 NodeSource 18.x)
echo -e "${GREEN}[3/10] 安装 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    node -v
    npm -v
else
    echo -e "${YELLOW}Node.js 已安装${NC}"
    node -v
fi

# 安装 MySQL
echo -e "${GREEN}[4/10] 检查 MySQL 安装...${NC}"
if ! command -v mysql &> /dev/null; then
    apt-get install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
    echo -e "${YELLOW}请设置 MySQL root 密码...${NC}"
    mysql_secure_installation
else
    echo -e "${YELLOW}MySQL 已安装${NC}"
fi

# 安装 PM2 (进程管理器)
echo -e "${GREEN}[5/10] 安装 PM2...${NC}"
npm install -g pm2

# 安装 Nginx
echo -e "${GREEN}[6/10] 安装 Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
else
    echo -e "${YELLOW}Nginx 已安装${NC}"
fi

# 克隆或更新项目
echo -e "${GREEN}[7/10] 部署项目代码...${NC}"
if [ -d "$DEPLOY_DIR" ]; then
    echo -e "${YELLOW}项目已存在,更新代码...${NC}"
    cd $DEPLOY_DIR
    git fetch origin
    git reset --hard origin/main
    git pull origin main
else
    echo -e "${YELLOW}克隆项目...${NC}"
    git clone $GITHUB_REPO $DEPLOY_DIR
    cd $DEPLOY_DIR
fi

# 安装依赖
echo -e "${GREEN}[8/10] 安装项目依赖...${NC}"
cd $DEPLOY_DIR/backend
npm install --production

# 配置环境变量
echo -e "${GREEN}[9/10] 配置环境变量...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}请编辑 .env 文件,配置以下参数:${NC}"
    echo -e "${YELLOW}  - 数据库配置 (DB_HOST, DB_USER, DB_PASSWORD 等)${NC}"
    echo -e "${YELLOW}  - 微信小程序配置 (WECHAT_APPID, WECHAT_SECRET)${NC}"
    echo -e "${YELLOW}  - 微信支付配置 (如需要)${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}编辑完成后按回车继续...${NC}"
    read
fi

# 初始化数据库
echo -e "${GREEN}[10/10] 初始化数据库...${NC}"
echo -e "${YELLOW}请确认 MySQL root 密码...${NC}"
read -p "MySQL root 密码: " mysql_password

# 创建数据库
mysql -u root -p"$mysql_password" << EOF
CREATE DATABASE IF NOT EXISTS daoguan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

# 导入数据库结构
if [ -f "database/schema.sql" ]; then
    mysql -u root -p"$mysql_password" daoguan_db < database/schema.sql
    echo -e "${GREEN}数据库结构导入完成${NC}"
fi

# 使用 PM2 启动应用
echo -e "${GREEN}启动应用...${NC}"
pm2 delete $SERVICE_NAME 2>/dev/null || true
pm2 start src/app.js --name $SERVICE_NAME
pm2 save
pm2 startup

# 配置 Nginx 反向代理
echo -e "${GREEN}配置 Nginx...${NC}"
cat > /etc/nginx/sites-available/$SERVICE_NAME << 'EOF'
server {
    listen 80;
    server_name your-domain.com;  # 请修改为你的域名或服务器 IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$SERVICE_NAME /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo -e "${GREEN}=========================================="
echo -e "  部署完成!"
echo -e "=========================================="
echo -e "${GREEN}服务状态:${NC}"
pm2 status
echo -e ""
echo -e "${GREEN}常用命令:${NC}"
echo -e "  查看日志: pm2 logs $SERVICE_NAME"
echo -e "  重启服务: pm2 restart $SERVICE_NAME"
echo -e "  停止服务: pm2 stop $SERVICE_NAME"
echo -e "  查看状态: pm2 status"
echo -e ""
echo -e "${GREEN}下一步:${NC}"
echo -e "  1. 配置域名解析 (如需要)"
echo -e "  2. 配置 HTTPS 证书 (推荐使用 Let's Encrypt)"
echo -e "  3. 配置防火墙开放端口 80, 443, 3000"
echo -e "=========================================="
