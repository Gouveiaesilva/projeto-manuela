'use client'

import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, Percent, TrendingUp, TrendingDown, Package, Receipt } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { AnaliseResumo, NFeTotais } from '@/lib/xml/types'

interface TotalsSummaryProps {
  totais: NFeTotais
  resumo: AnaliseResumo
}

export function TotalsSummary({ totais, resumo }: TotalsSummaryProps) {
  const cards = [
    {
      title: 'Valor Total NF',
      value: formatCurrency(totais.valorNF),
      icon: Receipt,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Produtos',
      value: resumo.totalProdutos.toString(),
      icon: Package,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Carga Tributária Média',
      value: `${formatNumber(resumo.cargaMediaPercentual)}%`,
      icon: Percent,
      color: 'text-red-600 bg-red-50',
    },
    {
      title: 'Margem Média',
      value: `${formatNumber(resumo.margemMedia)}%`,
      icon: resumo.margemMedia >= 0 ? TrendingUp : TrendingDown,
      color: resumo.margemMedia >= 10
        ? 'text-emerald-600 bg-emerald-50'
        : resumo.margemMedia >= 0
          ? 'text-amber-600 bg-amber-50'
          : 'text-red-600 bg-red-50',
    },
    {
      title: 'ICMS Total',
      value: formatCurrency(totais.icmsValor),
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'ICMS-ST',
      value: formatCurrency(totais.icmsStValor),
      icon: DollarSign,
      color: 'text-orange-600 bg-orange-50',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{card.title}</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{card.value}</p>
              </div>
              <div className={`shrink-0 rounded-lg p-2 ${card.color}`}>
                <card.icon className="size-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
