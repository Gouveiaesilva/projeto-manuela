'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProdutoForm } from '@/components/forms/produto-form'
import { criarProduto } from '../actions'
import { toast } from 'sonner'
import type { ProdutoFormData } from '@/lib/validations/produto'

export default function NovoProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const clienteId = params.id as string

  async function handleSubmit(data: ProdutoFormData) {
    try {
      await criarProduto(clienteId, data)
      toast.success('Produto criado com sucesso!')
      router.push(`/clientes/${clienteId}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar produto')
    }
  }

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProdutoForm onSubmit={handleSubmit} submitLabel="Criar Produto" />
        </CardContent>
      </Card>
    </div>
  )
}
