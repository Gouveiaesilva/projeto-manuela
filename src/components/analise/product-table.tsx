'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { ProdutoAnalisado, ClassificacaoLucratividade } from '@/lib/xml/types'

interface ProductTableProps {
  produtos: ProdutoAnalisado[]
}

const badgeVariantMap: Record<ClassificacaoLucratividade, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  alta: 'default',
  media: 'secondary',
  baixa: 'outline',
  negativa: 'destructive',
}

const classificacaoLabel: Record<ClassificacaoLucratividade, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
  negativa: 'Negativa',
}

export function ProductTable({ produtos }: ProductTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Produtos Analisados</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="min-w-[200px]">Produto</TableHead>
                  <TableHead>NCM</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">V. Unit.</TableHead>
                  <TableHead className="text-right">V. Total</TableHead>
                  <TableHead className="text-right">Carga %</TableHead>
                  <TableHead className="text-right">Preço Sug.</TableHead>
                  <TableHead className="text-right">Margem %</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((p) => (
                  <TableRow key={p.item.produto.numero}>
                    <TableCell className="text-muted-foreground">
                      {p.item.produto.numero}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{p.item.produto.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.item.produto.codigo} | {p.item.produto.unidade}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.item.produto.ncm}</TableCell>
                    <TableCell className="text-right">{formatNumber(p.item.produto.quantidade, 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.item.produto.valorUnitario)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(p.item.produto.valorTotal)}</TableCell>
                    <TableCell className="text-right">
                      <span className={p.cargaTributariaPercentual > 20 ? 'text-red-600' : ''}>
                        {formatNumber(p.cargaTributariaPercentual)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {p.precoSugerido > 0 ? formatCurrency(p.precoSugerido) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={
                        p.margemPercentual >= 20 ? 'text-emerald-600 font-medium' :
                        p.margemPercentual >= 10 ? 'text-amber-600' :
                        p.margemPercentual >= 0 ? 'text-orange-600' :
                        'text-red-600 font-medium'
                      }>
                        {formatNumber(p.margemPercentual)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={badgeVariantMap[p.classificacao]}>
                        {classificacaoLabel[p.classificacao]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
