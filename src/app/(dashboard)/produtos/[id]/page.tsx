'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProdutoForm } from '@/components/forms/produto-form'
import { atualizarProduto, deletarProduto } from '@/app/(dashboard)/clientes/[id]/produtos/actions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Pencil, Trash2, Calculator, ArrowLeft } from 'lucide-react'
import type { Produto } from '@/types/database'
import type { ProdutoFormData } from '@/lib/validations/produto'
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

const tipoIcmsLabels: Record<string, string> = {
  normal: 'Normal',
  substituicao_tributaria: 'Substituição Tributária',
  isento: 'Isento',
  reduzido: 'Reduzido',
}

export default function ProdutoDetalhePage() {
  const router = useRouter()
  const params = useParams()
  const [produto, setProduto] = useState<Produto | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', params.id)
        .single()
      setProduto(data)
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleUpdate(data: ProdutoFormData) {
    if (!produto) return
    try {
      await atualizarProduto(produto.id, produto.cliente_id, data)
      toast.success('Produto atualizado!')
      setEditing(false)
      // Reload
      const supabase = createClient()
      const { data: updated } = await supabase.from('produtos').select('*').eq('id', produto.id).single()
      setProduto(updated)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar')
    }
  }

  async function handleDelete() {
    if (!produto) return
    try {
      await deletarProduto(produto.id, produto.cliente_id)
    } catch (error) {
      toast.error('Erro ao excluir produto')
    }
  }

  if (loading) return <p>Carregando...</p>
  if (!produto) return <p>Produto não encontrado</p>

  if (editing) {
    return (
      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Editar Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <ProdutoForm
              defaultValues={produto}
              onSubmit={handleUpdate}
              submitLabel="Atualizar"
            />
            <Button variant="ghost" className="mt-4" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href={`/clientes/${produto.cliente_id}`}>
              <ArrowLeft className="mr-1 size-4" /> Voltar ao cliente
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{produto.nome}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="mr-2 size-4" /> Editar
          </Button>
          <Button asChild>
            <Link href={`/calculadora?cliente=${produto.cliente_id}&produto=${produto.id}`}>
              <Calculator className="mr-2 size-4" /> Calcular Preço
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon"><Trash2 className="size-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
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

      <Card>
        <CardContent className="pt-6">
          <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm text-muted-foreground">NCM Principal</dt>
              <dd className="font-mono">{produto.ncm_1}</dd>
            </div>
            {produto.ncm_2 && (
              <div>
                <dt className="text-sm text-muted-foreground">NCM Secundário</dt>
                <dd className="font-mono">{produto.ncm_2}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-muted-foreground">Custo de Aquisição</dt>
              <dd>R$ {Number(produto.custo_aquisicao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Tipo ICMS</dt>
              <dd><Badge variant="outline">{tipoIcmsLabels[produto.tipo_icms]}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Alíquota ICMS</dt>
              <dd>{Number(produto.aliquota_icms).toFixed(2)}%</dd>
            </div>
            {produto.tipo_icms === 'substituicao_tributaria' && (
              <div>
                <dt className="text-sm text-muted-foreground">MVA/IVA</dt>
                <dd>{Number(produto.mva_iva).toFixed(2)}%</dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-muted-foreground">Alíquota IPI</dt>
              <dd>{Number(produto.aliquota_ipi).toFixed(2)}%</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Margem Desejada</dt>
              <dd>{Number(produto.margem_desejada).toFixed(1)}%</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
