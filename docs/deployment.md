# 🚀 Scripts de Deploy

## 📋 Scripts Disponíveis

### Development
```bash
npm run dev
# Inicia servidor de desenvolvimento em localhost:3000
# Com hot reload e logs em dev.log
```

### Build
```bash
npm run build
# Compila aplicação para produção
# Otimiza e minifica arquivos
```

### Production
```bash
npm run start
# Inicia servidor de produção
# Utiliza arquivos compilados pelo build
```

### Quality
```bash
npm run lint
# Verifica qualidade do código
# Aplica regras ESLint e Next.js
```

## 🔧 Scripts de Banco de Dados

```bash
npm run db:push     # Aplica schema ao banco
npm run db:generate # Gera Prisma Client
npm run db:migrate  # Executa migrações
npm run db:reset    # Reseta banco de dados
```

## 📦 Deploy em Produção

### Vercel (Recomendado)
1. Conectar repositório ao Vercel
2. Configurar build command: `npm run build`
3. Configurar output directory: `.next`
4. Deploy automático

### Docker
```bash
# Build da imagem
docker build -t calculator-app .

# Executar container
docker run -p 3000:3000 calculator-app
```

### Manual
```bash
# Build
npm run build

# Start
npm start
```

## 📝 Variáveis de Ambiente

### Obrigatórias
- `DATABASE_URL`: URL do banco de dados (se usando Prisma)

### Opcionais
- `NEXT_PUBLIC_API_URL`: URL da API externa
- `NODE_ENV`: Ambiente (development/production)

## 🔍 Logs e Monitoramento

### Development Logs
```bash
# Logs do servidor
tail -f dev.log

# Logs de build
npm run build 2>&1 | tee build.log
```

### Production Logs
```bash
# Logs em produção
pm2 logs calculator-app

# Monitoramento
pm2 monit
```

## 🛠️ Manutenção

### Atualização de Dependências
```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar package.json
npm update

# Limpar cache
npm cache clean --force
```

### Limpeza
```bash
# Limpar build
rm -rf .next

# Limpar node_modules
rm -rf node_modules package-lock.json
npm install
```