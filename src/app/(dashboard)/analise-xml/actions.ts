'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AnaliseXML } from '@/lib/xml/types'

export async function salvarAnalise(analise: AnaliseXML) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { nfe, config, produtos, resumo } = analise

  // Inserir análise principal
  const { data: analiseRow, error: analiseError } = await supabase
    .from('analises')
    .insert({
      user_id: user.id,
      chave_acesso: nfe.chaveAcesso,
      numero_nfe: nfe.numero,
      serie: nfe.serie,
      data_emissao: nfe.dataEmissao || null,
      emit_cnpj: nfe.emitente.cnpj,
      emit_razao_social: nfe.emitente.razaoSocial,
      emit_nome_fantasia: nfe.emitente.nomeFantasia,
      emit_uf: nfe.emitente.uf,
      emit_crt: nfe.emitente.crt,
      dest_cnpj: nfe.destinatario.cnpj,
      dest_razao_social: nfe.destinatario.razaoSocial,
      dest_uf: nfe.destinatario.uf,
      valor_produtos: nfe.totais.valorProdutos,
      valor_nf: nfe.totais.valorNF,
      icms_total: nfe.totais.icmsValor,
      icms_st_total: nfe.totais.icmsStValor,
      ipi_total: nfe.totais.ipiValor,
      pis_total: nfe.totais.pisValor,
      cofins_total: nfe.totais.cofinsValor,
      config_rbt12: config.rbt12,
      config_anexo: config.anexo,
      config_margem: config.margemDesejada,
      total_produtos: resumo.totalProdutos,
      carga_media_percentual: resumo.cargaMediaPercentual,
      margem_media: resumo.margemMedia,
      produtos_lucrativos: resumo.produtosLucrativos,
      produtos_deficitarios: resumo.produtosDeficitarios,
    })
    .select('id')
    .single()

  if (analiseError) throw new Error(`Erro ao salvar análise: ${analiseError.message}`)

  // Inserir produtos
  const produtosRows = produtos.map(p => ({
    analise_id: analiseRow.id,
    numero_item: p.item.produto.numero,
    codigo: p.item.produto.codigo,
    descricao: p.item.produto.descricao,
    ncm: p.item.produto.ncm,
    cfop: p.item.produto.cfop,
    unidade: p.item.produto.unidade,
    quantidade: p.item.produto.quantidade,
    valor_unitario: p.item.produto.valorUnitario,
    valor_total: p.item.produto.valorTotal,
    icms_cst: p.item.impostos.icmsCST,
    icms_base: p.item.impostos.icmsBase,
    icms_aliquota: p.item.impostos.icmsAliquota,
    icms_valor: p.item.impostos.icmsValor,
    icms_st_base: p.item.impostos.icmsStBase,
    icms_st_mva: p.item.impostos.icmsStMva,
    icms_st_valor: p.item.impostos.icmsStValor,
    ipi_valor: p.item.impostos.ipiValor,
    pis_valor: p.item.impostos.pisValor,
    cofins_valor: p.item.impostos.cofinsValor,
    carga_tributaria_percentual: p.cargaTributariaPercentual,
    aliquota_efetiva: p.aliquotaEfetiva,
    icms_st_fora_das: p.icmsStForaDAS,
    icms_st_calculado: p.icmsStValor,
    preco_sugerido: p.precoSugerido,
    margem_percentual: p.margemPercentual,
    margem_liquida: p.margemLiquida,
    markup: p.markup,
    classificacao: p.classificacao,
    insight: p.insight,
  }))

  const { error: prodError } = await supabase
    .from('analise_produtos')
    .insert(produtosRows)

  if (prodError) throw new Error(`Erro ao salvar produtos: ${prodError.message}`)

  revalidatePath('/')
  revalidatePath('/analises')

  return analiseRow.id
}

export async function buscarAnalise(id: string) {
  const supabase = await createClient()

  const [{ data: analise, error: aErr }, { data: produtos, error: pErr }] = await Promise.all([
    supabase.from('analises').select('*').eq('id', id).single(),
    supabase.from('analise_produtos').select('*').eq('analise_id', id).order('numero_item'),
  ])

  if (aErr) throw new Error(`Análise não encontrada: ${aErr.message}`)
  if (pErr) throw new Error(`Erro ao buscar produtos: ${pErr.message}`)

  return { analise, produtos: produtos || [] }
}

export async function listarAnalises() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('analises')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Erro ao listar análises: ${error.message}`)
  return data || []
}

export async function deletarAnalise(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('analises')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Erro ao deletar análise: ${error.message}`)

  revalidatePath('/')
  revalidatePath('/analises')
}
