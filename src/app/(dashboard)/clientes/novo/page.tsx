'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClienteForm } from '@/components/forms/cliente-form'
import { criarCliente } from '../actions'
import { toast } from 'sonner'
import type { ClienteFormData } from '@/lib/validations/cliente'
import type { Cliente } from '@/types/database'

export default function NovoClientePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pré-preenche a partir do XML se os params existirem
  const cnpjParam = searchParams.get('cnpj') || ''
  const razaoParam = searchParams.get('razao') || ''
  const fantasiaParam = searchParams.get('fantasia') || ''
  const ufParam = searchParams.get('uf') || ''
  const crtParam = searchParams.get('crt') || ''

  const defaultValues: Partial<Cliente> = {}
  if (cnpjParam) defaultValues.cnpj = cnpjParam
  if (razaoParam) defaultValues.razao_social = razaoParam
  if (fantasiaParam) defaultValues.nome_fantasia = fantasiaParam
  if (crtParam === '1' || crtParam === '2') {
    defaultValues.regime = 'simples_nacional'
  } else if (crtParam === '3') {
    defaultValues.regime = 'lucro_real'
  }

  const fromXML = cnpjParam.length > 0

  async function handleSubmit(data: ClienteFormData) {
    try {
      const cliente = await criarCliente(data)
      toast.success('Cliente criado com sucesso!')
      router.push(`/clientes/${cliente.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar cliente')
    }
  }

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Novo Cliente</CardTitle>
          {fromXML && (
            <p className="text-sm text-muted-foreground">
              Dados pré-preenchidos a partir do XML da NF-e
            </p>
          )}
        </CardHeader>
        <CardContent>
          <ClienteForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitLabel="Criar Cliente"
          />
        </CardContent>
      </Card>
    </div>
  )
}
