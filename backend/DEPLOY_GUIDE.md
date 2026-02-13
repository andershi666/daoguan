# 阿里云 ECS 部署指南

## 前提条件

1. 已购买阿里云 ECS 服务器
2. 服务器操作系统推荐: Ubuntu 20.04/22.04 或 CentOS 7/8
3. 可以通过 SSH 连接到服务器

## 快速部署步骤

### 1. 连接到服务器

```bash
# 使用 SSH 连接 (替换为你的服务器 IP 和用户名)
ssh root@your-server-ip

# 或使用非 root 用户
ssh username@your-server-ip
```

### 2. 下载部署脚本

```bash
# 进入临时目录
cd /tmp

# 下载部署脚本
wget https://raw.githubusercontent.com/andershi666/daoguan/main/backend/deploy.sh

# 或使用 curl
curl -O https://raw.githubusercontent.com/andershi666/daoguan/main/backend/deploy.sh

# 添加执行权限
chmod +x deploy.sh
```

### 3. 运行部署脚本

```bash
# 使用 root 运行部署脚本
sudo bash deploy.sh
```

部署脚本会自动完成以下操作:
- ✅ 更新系统包
- ✅ 安装 Node.js 18.x
- ✅ 安装 MySQL 数据库
- ✅ 安装 PM2 (进程管理器)
- ✅ 安装 Nginx (反向代理)
- ✅ 从 GitHub 克隆项目代码
- ✅ 安装项目依赖
- ✅ 初始化数据库
- ✅ 使用 PM2 启动应用
- ✅ 配置 Nginx 反向代理

### 4. 配置环境变量

脚本运行过程中会提示你配置 `.env` 文件,请确保配置以下参数:

```env
# 基础配置
NODE_ENV=production
PORT=3000

# 数据库配置 (根据你的 MySQL 配置填写)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=daoguan_db

# 微信小程序配置 (从微信小程序后台获取)
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret

# JWT 密钥 (请修改为随机字符串)
JWT_SECRET=your_random_secret_key_here

# 微信支付配置 (如需要)
WECHAT_MCH_ID=your_mch_id
WECHAT_PAY_KEY=your_pay_key
WECHAT_PAY_NOTIFY_URL=https://your-domain.com/api/payment/notify
```

编辑 `.env` 文件:

```bash
cd /opt/daoguan/backend
nano .env
# 或使用 vim
vim .env
```

### 5. 重启服务

```bash
# 重启应用
pm2 restart daoguan-backend

# 查看日志
pm2 logs daoguan-backend

# 查看状态
pm2 status
```

## 手动部署 (可选)

如果自动部署脚本遇到问题,可以手动执行以下步骤:

### 1. 安装 Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

### 2. 安装 MySQL

```bash
sudo apt-get update
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

### 3. 克隆项目

```bash
cd /opt
git clone https://github.com/andershi666/daoguan.git
cd daoguan/backend
npm install --production
```

### 4. 配置数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE daoguan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 导入数据库结构
mysql -u root -p daoguan_db < database/schema.sql
```

### 5. 配置环境变量

```bash
cp .env.example .env
nano .env
```

### 6. 安装 PM2 并启动

```bash
sudo npm install -g pm2
pm2 start src/app.js --name daoguan-backend
pm2 save
pm2 startup
```

### 7. 配置 Nginx

```bash
# 安装 Nginx
sudo apt-get install -y nginx

# 创建配置文件
sudo nano /etc/nginx/sites-available/daoguan-backend
```

添加以下配置:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 修改为你的域名或 IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/daoguan-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 配置 HTTPS (推荐)

使用 Let's Encrypt 免费证书:

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 自动配置 SSL
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 防火墙配置

```bash
# 开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## 常用命令

```bash
# PM2 命令
pm2 start src/app.js --name daoguan-backend    # 启动
pm2 restart daoguan-backend                    # 重启
pm2 stop daoguan-backend                       # 停止
pm2 logs daoguan-backend                       # 查看日志
pm2 status                                     # 查看状态
pm2 monit                                      # 监控

# Git 更新代码
cd /opt/daoguan
git pull origin main
cd backend
pm2 restart daoguan-backend
```

## 故障排查

### 1. 端口被占用

```bash
# 查看端口占用
sudo netstat -tulpn | grep :3000

# 杀死进程
sudo kill -9 <PID>
```

### 2. 数据库连接失败

```bash
# 检查 MySQL 状态
sudo systemctl status mysql

# 检查防火墙
sudo ufw status

# 测试连接
mysql -u root -p
```

### 3. 查看 PM2 日志

```bash
pm2 logs daoguan-backend --lines 100
pm2 flush daoguan-backend
```

### 4. 查看 Nginx 日志

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 安全建议

1. ✅ 使用 SSH 密钥登录,禁用密码登录
2. ✅ 配置防火墙,只开放必要端口
3. ✅ 定期更新系统和软件包
4. ✅ 修改默认端口 (SSH 从 22 改为其他端口)
5. ✅ 使用强密码和随机 JWT 密钥
6. ✅ 启用 HTTPS
7. ✅ 定期备份数据库

## 联系支持

如遇到问题,请检查:
1. PM2 日志: `pm2 logs daoguan-backend`
2. Nginx 日志: `/var/log/nginx/error.log`
3. 应用日志: `/opt/daoguan/backend/logs/` (如果有)
