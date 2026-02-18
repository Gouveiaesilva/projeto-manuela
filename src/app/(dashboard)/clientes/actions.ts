'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function criarCliente(data: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: cliente, error } = await supabase
    .from('clientes')
    .insert({
      ...data,
      user_id: user.id,
      nome_fantasia: data.nome_fantasia || null,
      anexo_simples: data.anexo_simples || null,
      rbt12: data.rbt12 || null,
      telefone: data.telefone || null,
      email: data.email || null,
      observacoes: data.observacoes || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/clientes')
  return cliente
}

export async function atualizarCliente(id: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('clientes')
    .update({
      ...data,
      nome_fantasia: data.nome_fantasia || null,
      anexo_simples: data.anexo_simples || null,
      rbt12: data.rbt12 || null,
      telefone: data.telefone || null,
      email: data.email || null,
      observacoes: data.observacoes || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/clientes')
  revalidatePath(`/clientes/${id}`)
}

export async function deletarCliente(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/clientes')
  redirect('/clientes')
}
