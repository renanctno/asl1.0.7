# 📁 Assets e Recursos

## 🖼️ Imagens e Ícones

### Logo
- **Caminho**: `public/logo.svg`
- **Formato**: SVG
- **Uso**: Header da aplicação, favicon, meta tags

### Ícones da Aplicação
- **Biblioteca**: Lucide React
- **Instalação**: `npm install lucide-react`
- **Uso**: Componentes de UI interativos

## 🎨 Cores e Design System

### Paleta de Cores
```css
/* Cores Primárias */
--primary: 222.2 84% 4.9%;
--primary-foreground: 210 40% 98%;

/* Cores de Fundo */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;

/* Cores de Investimentos */
--lci-lca: #10b981;    /* Verde */
--cdb: #3b82f6;         /* Azul */
--tesouro-selic: #f59e0b; /* Laranja */
--fundo-di: #ef4444;     /* Vermelho */
--tesouro-ipca: #8b5cf6;  /* Roxo */
--poupanca: #06b6d4;     /* Ciano */
```

### Tipografia
```css
/* Fontes */
--font-geist-sans: "Geist Sans", sans-serif;
--font-geist-mono: "Geist Mono", monospace;

/* Tamanhos */
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
```

## 📊 Gráficos e Visualizações

### Recharts Configuration
```typescript
// Configuração padrão dos gráficos
const chartConfig = {
  colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  margin: { top: 5, right: 30, left: 20, bottom: 5 },
  responsive: true,
  maintainAspectRatio: false
}
```

### Tipos de Gráficos
- **LineChart**: Evolução temporal dos investimentos
- **ResponsiveContainer**: Adaptação a diferentes telas
- **Tooltip**: Informações detalhadas on hover
- **Legend**: Identificação dos investimentos

## 🔧 Componentes Reutilizáveis

### Card Component
```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
}
```

### Input Component
```typescript
interface InputProps {
  id: string
  type: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  step?: string
  className?: string
}
```

### Button Component
```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}
```

## 📱 Assets Responsivos

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
  .grid-cols-1 { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .grid-cols-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Desktop */
@media (min-width: 1025px) {
  .grid-cols-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

### Imagens Otimizadas
- **Formato**: WebP (quando suportado)
- **Tamanhos**: Múltiplos tamanhos para diferentes densidades
- **Lazy Loading**: Carregamento sob demanda
- **Placeholders**: Placeholder skeleton durante carregamento

## 🎯 Assets de Investimento

### Ícones Específicos
```typescript
// Investimentos isentos de IR
const taxFreeIcon = (
  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
    Isento IR
  </div>
)

// Indicadores de performance
const performanceIcon = (value: number) => (
  <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
    {value > 0 ? '↗' : '↘'}
  </span>
)
```

### Cores de Investimento
```typescript
const investmentColors = {
  'LCI e LCA': '#10b981',
  'CDB': '#3b82f6',
  'Tesouro Selic': '#f59e0b',
  'Fundo DI': '#ef4444',
  'Tesouro IPCA+': '#8b5cf6',
  'Poupança': '#06b6d4'
}
```

## 📄 Documentação

### Manuais
- **Guia de Uso**: `docs/README.md`
- **Arquitetura**: `docs/architecture.md`
- **Deploy**: `docs/deployment.md`
- **Changelog**: `docs/CHANGELOG.md`

### Exemplos
- **WebSocket**: `docs/examples/websocket/`
- **Frontend**: `docs/examples/frontend.tsx`
- **Backend**: `docs/examples/server.ts`

## 🔍 SEO Assets

### Meta Tags
```html
<!-- Open Graph -->
<meta property="og:title" content="Calculadora de Investimentos">
<meta property="og:description" content="Simule e compare investimentos">
<meta property="og:image" content="/og-image.png">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Calculadora de Investimentos">
<meta name="twitter:image" content="/twitter-image.png">
```

### Favicon
- **Caminho**: `public/favicon.ico`
- **Tamanhos**: 16x16, 32x32, 48x48, 64x64
- **Formato**: ICO com múltiplos tamanhos

## 📊 Performance Assets

### Bundle Optimization
```javascript
// Code splitting dinâmico
const ChartComponent = dynamic(() => import('./Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
})
```

### Image Optimization
```typescript
// Next.js Image component
<Image
  src="/logo.svg"
  alt="Calculadora de Investimentos"
  width={120}
  height={32}
  priority
/>
```

## 🎨 Animações e Transições

### Framer Motion
```typescript
// Transições suaves
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

// Slide animations
const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 }
}
```

### CSS Animations
```css
/* Tailwind animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
```

## 📁 Estrutura Final

```
assets/
├── 🖼️ images/
│   ├── logo.svg
│   ├── favicon.ico
│   ├── og-image.png
│   └── twitter-image.png
├── 🎨 icons/
│   ├── investment-icons.svg
│   └── ui-icons.svg
├── 📊 charts/
│   ├── chart-config.js
│   └── color-schemes.js
├── 📱 responsive/
│   ├── breakpoints.css
│   └── grid-system.css
└── 🎯 seo/
    ├── meta-tags.html
    └── structured-data.json
```

---

**Última atualização: 03/12/2024**