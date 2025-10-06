# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- TON wallet with testnet/mainnet TON
- Telegram Bot Token
- Server with public IP (for production)

## Local Development

1. **Clone and Install**
   ```bash
   git clone https://github.com/https-panacea-icono-org/verell-in-public.git
   cd verell-in-public
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Smart Contract Deployment

### Deploy Escrow Contract

1. **Compile Contract**
   ```bash
   # For FunC
   func -o escrow.fif contracts/escrow.fc
   
   # For Tact
   tact contracts/escrow.tact
   ```

2. **Deploy to Testnet**
   ```bash
   # Use TON SDK or ton-cli
   ton-cli deploy escrow.fif
   ```

3. **Verify Deployment**
   ```bash
   ton-cli account <contract-address>
   ```

## Production Deployment

### Option 1: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t verell-dex .
   docker run -d -p 3000:3000 --env-file .env verell-dex
   ```

### Option 2: PM2

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem.config.js**
   ```javascript
   module.exports = {
     apps: [{
       name: 'verell-dex',
       script: 'dist/index.js',
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

3. **Start Application**
   ```bash
   npm run build
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Option 3: Cloud Platforms

#### Heroku

1. **Create Heroku App**
   ```bash
   heroku create verell-dex
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   heroku config:set TON_NETWORK=mainnet
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

#### AWS EC2

1. **Launch EC2 Instance** (t2.small or larger)

2. **Install Dependencies**
   ```bash
   ssh ec2-user@your-instance
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and Setup**
   ```bash
   git clone https://github.com/https-panacea-icono-org/verell-in-public.git
   cd verell-in-public
   npm install
   cp .env.example .env
   # Edit .env
   npm run build
   ```

4. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name verell-dex
   pm2 startup
   pm2 save
   ```

#### DigitalOcean

1. **Create Droplet** (Ubuntu 22.04, 1GB RAM+)

2. **Setup Application** (same as AWS EC2)

3. **Configure Firewall**
   ```bash
   sudo ufw allow 3000/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

## Telegram Bot Setup

1. **Create Bot**
   - Message [@BotFather](https://t.me/botfather)
   - Send `/newbot`
   - Follow instructions
   - Save bot token

2. **Configure Webhook (Optional)**
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yourdomain.com/webhook"
   ```

3. **Set Bot Commands**
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setMyCommands" \
   -H "Content-Type: application/json" \
   -d '{
     "commands": [
       {"command": "start", "description": "Start the bot"},
       {"command": "help", "description": "Show help"},
       {"command": "buy", "description": "Create buy order"},
       {"command": "sell", "description": "Create sell order"},
       {"command": "orders", "description": "View orders"},
       {"command": "mytrades", "description": "View your trades"},
       {"command": "wallet", "description": "Manage wallet"}
     ]
   }'
   ```

## Database Setup (Optional)

For persistent storage, integrate PostgreSQL or MongoDB:

1. **Install PostgreSQL**
   ```bash
   sudo apt-get install postgresql
   ```

2. **Create Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE verell;
   CREATE USER verell_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE verell TO verell_user;
   ```

3. **Update .env**
   ```env
   DATABASE_URL=postgresql://verell_user:secure_password@localhost:5432/verell
   ```

## Monitoring

### Health Checks

```bash
curl http://localhost:3000/health
```

### PM2 Monitoring

```bash
pm2 monit
pm2 logs verell-dex
```

### Log Management

```bash
# View logs
pm2 logs

# Clear logs
pm2 flush

# Rotate logs
pm2 install pm2-logrotate
```

## SSL/HTTPS Setup

### Using Let's Encrypt

1. **Install Certbot**
   ```bash
   sudo apt-get install certbot
   ```

2. **Get Certificate**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. **Configure Nginx Reverse Proxy**
   ```nginx
   server {
     listen 443 ssl;
     server_name yourdomain.com;
     
     ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

## Security Checklist

- [ ] Environment variables properly set
- [ ] Firewall configured
- [ ] SSL certificate installed
- [ ] Regular backups configured
- [ ] Monitoring and alerting setup
- [ ] Rate limiting enabled
- [ ] Admin access restricted
- [ ] Private keys secured
- [ ] Database credentials rotated

## Troubleshooting

### Bot Not Responding

1. Check bot token is correct
2. Verify network connectivity
3. Check PM2/Docker logs
4. Test with `/start` command

### Blockchain Connection Issues

1. Verify TON_NETWORK setting
2. Check API endpoint availability
3. Validate wallet addresses
4. Test with testnet first

### Performance Issues

1. Monitor CPU/Memory usage
2. Check for memory leaks
3. Optimize database queries
4. Scale horizontally if needed

## Backup and Recovery

### Backup Strategy

```bash
# Backup configuration
tar -czf verell-backup-$(date +%Y%m%d).tar.gz .env contracts/

# Backup database (if used)
pg_dump verell > verell-db-$(date +%Y%m%d).sql
```

### Recovery

```bash
# Restore configuration
tar -xzf verell-backup-YYYYMMDD.tar.gz

# Restore database
psql verell < verell-db-YYYYMMDD.sql
```

## Maintenance

### Updates

```bash
git pull origin main
npm install
npm run build
pm2 restart verell-dex
```

### Health Monitoring

Set up automated health checks:
```bash
# Crontab
*/5 * * * * curl -f http://localhost:3000/health || pm2 restart verell-dex
```

## Support

For deployment issues:
- Check logs: `pm2 logs verell-dex`
- Review documentation
- Open GitHub issue
- Contact support team
