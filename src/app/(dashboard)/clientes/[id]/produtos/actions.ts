'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function criarProduto(clienteId: string, data: Record<string, unknown>) {
  const supabase = await createClient()

  const { data: produto, error } = await supabase
    .from('produtos')
    .insert({
      ...data,
      cliente_id: clienteId,
      ncm_2: data.ncm_2 || null,
      descricao: data.descricao || null,
      descricao_tipi: data.descricao_tipi || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(`/clientes/${clienteId}`)
  return produto
}

export async function atualizarProduto(id: string, clienteId: string, data: Record<string, unknown>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('produtos')
    .update({
      ...data,
      ncm_2: data.ncm_2 || null,
      descricao: data.descricao || null,
      descricao_tipi: data.descricao_tipi || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/clientes/${clienteId}`)
  revalidatePath(`/produtos/${id}`)
}

export async function deletarProduto(id: string, clienteId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/clientes/${clienteId}`)
  redirect(`/clientes/${clienteId}`)
}
