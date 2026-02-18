'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { useCalculadoraStore } from '@/stores/calculadora-store'
import { gerarSimulacao } from '@/lib/calculadora'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface SimulacaoGraficoProps {
  precoMin?: number
  precoMax?: number
  incremento?: number
}

export function SimulacaoGrafico({ precoMin, precoMax, incremento = 5 }: SimulacaoGraficoProps) {
  const { precoVenda, custoTotal, cargaTributaria } = useCalculadoraStore()

  const min = precoMin ?? (precoVenda ? Math.max(0, Math.floor(precoVenda * 0.7)) : 0)
  const max = precoMax ?? (precoVenda ? Math.ceil(precoVenda * 1.3) : 0)

  const dados = useMemo(() => {
    if (!custoTotal || custoTotal <= 0 || min >= max || incremento <= 0) return []
    try {
      return gerarSimulacao({
        precoMinimo: min,
        precoMaximo: max,
        incremento,
        custoTotal,
        cargaTributaria,
      }).map((c) => ({
        preco: c.precoVenda,
        margem: c.margemPercentual,
        margemRS: c.margemLiquida,
      }))
    } catch {
      return []
    }
  }, [min, max, incremento, custoTotal, cargaTributaria])

  if (!precoVenda || dados.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Margem Líquida por Preço</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dados} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="preco"
              tickFormatter={(v) => `R$${v}`}
              fontSize={12}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              fontSize={12}
            />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip
              formatter={((value: any, name: any) => {
                const v = Number(value) || 0
                if (name === 'margem') return [`${formatNumber(v)}%`, 'Margem (%)']
                return [formatCurrency(v), 'Margem (R$)']
              }) as any}
              labelFormatter={(v) => `Preço: R$ ${formatNumber(Number(v))}`}
            />
            <Line
              type="monotone"
              dataKey="margem"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            {/* Linha de referência no preço sugerido */}
            <ReferenceLine
              x={Math.round(precoVenda * 100) / 100}
              stroke="hsl(142, 76%, 36%)"
              strokeDasharray="5 5"
              label={{ value: 'Sugerido', position: 'top', fontSize: 11 }}
            />
            {/* Linha de margem = 0 */}
            <ReferenceLine
              y={0}
              stroke="hsl(0, 84%, 60%)"
              strokeDasharray="3 3"
              label={{ value: 'Equilíbrio', position: 'right', fontSize: 11 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
