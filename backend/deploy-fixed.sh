#!/bin/bash

# 阿里云 ECS 自动部署脚本 (修复版)
# 使用方法: ./deploy-fixed.sh

set -e

echo "=========================================="
echo "  道观小程序后端部署脚本 (修复版)"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="daoguan"
# 使用 SSH 方式克隆 (需要配置 SSH 密钥)
GITHUB_REPO="git@github.com:andershi666/daoguan.git"
# HTTPS 备用方式
GITHUB_REPO_HTTPS="https://github.com/andershi666/daoguan.git"
DEPLOY_DIR="/opt/daoguan"
SERVICE_NAME="daoguan-backend"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 root 用户或 sudo 运行此脚本${NC}"
    exit 1
fi

# 更新系统
echo -e "${GREEN}[1/11] 更新系统包...${NC}"
apt-get update && apt-get upgrade -y

# 安装必要工具
echo -e "${GREEN}[2/11] 安装必要工具...${NC}"
apt-get install -y git curl wget build-expect

# 配置 Git 使用 HTTP/1.1 (解决 TLS 问题)
echo -e "${GREEN}[3/11] 配置 Git...${NC}"
git config --global http.postBuffer 524288000
git config --global http.version HTTP/1.1
git config --global https.postBuffer 524288000
git config --global https.version HTTP/1.1
git config --global http.sslVerify false
echo -e "${GREEN}Git 配置完成${NC}"

# 安装 Node.js (使用 NodeSource 18.x)
echo -e "${GREEN}[4/11] 安装 Node.js...${NC}"
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
echo -e "${GREEN}[5/11] 检查 MySQL 安装...${NC}"
if ! command -v mysql &> /dev/null; then
    DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
    echo -e "${YELLOW}MySQL 安装完成${NC}"
else
    echo -e "${YELLOW}MySQL 已安装${NC}"
fi

# 安装 PM2 (进程管理器)
echo -e "${GREEN}[6/11] 安装 PM2...${NC}"
npm install -g pm2

# 安装 Nginx
echo -e "${GREEN}[7/11] 安装 Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
else
    echo -e "${YELLOW}Nginx 已安装${NC}"
fi

# 克隆或更新项目 (尝试多种方式)
echo -e "${GREEN}[8/11] 部署项目代码...${NC}"
if [ -d "$DEPLOY_DIR" ]; then
    echo -e "${YELLOW}项目已存在,更新代码...${NC}"
    cd $DEPLOY_DIR
    git fetch origin || true
    git reset --hard origin/main || true
    git pull origin main || echo -e "${YELLOW}Pull 失败,继续使用现有代码${NC}"
else
    echo -e "${YELLOW}克隆项目 (尝试方式 1: HTTPS)...${NC}"

    # 方式 1: 直接使用 HTTPS
    if ! git clone $GITHUB_REPO_HTTPS $DEPLOY_DIR 2>/dev/null; then
        echo -e "${YELLOW}方式 1 失败,尝试方式 2: HTTPS + 缓冲区调整${NC}"
        # 方式 2: 使用深度克隆和缓冲区调整
        if ! git clone --depth 1 $GITHUB_REPO_HTTPS $DEPLOY_DIR 2>/dev/null; then
            echo -e "${YELLOW}方式 2 失败,尝试方式 3: 手动下载 ZIP${NC}"
            # 方式 3: 下载 ZIP 包
            cd /tmp
            wget --no-check-certificate --timeout=30 --tries=3 https://github.com/andershi666/daoguan/archive/refs/heads/main.zip -O daoguan.zip || {
                echo -e "${RED}所有自动下载方式均失败,请手动下载${NC}"
                echo -e "${YELLOW}请访问 https://github.com/andershi666/daoguan 下载 ZIP 包${NC}"
                echo -e "${YELLOW}上传到服务器 /tmp/daoguan.zip 后继续...${NC}"
                read -p "按回车继续 (假设 ZIP 已上传)..."
            }

            if [ -f "/tmp/daoguan.zip" ]; then
                echo -e "${GREEN}解压项目...${NC}"
                unzip -q /tmp/daoguan.zip -d /tmp/
                mv /tmp/daoguan-main $DEPLOY_DIR
                rm /tmp/daoguan.zip
            else
                echo -e "${RED}未找到项目文件,退出部署${NC}"
                exit 1
            fi
        fi
    fi

    cd $DEPLOY_DIR
    git init 2>/dev/null || true
fi

# 初始化 git (如果是 ZIP 解压的)
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}项目未通过 git 克隆,仅支持本地部署${NC}"
fi

# 安装依赖
echo -e "${GREEN}[9/11] 安装项目依赖...${NC}"
cd $DEPLOY_DIR/backend
if [ -f "package.json" ]; then
    npm install --production --registry=https://registry.npmmirror.com
    echo -e "${GREEN}依赖安装完成${NC}"
else
    echo -e "${RED}package.json 不存在,检查项目结构${NC}"
    ls -la
    exit 1
fi

# 配置环境变量
echo -e "${GREEN}[10/11] 配置环境变量...${NC}"
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

    # 直接使用 nano 编辑
    nano .env
fi

# 初始化数据库
echo -e "${GREEN}[11/11] 初始化数据库...${NC}"
echo -e "${YELLOW}请输入 MySQL root 密码 (如未设置,直接按回车):${NC}"
read -s mysql_password

if [ -z "$mysql_password" ]; then
    # 尝试无密码连接
    mysql -u root << EOF
CREATE DATABASE IF NOT EXISTS daoguan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
else
    # 有密码连接
    mysql -u root -p"$mysql_password" << EOF
CREATE DATABASE IF NOT EXISTS daoguan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
fi

# 导入数据库结构
if [ -f "database/schema.sql" ]; then
    if [ -z "$mysql_password" ]; then
        mysql -u root daoguan_db < database/schema.sql
    else
        mysql -u root -p"$mysql_password" daoguan_db < database/schema.sql
    fi
    echo -e "${GREEN}数据库结构导入完成${NC}"
else
    echo -e "${YELLOW}未找到 database/schema.sql,跳过数据库导入${NC}"
fi

# 使用 PM2 启动应用
echo -e "${GREEN}启动应用...${NC}"
pm2 delete $SERVICE_NAME 2>/dev/null || true
pm2 start src/app.js --name $SERVICE_NAME
pm2 save
pm2 startup

# 配置 Nginx 反向代理
echo -e "${GREEN}配置 Nginx...${NC}"

# 获取服务器 IP (用于默认配置)
SERVER_IP=$(hostname -I | awk '{print $1}')

cat > /etc/nginx/sites-available/$SERVICE_NAME << EOF
server {
    listen 80;
    server_name $SERVER_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$SERVICE_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t && systemctl reload nginx

echo -e "${GREEN}=========================================="
echo -e "  部署完成!"
echo -e "=========================================="
echo -e "${GREEN}服务状态:${NC}"
pm2 status
echo -e ""
echo -e "${GREEN}访问地址: http://$SERVER_IP${NC}"
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
echo -e "  4. 更新 Nginx 配置中的 server_name 为你的域名"
echo -e "=========================================="
