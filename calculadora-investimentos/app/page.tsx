'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Button } from './components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'

interface InvestmentData {
  name: string
  value: number
  rate: number
  irTaxFree: boolean
  custodyFee?: number
}

interface Rates {
  selic: number
  cdi: number
  ipca: number
  tr: number
  tesouroPrefixado: number
  tesouroCustodia: number
  tesouroIPCA: number
  fundoDIAdmin: number
  cdbRentabilidade: number
  fundoDIRentabilidade: number
  lciLcaRentabilidade: number
  poupancaRentabilidade: number
}

export default function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('1000')
  const [monthlyInvestment, setMonthlyInvestment] = useState('50')
  const [period, setPeriod] = useState('9')
  const [showChart, setShowChart] = useState(false)
  
  // Valores iniciais baseados na imagem
  const [rates, setRates] = useState<Rates>({
    selic: 14.90,
    cdi: 14.90,
    ipca: 4.10,
    tr: 0.1723,
    tesouroPrefixado: 14.00,
    tesouroCustodia: 0.20,
    tesouroIPCA: 6.50,
    fundoDIAdmin: 0.25,
    cdbRentabilidade: 100,
    fundoDIRentabilidade: 98.17,
    lciLcaRentabilidade: 85,
    poupancaRentabilidade: 0.6732
  })

  const totalInvested = parseFloat(initialInvestment) + (parseFloat(monthlyInvestment) * parseFloat(period))

  // Cálculo de imposto de renda com tabela regressiva
  const calculateIRRate = (months: number): number => {
    if (months < 6) return 22.5
    if (months < 12) return 20.0
    if (months < 24) return 17.5
    return 15.0
  }

  const calculateInvestment = (
    principal: number, 
    monthlyContribution: number, 
    months: number, 
    annualRate: number,
    irTaxFree: boolean = false,
    custodyFee: number = 0
  ): number => {
    const monthlyRate = annualRate / 100 / 12
    const monthlyCustodyFee = custodyFee / 100 / 12
    let total = principal
    let totalContributions = principal
    
    for (let i = 1; i <= months; i++) {
      total = total * (1 + monthlyRate - monthlyCustodyFee) + monthlyContribution
      totalContributions += monthlyContribution
    }
    
    // Aplicar imposto de renda se não for isento
    if (!irTaxFree && total > totalContributions) {
      const gains = total - totalContributions
      const irRate = calculateIRRate(months) / 100
      const irTax = gains * irRate
      total = total - irTax
    }
    
    return total
  }

  // Calcular taxas efetivas baseadas nos indicadores
  const effectiveRates = {
    lciLca: (rates.cdi * rates.lciLcaRentabilidade) / 100,
    cdb: (rates.cdi * rates.cdbRentabilidade) / 100,
    tesouroSelic: rates.selic - rates.tesouroCustodia,
    tesouroIPCA: rates.ipca + rates.tesouroIPCA,
    fundoDI: (rates.cdi * rates.fundoDIRentabilidade) / 100 - rates.fundoDIAdmin,
    poupanca: rates.poupancaRentabilidade * 12 // Convertendo mensal para anual
  }

  const investments: InvestmentData[] = [
    { 
      name: 'LCI e LCA', 
      value: calculateInvestment(
        parseFloat(initialInvestment), 
        parseFloat(monthlyInvestment), 
        parseFloat(period), 
        effectiveRates.lciLca,
        true // Isento de IR
      ), 
      rate: effectiveRates.lciLca,
      irTaxFree: true
    },
    { 
      name: 'CDB', 
      value: calculateInvestment(
        parseFloat(initialInvestment), 
        parseFloat(monthlyInvestment), 
        parseFloat(period), 
        effectiveRates.cdb
      ), 
      rate: effectiveRates.cdb,
      irTaxFree: false
    },
    { 
      name: 'Tesouro Selic', 
      value: calculateInvestment(
        parseFloat(initialInvestment), 
        parseFloat(monthlyInvestment), 
        parseFloat(period), 
        effectiveRates.tesouroSelic,
        false,
        rates.tesouroCustodia
      ), 
      rate: effectiveRates.tesouroSelic,
      irTaxFree: false,
      custodyFee: rates.tesouroCustodia
    },
    { 
      name: 'Tesouro IPCA+', 
      value: calculateInvestment(
        parseFloat(initialInvestment), 
        parseFloat(monthlyInvestment), 
        parseFloat(period), 
        effectiveRates.tesouroIPCA,
        false,
        rates.tesouroCustodia
      ), 
      rate: effectiveRates.tesouroIPCA,
      irTaxFree: false,
      custodyFee: rates.tesouroCustodia
    },
    { 
      name: 'Fundo DI', 
      value: calculateInvestment(
        parseFloat(initialInvestment), 
        parseFloat(monthlyInvestment), 
        parseFloat(period), 
        effectiveRates.fundoDI
      ), 
      rate: effectiveRates.fundoDI,
      irTaxFree: false
    },
    { 
      name: 'Poupança', 
      value: calculateInvestment(
        parseFloat(initialInvestment), 
        parseFloat(monthlyInvestment), 
        parseFloat(period), 
        effectiveRates.poupanca,
        true // Isento de IR
      ), 
      rate: effectiveRates.poupanca,
      irTaxFree: true
    }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleRateChange = (field: keyof Rates, value: string) => {
    const numValue = parseFloat(value) || 0
    setRates(prev => ({ ...prev, [field]: numValue }))
  }

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  // Preparar dados para o gráfico com valores formatados
  const chartData = investments.map(inv => ({
    ...inv,
    valueFormatted: formatCurrency(inv.value)
  }))

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Qual aplicação rende mais?
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card de Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Investimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="initial">Investimento Inicial (R$)</Label>
                <Input
                  id="initial"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="monthly">Investimento Mensal (R$)</Label>
                <Input
                  id="monthly"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="period">Período (meses)</Label>
                <Input
                  id="period"
                  type="number"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="pt-4 border-t">
                <p className="text-lg font-semibold">
                  Total Investido: {formatCurrency(totalInvested)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card de Taxas */}
          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Taxa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Taxas de Referência</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="selic" className="text-xs">Livre da inflação (a.a.)</Label>
                      <Input
                        id="selic"
                        type="number"
                        step="0.01"
                        value={rates.selic}
                        onChange={(e) => handleRateChange('selic', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cdi" className="text-xs">CDI (a.a.)</Label>
                      <Input
                        id="cdi"
                        type="number"
                        step="0.01"
                        value={rates.cdi}
                        onChange={(e) => handleRateChange('cdi', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ipca" className="text-xs">IPCA (a.a.)</Label>
                      <Input
                        id="ipca"
                        type="number"
                        step="0.01"
                        value={rates.ipca}
                        onChange={(e) => handleRateChange('ipca', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tr" className="text-xs">TR (a.m.)</Label>
                      <Input
                        id="tr"
                        type="number"
                        step="0.0001"
                        value={rates.tr}
                        onChange={(e) => handleRateChange('tr', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rentabilidade</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="cdbRentabilidade" className="text-xs">CDB (% CDI)</Label>
                      <Input
                        id="cdbRentabilidade"
                        type="number"
                        step="0.01"
                        value={rates.cdbRentabilidade}
                        onChange={(e) => handleRateChange('cdbRentabilidade', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fundoDIRentabilidade" className="text-xs">Fundo DI (% CDI)</Label>
                      <Input
                        id="fundoDIRentabilidade"
                        type="number"
                        step="0.01"
                        value={rates.fundoDIRentabilidade}
                        onChange={(e) => handleRateChange('fundoDIRentabilidade', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lciLcaRentabilidade" className="text-xs">LCI/LCA (% CDI)</Label>
                      <Input
                        id="lciLcaRentabilidade"
                        type="number"
                        step="0.01"
                        value={rates.lciLcaRentabilidade}
                        onChange={(e) => handleRateChange('lciLcaRentabilidade', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="poupancaRentabilidade" className="text-xs">Poupança (a.m.)</Label>
                      <Input
                        id="poupancaRentabilidade"
                        type="number"
                        step="0.0001"
                        value={rates.poupancaRentabilidade}
                        onChange={(e) => handleRateChange('poupancaRentabilidade', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Resultados */}
          <Card>
            <CardHeader>
              <CardTitle>Melhores Opções de Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investments.map((inv, index) => (
                  <div key={inv.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: colors[index] }}
                      />
                      <span className="font-medium">{inv.name}</span>
                      {inv.irTaxFree && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Isento IR
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {formatCurrency(inv.value)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {inv.rate.toFixed(2)}% a.a.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setShowChart(!showChart)}
                className="w-full mt-4"
                size="lg"
              >
                {showChart ? 'Ocultar Gráfico' : 'Ver Gráfico'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* GRÁFICO DE BARRAS - SEMPRE VISÍVEL */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center text-gray-800">
              🎯 Rentabilidade Final por Investimento
            </CardTitle>
            <p className="text-center text-gray-600 text-sm">
              Comparativo do valor final acumulado de cada investimento após {period} meses
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 40, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#374151', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#374151', fontSize: 12 }}
                    tickFormatter={(value) => `R$${value.toLocaleString('pt-BR')}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Valor Final']}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                  >
                    <LabelList 
                      dataKey="valueFormatted"
                      position="center"
                      style={{ 
                        fill: '#ffffff', 
                        fontWeight: 'bold', 
                        fontSize: '12px',
                        textAnchor: 'middle'
                      }}
                    />
                    {investments.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Indicadores Rápidos */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
              {investments.map((inv, index) => (
                <div 
                  key={inv.name}
                  className="text-center p-3 rounded-lg border-2"
                  style={{ 
                    borderColor: colors[index],
                    backgroundColor: `${colors[index]}10`
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <p className="text-xs font-semibold text-gray-700">{inv.name}</p>
                  <p className="text-sm font-bold" style={{ color: colors[index] }}>
                    {formatCurrency(inv.value)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {((inv.value - totalInvested) / totalInvested * 100).toFixed(1)}% retorno
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Linhas (opcional) */}
        {showChart && (
          <Card>
            <CardHeader>
              <CardTitle>Evolução dos Investimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <p className="text-center text-gray-500">
                  Gráfico de evolução temporal (pode ser implementado)
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}