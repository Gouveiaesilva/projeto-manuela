'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface SalvarCalculoInput {
  cliente_id: string
  produto_id: string
  operacao: string
  regime_calculo: string
  custo_compra: number
  custo_embalagem: number
  custo_mao_obra: number
  custo_operacional: number
  custo_frete: number
  custo_outros: number
  custo_total: number
  carga_tributaria_percentual: number
  aliquota_efetiva_simples: number | null
  icms_dentro_simples: number | null
  icms_st_fora_das: boolean
  icms_st_valor: number
  preco_sugerido: number
  imposto_valor: number
  margem_liquida: number
  margem_percentual: number
  markup: number
  margem_contribuicao: number
  ponto_equilibrio: number | null
  lucro_desejado: number | null
  notas?: string
}

export async function salvarCalculo(input: SalvarCalculoInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('calculos')
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/calculadora')
  revalidatePath('/')
  return data
}

export async function buscarCalculo(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('calculos')
    .select(`
      *,
      clientes ( razao_social, regime ),
      produtos ( nome, ncm_1 )
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deletarCalculo(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('calculos')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/calculadora')
  revalidatePath('/')
}
