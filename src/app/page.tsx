'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface InvestmentData {
  name: string
  value: number
  rate: number
  irTaxFree: boolean
  custodyFee?: number
}

interface ChartData {
  month: number
  [key: string]: number
}

interface SimulationDetails {
  name: string
  investedAmount: number
  grossValue: number
  irTax: number
  netValue: number
  grossGain: number
  netGain: number
  grossProfitability: number
  netProfitability: number
  realGain: number
  irTaxFree: boolean
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

  // Função para calcular detalhes da simulação
  const calculateSimulationDetails = (
    principal: number,
    monthlyContribution: number,
    months: number,
    annualRate: number,
    irTaxFree: boolean = false,
    custodyFee: number = 0,
    name: string
  ): SimulationDetails => {
    const monthlyRate = annualRate / 100 / 12
    const monthlyCustodyFee = custodyFee / 100 / 12
    let grossValue = principal
    let totalContributions = principal
    
    // Calcular valor bruto (sem IR)
    for (let i = 1; i <= months; i++) {
      grossValue = grossValue * (1 + monthlyRate - monthlyCustodyFee) + monthlyContribution
      totalContributions += monthlyContribution
    }
    
    const investedAmount = totalContributions
    const grossGain = grossValue - investedAmount
    const irRate = irTaxFree ? 0 : calculateIRRate(months) / 100
    const irTax = irTaxFree ? 0 : Math.max(0, grossGain * irRate)
    const netValue = grossValue - irTax
    const netGain = netValue - investedAmount
    
    // Calcular rentabilidades
    const grossProfitability = investedAmount > 0 ? (grossGain / investedAmount) * 100 : 0
    const netProfitability = investedAmount > 0 ? (netGain / investedAmount) * 100 : 0
    
    // Calcular ganho real (descontando inflação)
    const inflationRate = Math.pow(1 + rates.ipca / 100, months / 12) - 1
    const realGain = netValue / (investedAmount * (1 + inflationRate)) - 1
    
    return {
      name,
      investedAmount,
      grossValue,
      irTax,
      netValue,
      grossGain,
      netGain,
      grossProfitability,
      netProfitability,
      realGain: realGain * 100,
      irTaxFree
    }
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

  // Gerar detalhes da simulação
  const simulationDetails: SimulationDetails[] = investments.map(inv => 
    calculateSimulationDetails(
      parseFloat(initialInvestment),
      parseFloat(monthlyInvestment),
      parseFloat(period),
      inv.rate,
      inv.irTaxFree,
      inv.custodyFee || 0,
      inv.name
    )
  )

  const generateChartData = (): ChartData[] => {
    const data: ChartData[] = []
    const months = parseInt(period)
    
    for (let i = 0; i <= months; i++) {
      const monthData: ChartData = { month: i }
      
      investments.forEach(inv => {
        monthData[inv.name] = calculateInvestment(
          parseFloat(initialInvestment), 
          parseFloat(monthlyInvestment), 
          i, 
          inv.rate,
          inv.irTaxFree,
          inv.custodyFee || 0
        )
      })
      
      data.push(monthData)
    }
    
    return data
  }

  const chartData = generateChartData()

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
                  <Label className="text-sm font-medium">Tesouro Direto</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="tesouroPrefixado" className="text-xs">Juro nominal Prefixado (a.a.)</Label>
                      <Input
                        id="tesouroPrefixado"
                        type="number"
                        step="0.01"
                        value={rates.tesouroPrefixado}
                        onChange={(e) => handleRateChange('tesouroPrefixado', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tesouroCustodia" className="text-xs">Taxa de custódia (a.a.)</Label>
                      <Input
                        id="tesouroCustodia"
                        type="number"
                        step="0.01"
                        value={rates.tesouroCustodia}
                        onChange={(e) => handleRateChange('tesouroCustodia', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tesouroIPCA" className="text-xs">Juro real IPCA+ (a.a.)</Label>
                      <Input
                        id="tesouroIPCA"
                        type="number"
                        step="0.01"
                        value={rates.tesouroIPCA}
                        onChange={(e) => handleRateChange('tesouroIPCA', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fundoDIAdmin" className="text-xs">Taxa adm. Fundo DI (a.a.)</Label>
                      <Input
                        id="fundoDIAdmin"
                        type="number"
                        step="0.01"
                        value={rates.fundoDIAdmin}
                        onChange={(e) => handleRateChange('fundoDIAdmin', e.target.value)}
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
                {investments
                  .sort((a, b) => b.value - a.value)
                  .map((investment, index) => (
                    <div key={investment.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: colors[index] }}
                        />
                        <div>
                          <span className="font-medium">{investment.name}</span>
                          {investment.irTaxFree && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Isento IR</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {formatCurrency(investment.value)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {investment.rate.toFixed(2)}% a.a.
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Informações importantes:</div>
                  <ul className="text-xs space-y-1">
                    <li>• Imposto de renda: {calculateIRRate(parseInt(period))}% ({period < 6 ? 'até 6 meses' : period < 12 ? '6-12 meses' : period < 24 ? '12-24 meses' : '+24 meses'})</li>
                    <li>• Taxa de custódia Tesouro: {rates.tesouroCustodia}% a.a.</li>
                    <li>• Total investido: {formatCurrency(totalInvested)}</li>
                  </ul>
                </div>
              </div>
              <Button 
                onClick={() => setShowChart(!showChart)}
                className="w-full mt-4"
                size="lg"
              >
                {showChart ? 'Ocultar Simulação' : 'Ver Simulação'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico e Tabela de Simulação */}
        {showChart && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Evolução dos Investimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        label={{ value: 'Meses', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `R$${value.toLocaleString('pt-BR')}`}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Mês ${label}`}
                      />
                      <Legend />
                      {investments.map((investment, index) => (
                        <Line
                          key={investment.name}
                          type="monotone"
                          dataKey={investment.name}
                          stroke={colors[index]}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tabela Detalhada da Simulação */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Simulação Detalhada do Investimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Investimento</th>
                        <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Investido</th>
                        <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Valor Bruto</th>
                        <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Imposto de Renda</th>
                        <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Valor Líquido</th>
                        <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Ganho Bruto</th>
                        <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Ganho Líquido</th>
                        <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Rentab. Líquida</th>
                        <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Ganho Real</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationDetails
                        .sort((a, b) => b.netValue - a.netValue)
                        .map((detail, index) => (
                          <tr key={detail.name} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: colors[index] }}
                                />
                                <div>
                                  <span className="font-medium text-sm">{detail.name}</span>
                                  {detail.irTaxFree && (
                                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                                      Isento IR
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                              {formatCurrency(detail.investedAmount)}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                              {formatCurrency(detail.grossValue)}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                              {detail.irTaxFree ? (
                                <span className="text-green-600 font-medium">Isento</span>
                              ) : (
                                <span className="text-red-600">{formatCurrency(detail.irTax)}</span>
                              )}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-green-600">
                              {formatCurrency(detail.netValue)}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                              {formatCurrency(detail.grossGain)}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                              {formatCurrency(detail.netGain)}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                              <span className={`font-medium ${
                                detail.netProfitability > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {detail.netProfitability.toFixed(2)}%
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                              <span className={`font-medium ${
                                detail.realGain > 0 ? 'text-green-600' : detail.realGain < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {detail.realGain.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-semibold">
                        <td className="border border-gray-200 px-4 py-3 text-sm">Resumo</td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                          {formatCurrency(totalInvested)}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-sm text-green-600">
                          {formatCurrency(Math.max(...simulationDetails.map(d => d.grossValue)))}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-sm text-red-600">
                          {formatCurrency(Math.max(...simulationDetails.map(d => d.irTax)))}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-sm text-green-600">
                          {formatCurrency(Math.max(...simulationDetails.map(d => d.netValue)))}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                          {formatCurrency(Math.max(...simulationDetails.map(d => d.grossGain)))}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                          {formatCurrency(Math.max(...simulationDetails.map(d => d.netGain)))}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-sm text-green-600">
                          {Math.max(...simulationDetails.map(d => d.netProfitability)).toFixed(2)}%
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-sm">
                          {Math.max(...simulationDetails.map(d => d.realGain)).toFixed(2)}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {/* Legenda Explicativa */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Entenda os valores:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                    <div>
                      <strong>Total Investido:</strong> Soma de todos os aportes (inicial + mensais)
                    </div>
                    <div>
                      <strong>Valor Bruto:</strong> Valor total antes do imposto de renda
                    </div>
                    <div>
                      <strong>Imposto de Renda:</strong> Alíquota regressiva ({calculateIRRate(parseInt(period))}% para {period} meses)
                    </div>
                    <div>
                      <strong>Valor Líquido:</strong> Valor final após desconto do IR
                    </div>
                    <div>
                      <strong>Ganho Bruto:</strong> Lucro antes do imposto
                    </div>
                    <div>
                      <strong>Ganho Líquido:</strong> Lucro após o imposto
                    </div>
                    <div>
                      <strong>Rentabilidade Líquida:</strong> Percentual de ganho sobre o total investido
                    </div>
                    <div>
                      <strong>Ganho Real:</strong> Ganho líquido descontando a inflação (IPCA: {rates.ipca}% a.a.)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}