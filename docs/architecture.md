# 🏗️ Arquitetura do Projeto

## 📁 Estrutura de Pastas

```
calculadora-investimentos/
├── 📁 src/                        # Código fonte
│   ├── 📁 app/                    # App Router Next.js 15
│   │   ├── 📄 layout.tsx         # Layout principal com metadata
│   │   ├── 📄 page.tsx           # Página principal da calculadora
│   │   ├── 📄 globals.css        # Estilos globais Tailwind
│   │   └── 📁 api/              # Rotas da API
│   │       └── 📄 route.ts        # API routes genéricas
│   ├── 📁 components/             # Componentes React
│   │   └── 📁 ui/                # Biblioteca shadcn/ui
│   │       ├── 📄 button.tsx      # Botões estilizados
│   │       ├── 📄 card.tsx        # Cards container
│   │       ├── 📄 input.tsx       # Campos de formulário
│   │       ├── 📄 label.tsx       # Labels de formulário
│   │       └── 📄 [40+] outros    # Componentes UI
│   ├── 📁 hooks/                  # Hooks personalizados
│   │   ├── 📄 use-mobile.ts      # Detecção mobile
│   │   └── 📄 use-toast.ts       # Sistema de notificações
│   └── 📁 lib/                   # Utilitários e configurações
│       ├── 📄 utils.ts           # Funções utilitárias
│       └── 📄 db.ts             # Configuração do banco
├── 📁 config/                    # Arquivos de configuração
│   └── 📁 prisma/               # Schema e migrations
│       ├── 📄 schema.prisma     # Modelo de dados
│       └── 📁 migrations/        # Histórico de alterações
├── 📁 docs/                      # Documentação do projeto
│   ├── 📄 README.md              # Guia de uso
│   ├── 📄 deployment.md          # Scripts de deploy
│   └── 📁 examples/              # Exemplos de código
│       ├── 📄 websocket/         # Exemplo WebSocket
│       └── 📄 frontend.tsx       # Exemplo frontend
├── 📁 public/                    # Arquivos estáticos
│   ├── 📄 logo.svg              # Logo da aplicação
│   ├── 📄 robots.txt            # SEO robots
│   └── 📁 images/               # Imagens estáticas
├── 📁 scripts/                   # Scripts de automação
│   └── 📄 Caddyfile             # Configuração Caddy server
├── 📄 package.json               # Dependências e scripts
├── 📄 next.config.ts             # Configuração Next.js
├── 📄 tailwind.config.ts         # Configuração Tailwind CSS
├── 📄 tsconfig.json              # Configuração TypeScript
├── 📄 components.json            # Configuração shadcn/ui
├── 📄 vercel.json               # Configuração deploy Vercel
├── 📄 eslint.config.mjs          # Configuração ESLint
├── 📄 postcss.config.mjs         # Configuração PostCSS
└── 📄 README.md                  # Documentação principal
```

## 🏛️ Arquitetura de Componentes

### Hierarquia Principal
```
App Layout (layout.tsx)
└── Calculator Page (page.tsx)
    ├── Parameters Card
    │   ├── Initial Investment Input
    │   ├── Monthly Investment Input
    │   └── Period Input
    ├── Rates Card
    │   ├── Reference Rates
    │   ├── Treasury Rates
    │   └── Profitability Rates
    ├── Results Card
    │   ├── Investment Ranking
    │   ├── Important Info
    │   └── Simulation Button
    ├── Chart (Conditional)
    │   └── Line Chart with Recharts
    └── Detailed Table (Conditional)
        ├── Investment Details
        ├── Summary Footer
        └── Explanation Legend
```

### Componentes Reutilizáveis
- **Card**: Container para seções
- **Input**: Campos de formulário controlados
- **Button**: Botões com diferentes variantes
- **Label**: Labels acessíveis
- **Table**: Tabelas responsivas

## 🔄 Fluxo de Dados

### State Management
```typescript
// Estado principal da calculadora
const [initialInvestment, setInitialInvestment] = useState('1000')
const [monthlyInvestment, setMonthlyInvestment] = useState('50')
const [period, setPeriod] = useState('9')
const [showChart, setShowChart] = useState(false)
const [rates, setRates] = useState<Rates>({...})
```

### Cálculos Financeiros
```typescript
// Funções principais
calculateInvestment()     // Cálculo com juros compostos
calculateIRRate()        // Alíquota regressiva de IR
calculateSimulationDetails() // Detalhes completos
generateChartData()      // Dados para o gráfico
```

### Tipagem TypeScript
```typescript
interface InvestmentData {
  name: string
  value: number
  rate: number
  irTaxFree: boolean
  custodyFee?: number
}

interface SimulationDetails {
  name: string
  investedAmount: number
  grossValue: number
  irTax: number
  netValue: number
  // ... mais campos
}
```

## 🎨 Sistema de Estilos

### Tailwind CSS Configuration
```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        // ... mais variáveis CSS
      }
    }
  }
}
```

### Design System
- **Cores Primárias**: Variáveis CSS customizadas
- **Tipografia**: Geist Sans e Geist Mono
- **Spacing**: Sistema consistente de espaçamento
- **Responsividade**: Mobile-first breakpoints

## 🚀 Performance Optimization

### Next.js Optimizations
- **Static Generation**: Páginas estáticas quando possível
- **Code Splitting**: Automático por rotas
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack Bundle Analyzer

### Component Optimization
- **React.memo**: Prevenir re-renders desnecessários
- **useMemo/useCallback**: Otimizar cálculos pesados
- **Lazy Loading**: Componentes condicionais

## 🔐 Segurança

### TypeScript
- **Strict Mode**: Verificação rigorosa de tipos
- **Interface Contracts**: Tipos bem definidos
- **Error Boundaries**: Tratamento de erros

### Next.js Security
- **CSRF Protection**: Built-in protection
- **XSS Prevention**: Sanitização automática
- **Content Security Policy**: Configuração recomendada

## 📱 Responsividade

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px) { /* ... */ }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { /* ... */ }

/* Desktop */
@media (min-width: 1025px) { /* ... */ }
```

### Layout Adaptativo
- **Mobile**: Single column layout
- **Tablet**: Two column layout
- **Desktop**: Three column optimized layout

## 🔧 Configurações de Build

### Next.js Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
}
```

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## 🧪 Testes e Qualidade

### Code Quality
- **ESLint**: Verificação de código
- **TypeScript**: Type safety
- **Prettier**: Formatação de código
- **Husky**: Git hooks

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS
- **Bundle Size**: Otimização de tamanho
- **Build Time**: Tempo de compilação
- **Runtime Performance**: Velocidade de execução