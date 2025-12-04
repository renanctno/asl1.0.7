# 🚀 Guia de Deploy

## 📋 Pré-requisitos

### Ambiente de Desenvolvimento
- **Node.js**: 18.0.0 ou superior
- **npm**: 8.0.0 ou superior
- **Git**: Controle de versão
- **Editor**: VS Code (recomendado)

### Contas Necessárias
- **GitHub**: Repositório de código
- **Vercel**: Plataforma de deploy
- **Opcional**: Domínio personalizado

## 🔧 Configuração do Projeto

### 1. Clonar Repositório
```bash
git clone <repository-url>
cd calculadora-investimentos
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env.local
cp .env.example .env.local

# Editar variáveis
nano .env.local
```

### 4. Testar Localmente
```bash
npm run dev
# Acessar http://localhost:3000
```

## 🚀 Deploy na Vercel

### Método 1: GitHub Integration (Recomendado)

#### 1. Conectar Repositório
1. Acessar [vercel.com](https://vercel.com)
2. Fazer login com GitHub
3. Clicar em "New Project"
4. Selecionar repositório `calculadora-investimentos`

#### 2. Configurar Build
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

#### 3. Variáveis de Ambiente
```bash
# Adicionar no Vercel Dashboard
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

#### 4. Deploy
- Clicar em "Deploy"
- Aguardar build completion
- Testar aplicação

### Método 2: Vercel CLI

#### 1. Instalar Vercel CLI
```bash
npm i -g vercel
```

#### 2. Fazer Login
```bash
vercel login
```

#### 3. Deploy
```bash
vercel --prod
```

#### 4. Configurar Domínio (Opcional)
```bash
vercel domains add seu-dominio.com
```

## 🐳 Deploy com Docker

### 1. Criar Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Build e Push
```bash
# Build da imagem
docker build -t calculator-app .

# Tag para registry
docker tag calculator-app seu-registry/calculator-app

# Push
docker push seu-registry/calculator-app
```

### 3. Deploy
```bash
# Run em produção
docker run -p 3000:3000 calculator-app
```

## 🔄 CI/CD Pipeline

### GitHub Actions

#### 1. Criar Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

#### 2. Configurar Secrets no GitHub
- `VERCEL_TOKEN`: Token de API da Vercel
- `ORG_ID`: ID da organização Vercel
- `PROJECT_ID`: ID do projeto Vercel

## 🔍 Monitoramento e Logs

### Vercel Dashboard
- **URL**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Métricas**: Tráfego, performance, erros
- **Logs**: Build logs e runtime logs
- **Analytics**: Page views e user behavior

### Logs Locais
```bash
# Development logs
tail -f dev.log

# Production logs
vercel logs

# Build logs
npm run build 2>&1 | tee build.log
```

### Performance Monitoring
```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse https://seu-dominio.vercel.app --output html

# WebPageTest
npx wpb https://seu-dominio.vercel.app
```

## 🔧 Configurações Avançadas

### Custom Domain
```bash
# Adicionar domínio personalizado
vercel domains add seu-dominio.com

# Configurar DNS
# Tipo: CNAME
# Nome: @
# Valor: cname.vercel-dns.com
```

### SSL Certificate
```bash
# SSL automático pela Vercel
# Certificado wildcard incluído
# Renovação automática
```

### Edge Functions
```typescript
// api/edge-function.ts
export const config = {
  runtime: 'edge',
}

export default function handler(request: Request) {
  // Edge logic
}
```

## 📊 Performance Optimization

### Build Optimization
```javascript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}
```

### Cache Strategy
```typescript
// pages/api/investment-rates.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  // API logic
}
```

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Limpar cache
rm -rf .next
npm run build

# Verificar dependências
npm audit
npm audit fix
```

#### Runtime Errors
```bash
# Verificar logs
vercel logs

# Debug localmente
npm run build && npm start
```

#### Performance Issues
```bash
# Analisar bundle
npm install @next/bundle-analyzer
npx next-bundle-analyzer

# Otimizar imagens
npx next-optimized-images
```

### Debug Mode
```bash
# Habilitar debug
DEBUG=* npm run dev

# Verbose logs
npm run build --debug
```

## 📋 Checklist de Deploy

### Pre-Deploy
- [ ] Código atualizado no main branch
- [ ] Testes passando
- [ ] Build local funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Performance otimizada
- [ ] SEO configurado

### Post-Deploy
- [ ] Aplicação acessível
- [ ] Funcionalidades testadas
- [ ] Performance verificada
- [ ] Logs monitorados
- [ ] Backup criado
- [ ] Documentação atualizada

### Monitoring
- [ ] Uptime monitoring
- [ ] Performance alerts
- [ ] Error tracking
- [ ] Analytics configurados
- [ ] Security scans

---

## 📞 Suporte

### Recursos
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **GitHub Issues**: Reportar problemas

### Contato
- **Email**: support@seu-dominio.com
- **Discord**: Comunidade de desenvolvimento
- **Documentation**: `/docs` folder

---

**Última atualização: 03/12/2024**