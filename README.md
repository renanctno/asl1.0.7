# 📊 Calculadora de Investimentos

Uma calculadora completa de investimentos desenvolvida em Next.js 15 com TypeScript, permitindo simulação detalhada de diferentes tipos de investimentos com cálculo de imposto de renda e comparação de rentabilidade.

## ✨ Funcionalidades

### 🎯 Principais Recursos
- **Simulação Completa**: 6 tipos de investimentos (LCI/LCA, CDB, Tesouro Selic, Tesouro IPCA+, Fundo DI, Poupança)
- **Cálculo de Imposto de Renda**: Tabela regressiva automática (22,5% → 15%)
- **Taxa de Custódia**: 0,2% a.a. para Tesouro Direto
- **Ganho Real**: Cálculo descontando inflação (IPCA)
- **Interface Responsiva**: Design mobile-first com Tailwind CSS
- **Gráficos Interativos**: Visualização com Recharts
- **Tabela Detalhada**: Valores brutos, líquidos, IR e rentabilidades

### 📊 Indicadores Editáveis
- **Taxas de Referência**: Selic, CDI, IPCA, TR
- **Tesouro Direto**: Juros prefixados, IPCA+, taxas de custódia
- **Rentabilidade**: % CDI para cada investimento
- **Parâmetros**: Investimento inicial, aportes mensais, período

### 💡 Cálculos Financeiros
- **Imposto de Renda Regressivo**:
  - Até 6 meses: 22,5%
  - 6-12 meses: 20,0%
  - 12-24 meses: 17,5%
  - +24 meses: 15,0%
- **Isenções**: LCI, LCA e Poupança
- **Inflação**: Cálculo de ganho real vs IPCA

## 🚀 Tecnologias

### Core Stack
- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Charts**: Recharts

### Development
- **Package Manager**: npm
- **Linting**: ESLint + Next.js config
- **Build**: Next.js optimized build
- **Deploy**: Vercel ready

## 📁 Estrutura do Projeto

```
calculadora-investimentos/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 layout.tsx          # Layout principal
│   │   ├── 📄 page.tsx            # Calculadora
│   │   ├── 📄 globals.css         # Estilos globais
│   │   └── 📁 api/               # Rotas API
│   ├── 📁 components/
│   │   └── 📁 ui/                # Componentes shadcn/ui
│   ├── 📁 hooks/                 # Hooks personalizados
│   └── 📁 lib/                   # Utilitários
├── 📁 config/
│   └── 📁 prisma/                 # Schema do banco
├── 📁 docs/                      # Documentação
├── 📁 public/                    # Arquivos estáticos
├── 📁 scripts/                   # Scripts de deploy
├── 📄 package.json               # Dependências
├── 📄 next.config.ts             # Config Next.js
├── 📄 tailwind.config.ts         # Config Tailwind
├── 📄 tsconfig.json              # Config TypeScript
└── 📄 README.md                  # Este arquivo
```

## 🛠️ Instalação e Setup

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar repositório
git clone <repository-url>
cd calculadora-investimentos

# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento (localhost:3000)
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código
```

## 📱 Como Usar

### 1. Configurar Parâmetros
- **Investimento Inicial**: Valor inicial aplicado
- **Investimento Mensal**: Aportes mensais recorrentes
- **Período**: Duração em meses

### 2. Ajustar Taxas
- **Taxas de Referência**: Selic, CDI, IPCA, TR
- **Rentabilidade**: % CDI para cada investimento
- **Tesouro Direto**: Taxas de juros e custódia

### 3. Analisar Resultados
- **Ranking**: Opções ordenadas por rentabilidade
- **Gráfico**: Evolução temporal dos investimentos
- **Tabela Detalhada**: Valores brutos, líquidos, IR

### 4. Simulação Completa
Clique em **"Ver Simulação"** para acessar:
- Gráfico de evolução
- Tabela com cálculos detalhados
- Informações sobre impostos e taxas

## 🎨 Interface

### Design Responsivo
- **Mobile**: Layout de uma coluna
- **Tablet**: Duas colunas
- **Desktop**: Três colunas otimizadas

### Cores e Tema
- **Cores Coordenadas**: Cada investimento tem sua cor
- **Tema Claro**: Fundo branco com texto escuro
- **Feedback Visual**: Indicadores de IR isento, ganhos/perdas

## 📊 Investimentos Disponíveis

### Isentos de IR
- **LCI e LCA**: Letras de Crédito Imobiliário/Agronegócio
- **Poupança**: Caderneta de poupança tradicional

### Tributáveis
- **CDB**: Certificado de Depósito Bancário
- **Tesouro Selic**: Título público pós-fixado
- **Tesouro IPCA+**: Título público indexado à inflação
- **Fundo DI**: Fundo de investimento referenciado em DI

## 🚀 Deploy

### Vercel (Recomendado)
1. Conectar repositório ao Vercel
2. Configurar variáveis de ambiente (se necessário)
3. Deploy automático

### Outras Plataformas
```bash
# Build para produção
npm run build

# Iniciar servidor
npm start
```

## 🔧 Configuração

### Variáveis de Ambiente
O projeto não requer variáveis de ambiente obrigatórias.

### Build Configuration
- **Framework**: Next.js 15
- **Output**: Static + Server Components
- **Node Version**: 18+
- **Build Command**: `npm run build`

## 📈 Performance

### Otimizações
- **Code Splitting**: Automático do Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Build otimizado
- **Static Generation**: Páginas estáticas quando possível

### Metrics
- **First Load JS**: ~220KB
- **Build Time**: ~11 segundos
- **Page Size**: Otimizado para mobile

## 🤝 Contribuição

### Como Contribuir
1. Fork do repositório
2. Feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push (`git push origin feature/nova-funcionalidade`)
5. Pull Request

### Diretrizes
- Seguir padrões de código TypeScript
- Utilizar componentes shadcn/ui
- Manter responsividade
- Testar em diferentes dispositivos

## 📝 Licença

Este projeto está licenciado sob a MIT License.

## 🆘 Suporte

### Issues
Reportar bugs e solicitar features através do GitHub Issues.

### Contato
- **Repository**: [GitHub Repository]
- **Deploy**: [Vercel App]

---

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Integração com APIs de mercado financeiro
- [ ] Histórico de simulações
- [ ] Exportação de resultados (PDF/Excel)
- [ ] Modo escuro
- [ ] Investimentos internacionais
- [ ] Calculadora de aposentadoria

### Melhorias
- [ ] Animações avançadas
- [ ] Dashboard administrativo
- [ ] API para integração externa
- [ ] Testes automatizados
- [ ] Documentação API

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Tailwind CSS**