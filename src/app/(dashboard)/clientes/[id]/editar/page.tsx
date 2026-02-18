'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClienteForm } from '@/components/forms/cliente-form'
import { atualizarCliente } from '../../actions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Cliente } from '@/types/database'
import type { ClienteFormData } from '@/lib/validations/cliente'

export default function EditarClientePage() {
  const router = useRouter()
  const params = useParams()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', params.id)
        .single()

      setCliente(data)
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleSubmit(data: ClienteFormData) {
    try {
      await atualizarCliente(params.id as string, data)
      toast.success('Cliente atualizado!')
      router.push(`/clientes/${params.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar')
    }
  }

  if (loading) return <p>Carregando...</p>
  if (!cliente) return <p>Cliente não encontrado</p>

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClienteForm
            defaultValues={cliente}
            onSubmit={handleSubmit}
            submitLabel="Atualizar"
          />
        </CardContent>
      </Card>
    </div>
  )
}
