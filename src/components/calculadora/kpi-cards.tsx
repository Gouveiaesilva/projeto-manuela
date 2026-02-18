'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useCalculadoraStore } from '@/stores/calculadora-store'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { DollarSign, Percent, TrendingUp, Target, BarChart3 } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  description?: string
  icon: React.ReactNode
  highlight?: boolean
}

function KPICard({ title, value, description, icon, highlight }: KPICardProps) {
  return (
    <Card className={highlight ? 'border-primary bg-primary/5' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICards() {
  const { precoVenda, kpis, erro, custoTotal, cargaTributaria } = useCalculadoraStore()

  if (erro) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-destructive">{erro}</p>
        </CardContent>
      </Card>
    )
  }

  if (!precoVenda || !kpis) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Preencha os dados para ver os resultados da precificação.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <KPICard
        title="Preço de Venda Sugerido"
        value={formatCurrency(kpis.precoVenda)}
        description={`Custo ${formatCurrency(custoTotal)} + Carga ${formatNumber(cargaTributaria)}% + Margem ${formatNumber(kpis.margemPercentual)}%`}
        icon={<DollarSign className="size-5" />}
        highlight
      />

      <KPICard
        title="Impostos"
        value={formatCurrency(kpis.impostoValor)}
        description={`${formatNumber(cargaTributaria)}% sobre o preço`}
        icon={<Percent className="size-5" />}
      />

      <KPICard
        title="Margem Líquida"
        value={formatCurrency(kpis.margemLiquida)}
        description={`${formatNumber(kpis.margemPercentual)}% do preço`}
        icon={<TrendingUp className="size-5" />}
      />

      <KPICard
        title="Markup"
        value={`${formatNumber(kpis.markup)}%`}
        description="Sobre o custo total"
        icon={<BarChart3 className="size-5" />}
      />

      <KPICard
        title="Margem de Contribuição"
        value={formatCurrency(kpis.margemContribuicao)}
        description="Preço - Custo - Impostos"
        icon={<Target className="size-5" />}
      />

      {kpis.pontoEquilibrio !== null && (
        <KPICard
          title="Ponto de Equilíbrio"
          value={`${kpis.pontoEquilibrio} un/mês`}
          description="Unidades necessárias para cobrir custos fixos"
          icon={<Target className="size-5" />}
        />
      )}
    </div>
  )
}
