import { buscarAnalise } from '../actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency, formatNumber, formatCNPJ } from '@/lib/utils'
import { ArrowLeft, FileText, Building2, Package } from 'lucide-react'
import Link from 'next/link'
import type { Analise, AnaliseProduto } from '@/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

const classLabel: Record<string, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
  negativa: 'Negativa',
}

const classVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  alta: 'default',
  media: 'secondary',
  baixa: 'outline',
  negativa: 'destructive',
}

export default async function AnaliseSalvaPage({ params }: PageProps) {
  const { id } = await params
  let analise: Analise | null = null
  let produtos: AnaliseProduto[] = []

  try {
    const result = await buscarAnalise(id)
    analise = result.analise as Analise
    produtos = result.produtos as AnaliseProduto[]
  } catch {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Análise não encontrada</h1>
        <Button asChild variant="outline">
          <Link href="/analises"><ArrowLeft className="mr-2 size-4" /> Voltar</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Análise #{analise.numero_nfe}</h1>
          <p className="text-muted-foreground">{analise.emit_razao_social}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/analises"><ArrowLeft className="mr-2 size-4" /> Voltar</Link>
          </Button>
          <Button asChild>
            <Link href={`/analise-xml/${id}/relatorio`}><FileText className="mr-2 size-4" /> Relatório</Link>
          </Button>
        </div>
      </div>

      {/* Emitente */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4" />
            Emitente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Razão Social</p>
              <p className="font-medium">{analise.emit_razao_social}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CNPJ</p>
              <p className="font-medium">{formatCNPJ(analise.emit_cnpj)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">UF</p>
              <p className="font-medium">{analise.emit_uf || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Valor NF</p>
            <p className="mt-1 text-xl font-bold">{formatCurrency(Number(analise.valor_nf))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Carga Média</p>
            <p className="mt-1 text-xl font-bold">{formatNumber(Number(analise.carga_media_percentual))}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Margem Média</p>
            <p className="mt-1 text-xl font-bold">{formatNumber(Number(analise.margem_media))}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Produtos</p>
            <p className="mt-1 text-xl font-bold">
              <span className="text-emerald-600">{analise.produtos_lucrativos}</span>
              {' / '}
              <span className={analise.produtos_deficitarios > 0 ? 'text-red-600' : ''}>{analise.produtos_deficitarios}</span>
              <span className="text-sm text-muted-foreground"> (lucr./def.)</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="size-4" />
            Produtos ({produtos.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>NCM</TableHead>
                    <TableHead className="text-right">V. Total</TableHead>
                    <TableHead className="text-right">Carga %</TableHead>
                    <TableHead className="text-right">Preço Sug.</TableHead>
                    <TableHead className="text-right">Margem %</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.numero_item}</TableCell>
                      <TableCell className="font-medium">{p.descricao}</TableCell>
                      <TableCell className="font-mono text-xs">{p.ncm}</TableCell>
                      <TableCell className="text-right">{formatCurrency(Number(p.valor_total))}</TableCell>
                      <TableCell className="text-right">{formatNumber(Number(p.carga_tributaria_percentual))}%</TableCell>
                      <TableCell className="text-right font-medium">{p.preco_sugerido ? formatCurrency(Number(p.preco_sugerido)) : '-'}</TableCell>
                      <TableCell className="text-right">{formatNumber(Number(p.margem_percentual))}%</TableCell>
                      <TableCell className="text-center">
                        {p.classificacao && (
                          <Badge variant={classVariant[p.classificacao] || 'outline'}>
                            {classLabel[p.classificacao] || p.classificacao}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
