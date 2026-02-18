'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { createClient } from '@/lib/supabase/client'
import { deletarCalculo } from '../actions'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { toast } from 'sonner'
import { ArrowLeft, Trash2, Calculator } from 'lucide-react'
import type { Calculo, Cliente, Produto } from '@/types/database'

const regimeLabels: Record<string, string> = {
  simples_nacional: 'Simples Nacional',
  lucro_real: 'Lucro Real',
  lucro_presumido: 'Lucro Presumido',
}

const operacaoLabels: Record<string, string> = {
  revenda: 'Revenda',
  industrializacao: 'Industrialização',
  encomenda: 'Encomenda',
}

type CalculoComRelacoes = Calculo & {
  clientes: Pick<Cliente, 'razao_social' | 'regime'> | null
  produtos: Pick<Produto, 'nome' | 'ncm_1'> | null
}

export default function CalculoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [calculo, setCalculo] = useState<CalculoComRelacoes | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('calculos')
        .select(`
          *,
          clientes ( razao_social, regime ),
          produtos ( nome, ncm_1 )
        `)
        .eq('id', params.id)
        .single()
      setCalculo(data as unknown as CalculoComRelacoes)
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleDelete() {
    if (!calculo) return
    try {
      await deletarCalculo(calculo.id)
      toast.success('Cálculo excluído')
      router.push('/')
    } catch {
      toast.error('Erro ao excluir cálculo')
    }
  }

  if (loading) return <p>Carregando...</p>
  if (!calculo) return <p>Cálculo não encontrado</p>

  const clienteNome = calculo.clientes?.razao_social ?? 'Cliente'
  const produtoNome = calculo.produtos?.nome ?? 'Produto'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/">
              <ArrowLeft className="mr-1 size-4" /> Voltar
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Cálculo: {produtoNome}
          </h1>
          <p className="text-muted-foreground">{clienteNome}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/calculadora?cliente=${calculo.cliente_id}&produto=${calculo.produto_id}`}>
              <Calculator className="mr-2 size-4" /> Recalcular
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon"><Trash2 className="size-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir cálculo?</AlertDialogTitle>
                <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* KPIs Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Preço Sugerido</p>
            <p className="text-2xl font-bold">{formatCurrency(Number(calculo.preco_sugerido))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Impostos</p>
            <p className="text-2xl font-bold">{formatCurrency(Number(calculo.imposto_valor))}</p>
            <p className="text-xs text-muted-foreground">{formatNumber(Number(calculo.carga_tributaria_percentual))}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Margem Líquida</p>
            <p className="text-2xl font-bold">{formatCurrency(Number(calculo.margem_liquida))}</p>
            <p className="text-xs text-muted-foreground">{formatNumber(Number(calculo.margem_percentual))}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Operação</dt>
                <dd>{operacaoLabels[calculo.operacao]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Regime</dt>
                <dd><Badge variant="outline">{regimeLabels[calculo.regime_calculo]}</Badge></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Markup</dt>
                <dd>{formatNumber(Number(calculo.markup))}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Margem de Contribuição</dt>
                <dd>{formatCurrency(Number(calculo.margem_contribuicao))}</dd>
              </div>
              {calculo.ponto_equilibrio && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Ponto de Equilíbrio</dt>
                  <dd>{calculo.ponto_equilibrio} un/mês</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Data</dt>
                <dd>{new Date(calculo.created_at).toLocaleDateString('pt-BR')}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Composição de Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Custo de Compra</dt>
                <dd>{formatCurrency(Number(calculo.custo_compra))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Embalagem</dt>
                <dd>{formatCurrency(Number(calculo.custo_embalagem))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Mão de Obra</dt>
                <dd>{formatCurrency(Number(calculo.custo_mao_obra))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Operacional</dt>
                <dd>{formatCurrency(Number(calculo.custo_operacional))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Frete</dt>
                <dd>{formatCurrency(Number(calculo.custo_frete))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Outros</dt>
                <dd>{formatCurrency(Number(calculo.custo_outros))}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <dt>Custo Total</dt>
                <dd>{formatCurrency(Number(calculo.custo_total))}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
