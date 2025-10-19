# Deployment Guide

## Overview

This guide covers various deployment options for the E-Commerce Backend API.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Deployment](#local-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Production Checklist](#production-checklist)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js v18+ installed
- MongoDB instance (local, Atlas, or other cloud provider)
- Git for version control
- Access to deployment platform (if using cloud services)

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/somkheartk/ecommerce-backend.git
cd ecommerce-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGO_DB=ecommerce_prod

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=1h
```

**Important Security Notes:**
- Use a strong, random JWT_SECRET in production
- Never commit `.env` file to version control
- Use different databases for dev/staging/production

---

## Local Deployment

### Development Mode

```bash
npm run start:dev
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

The application will be available at `http://localhost:3000`

---

## Docker Deployment

### Create Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start application
CMD ["node", "dist/main.js"]
```

### Create .dockerignore

Create `.dockerignore`:

```
node_modules
dist
npm-debug.log
.env
.git
.gitignore
README.md
```

### Build Docker Image

```bash
docker build -t ecommerce-backend:latest .
```

### Run Docker Container

```bash
docker run -d \
  --name ecommerce-api \
  -p 3000:3000 \
  --env-file .env \
  ecommerce-backend:latest
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGO_URI=${MONGO_URI}
      - MONGO_DB=${MONGO_DB}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

Run with Docker Compose:

```bash
docker-compose up -d
```

---

## Cloud Deployment

### AWS EC2 Deployment

#### 1. Launch EC2 Instance

- Choose Ubuntu Server 22.04 LTS
- Instance type: t2.micro (for testing) or t2.small+ (production)
- Configure security group to allow ports 22 (SSH) and 3000 (API)

#### 2. Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 3. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 4. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

#### 5. Clone and Setup Application

```bash
git clone https://github.com/somkheartk/ecommerce-backend.git
cd ecommerce-backend
npm install
npm run build
```

#### 6. Configure Environment

```bash
nano .env
# Add your production environment variables
```

#### 7. Start with PM2

```bash
pm2 start dist/main.js --name ecommerce-api
pm2 save
pm2 startup
```

#### 8. Setup Nginx as Reverse Proxy (Optional)

```bash
sudo apt-get install nginx

# Create nginx configuration
sudo nano /etc/nginx/sites-available/ecommerce-api

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/ecommerce-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Heroku Deployment

#### 1. Install Heroku CLI

```bash
npm install -g heroku
```

#### 2. Login and Create App

```bash
heroku login
heroku create your-app-name
```

#### 3. Add Buildpack

```bash
heroku buildpacks:set heroku/nodejs
```

#### 4. Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set MONGO_DB=your-database
heroku config:set JWT_SECRET=your-jwt-secret
```

#### 5. Create Procfile

```
web: node dist/main.js
```

#### 6. Deploy

```bash
git push heroku main
```

### DigitalOcean App Platform

#### 1. Create Account and New App

- Connect your GitHub repository
- Select branch to deploy

#### 2. Configure Build Settings

- Build Command: `npm run build`
- Run Command: `node dist/main.js`

#### 3. Set Environment Variables

Add all required environment variables in the app settings.

#### 4. Deploy

Click "Deploy" and the platform will handle the rest.

### MongoDB Atlas Setup

#### 1. Create Free Cluster

- Visit https://www.mongodb.com/cloud/atlas
- Create a free M0 cluster

#### 2. Configure Network Access

- Add your application's IP address
- Or allow access from anywhere (0.0.0.0/0) for testing

#### 3. Create Database User

- Username and password for your application
- Assign read/write permissions

#### 4. Get Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

Use this as your `MONGO_URI` environment variable.

---

## Production Checklist

### Security

- [ ] Change default JWT_SECRET to a strong random string
- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Enable CORS only for trusted domains
- [ ] Set secure HTTP headers (helmet.js)
- [ ] Implement rate limiting
- [ ] Set up firewall rules
- [ ] Use environment variables for all secrets
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Performance

- [ ] Enable compression
- [ ] Set up caching (Redis)
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Enable database connection pooling
- [ ] Use CDN for static assets
- [ ] Monitor memory usage
- [ ] Set up horizontal scaling if needed

### Reliability

- [ ] Set up health check endpoint
- [ ] Configure automatic restarts (PM2, Docker)
- [ ] Set up database backups
- [ ] Implement logging
- [ ] Set up error tracking (Sentry)
- [ ] Configure monitoring and alerts
- [ ] Test disaster recovery procedures

### Configuration

- [ ] Set `NODE_ENV=production`
- [ ] Set `synchronize: false` in TypeORM config
- [ ] Configure proper database connection limits
- [ ] Set appropriate JWT expiration times
- [ ] Configure CORS properly
- [ ] Set up proper logging levels

---

## Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs ecommerce-api

# Monitor resources
pm2 monit

# View application info
pm2 info ecommerce-api
```

### Health Check Endpoint

Add to `src/app.controller.ts`:

```typescript
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
```

### Application Logging

Consider using logging libraries:

```bash
npm install winston
```

### Error Tracking

Set up Sentry for error tracking:

```bash
npm install @sentry/node
```

---

## Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check logs
pm2 logs ecommerce-api

# Common causes:
# - Missing environment variables
# - Database connection issues
# - Port already in use
```

#### Database Connection Failed

```bash
# Verify MongoDB URI
# Check network access rules
# Verify database user credentials
# Check if MongoDB service is running
```

#### Out of Memory

```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 dist/main.js

# Or in PM2
pm2 start dist/main.js --name ecommerce-api --node-args="--max-old-space-size=4096"
```

#### High CPU Usage

```bash
# Check for inefficient queries
# Add database indexes
# Enable query caching
# Consider horizontal scaling
```

### Useful Commands

```bash
# Restart application
pm2 restart ecommerce-api

# View real-time logs
pm2 logs ecommerce-api --lines 100

# Check application status
pm2 status

# Reload with zero downtime
pm2 reload ecommerce-api

# Stop application
pm2 stop ecommerce-api

# Remove from PM2
pm2 delete ecommerce-api
```

---

## Scaling

### Vertical Scaling

Upgrade server resources:
- Increase CPU cores
- Add more RAM
- Use faster storage (SSD)

### Horizontal Scaling

Multiple instances with load balancer:

```bash
# PM2 Cluster Mode
pm2 start dist/main.js -i max --name ecommerce-api
```

Configure Nginx as load balancer:

```nginx
upstream backend {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
    }
}
```

---

## Backup Strategy

### Database Backups

```bash
# Automated daily backups
0 2 * * * mongodump --uri="mongodb://..." --out=/backups/$(date +\%Y\%m\%d)
```

### Application Code

- Use Git for version control
- Tag releases
- Keep deployment scripts in version control

---

## Rollback Procedure

### PM2

```bash
# Stop current version
pm2 stop ecommerce-api

# Switch to previous version
cd /path/to/previous/version
pm2 start dist/main.js --name ecommerce-api
```

### Docker

```bash
# List available images
docker images

# Run previous version
docker run -d --name ecommerce-api ecommerce-backend:previous-tag
```

---

## Support

For deployment issues:
1. Check application logs
2. Verify environment configuration
3. Test database connectivity
4. Review deployment checklist
5. Contact team or create GitHub issue
