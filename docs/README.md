# 📚 Documentação

## 📖 Guia de Uso

### Início Rápido
1. Acesse a calculadora
2. Configure seus parâmetros de investimento
3. Ajuste as taxas conforme necessário
4. Clique em "Ver Simulação" para resultados detalhados

### Exemplos de Uso

#### Exemplo 1: Investimento Conservador
- **Inicial**: R$ 1.000
- **Mensal**: R$ 100
- **Período**: 12 meses
- **Foco**: Tesouro Selic e Poupança

#### Exemplo 2: Investimento Moderado
- **Inicial**: R$ 5.000
- **Mensal**: R$ 500
- **Período**: 24 meses
- **Foco**: CDB e LCI/LCA

#### Exemplo 3: Investimento Arrojado
- **Inicial**: R$ 10.000
- **Mensal**: R$ 1.000
- **Período**: 36 meses
- **Foco**: Fundos DI e Tesouro IPCA+

## 📊 Fórmulas de Cálculo

### Juros Compostos
```
VF = VI × (1 + i)^n + PMT × [((1 + i)^n - 1) / i]
```
- VF = Valor Final
- VI = Valor Inicial
- i = Taxa de juros mensal
- n = Número de meses
- PMT = Pagamento mensal

### Imposto de Renda
```
IR = Ganhos × Alíquota
Alíquota = 22,5% (≤6m) | 20% (6-12m) | 17,5% (12-24m) | 15% (>24m)
```

### Ganho Real
```
Ganho Real = [(1 + Rentabilidade Líquida) / (1 + Inflação)] - 1
```

## 🔧 Configuração Avançada

### Personalização de Taxas
As taxas podem ser ajustadas em tempo real:
- **Taxas de Referência**: Selic, CDI, IPCA, TR
- **Rentabilidade**: Percentual do CDI para cada investimento
- **Custos**: Taxas de administração e custódia

### Fórmulas Específicas

#### Tesouro Selic
```
Taxa Efetiva = Selic - Taxa de Custódia (0,2% a.a.)
```

#### CDB/LCI/LCA
```
Taxa Efetiva = CDI × Percentual Contratado
```

#### Tesouro IPCA+
```
Taxa Efetiva = IPCA + Juro Real + Taxa de Custódia
```

## 📋 Referências

### Fontes de Taxas
- **Banco Central**: Taxas oficiais
- **Tesouro Direto**: Títulos públicos
- **Bancos**: CDB e LCI/LCA
- **Fundos**: Informações dos administradores

### Legislação
- **Imposto de Renda**: Receita Federal
- **Poupança**: Lei nº 8.394/91
- **Tesouro Direto**: Portaria MF nº 502/2020