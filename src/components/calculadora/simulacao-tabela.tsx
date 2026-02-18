'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCalculadoraStore } from '@/stores/calculadora-store'
import { gerarSimulacao, encontrarPontoEquilibrio } from '@/lib/calculadora'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { CenarioSimulacao } from '@/types/calculadora'

export function SimulacaoTabela() {
  const { precoVenda, custoTotal, cargaTributaria } = useCalculadoraStore()

  const [faixaMin, setFaixaMin] = useState<number | null>(null)
  const [faixaMax, setFaixaMax] = useState<number | null>(null)
  const [incremento, setIncremento] = useState(5)

  // Calcular faixa padrão baseada no preço sugerido
  const defaultMin = precoVenda ? Math.max(0, Math.floor(precoVenda * 0.7)) : 0
  const defaultMax = precoVenda ? Math.ceil(precoVenda * 1.3) : 0

  const min = faixaMin ?? defaultMin
  const max = faixaMax ?? defaultMax

  const cenarios = useMemo<CenarioSimulacao[]>(() => {
    if (!custoTotal || custoTotal <= 0 || min >= max || incremento <= 0) return []
    try {
      return gerarSimulacao({
        precoMinimo: min,
        precoMaximo: max,
        incremento,
        custoTotal,
        cargaTributaria,
      })
    } catch {
      return []
    }
  }, [min, max, incremento, custoTotal, cargaTributaria])

  const pontoEquilibrio = useMemo(() => encontrarPontoEquilibrio(cenarios), [cenarios])

  if (!precoVenda) {
    return null
  }

  function getRowClass(cenario: CenarioSimulacao): string {
    if (precoVenda && Math.abs(cenario.precoVenda - precoVenda) < incremento / 2) {
      return 'bg-green-50 dark:bg-green-950/30 font-medium'
    }
    if (pontoEquilibrio && cenario.precoVenda === pontoEquilibrio.precoVenda) {
      return 'bg-yellow-50 dark:bg-yellow-950/30'
    }
    if (cenario.margemLiquida < 0) {
      return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400'
    }
    return ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulação de Cenários</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <Label>Preço Mínimo (R$)</Label>
            <Input
              type="number"
              step="1"
              value={min}
              onChange={(e) => setFaixaMin(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label>Preço Máximo (R$)</Label>
            <Input
              type="number"
              step="1"
              value={max}
              onChange={(e) => setFaixaMax(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label>Incremento (R$)</Label>
            <Input
              type="number"
              step="1"
              min="1"
              value={incremento}
              onChange={(e) => setIncremento(Number(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="inline-block size-3 rounded bg-green-200" /> Preço sugerido
          <span className="ml-2 inline-block size-3 rounded bg-yellow-200" /> Ponto de equilíbrio
          <span className="ml-2 inline-block size-3 rounded bg-red-200" /> Margem negativa
        </div>

        {cenarios.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preço Venda</TableHead>
                  <TableHead>Imposto</TableHead>
                  <TableHead>Receita Líq.</TableHead>
                  <TableHead>Margem (R$)</TableHead>
                  <TableHead>Margem (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cenarios.map((c, i) => (
                  <TableRow key={i} className={cn(getRowClass(c))}>
                    <TableCell className="font-mono">{formatCurrency(c.precoVenda)}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(c.imposto)}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(c.receitaLiquida)}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(c.margemLiquida)}</TableCell>
                    <TableCell className="font-mono">{formatNumber(c.margemPercentual)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">Ajuste os parâmetros para gerar cenários.</p>
        )}
      </CardContent>
    </Card>
  )
}
