'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { AnaliseResumo } from '@/lib/xml/types'

interface InsightsPanelProps {
  resumo: AnaliseResumo
}

export function InsightsPanel({ resumo }: InsightsPanelProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Visão Geral */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4 text-primary" />
            Visão Geral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Produtos lucrativos</span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-600">
              <CheckCircle className="size-4" />
              {resumo.produtosLucrativos} de {resumo.totalProdutos}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Produtos deficitários</span>
            <span className={`flex items-center gap-1.5 font-medium ${resumo.produtosDeficitarios > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
              {resumo.produtosDeficitarios > 0 && <AlertTriangle className="size-4" />}
              {resumo.produtosDeficitarios}
            </span>
          </div>
          {resumo.maiorMargem && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Maior margem</span>
              <span className="text-right text-sm">
                <span className="font-medium text-emerald-600">{formatNumber(resumo.maiorMargem.margem)}%</span>
                <span className="ml-1 text-xs text-muted-foreground">({resumo.maiorMargem.descricao.substring(0, 20)})</span>
              </span>
            </div>
          )}
          {resumo.menorMargem && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Menor margem</span>
              <span className="text-right text-sm">
                <span className={`font-medium ${resumo.menorMargem.margem < 0 ? 'text-red-600' : 'text-amber-600'}`}>
                  {formatNumber(resumo.menorMargem.margem)}%
                </span>
                <span className="ml-1 text-xs text-muted-foreground">({resumo.menorMargem.descricao.substring(0, 20)})</span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="size-4 text-amber-500" />
            Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {resumo.recomendacoes.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <TrendingDown className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
