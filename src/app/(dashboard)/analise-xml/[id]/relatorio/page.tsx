import { buscarAnalise } from '../../actions'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatNumber, formatCNPJ } from '@/lib/utils'
import { ArrowLeft, Printer } from 'lucide-react'
import Link from 'next/link'
import type { Analise, AnaliseProduto } from '@/types/database'
import { ReportActions } from '@/components/relatorio/report-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RelatorioPage({ params }: PageProps) {
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
        <h1 className="text-2xl font-bold">Relatório não encontrado</h1>
        <Button asChild variant="outline">
          <Link href="/analises"><ArrowLeft className="mr-2 size-4" /> Voltar</Link>
        </Button>
      </div>
    )
  }

  const dataEmissao = analise.data_emissao
    ? new Date(analise.data_emissao).toLocaleDateString('pt-BR')
    : '-'

  const dataAnalise = new Date(analise.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div>
      {/* Ações (não imprimem) */}
      <div className="no-print mb-6 flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href={`/analise-xml/${id}`}>
            <ArrowLeft className="mr-2 size-4" /> Voltar à Análise
          </Link>
        </Button>
        <ReportActions />
      </div>

      {/* Conteúdo do relatório */}
      <div className="print-content mx-auto max-w-4xl space-y-8">
        {/* Cabeçalho */}
        <div className="border-b-2 border-primary pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Projeto Manuela</h1>
              <p className="text-sm text-muted-foreground">Relatório de Análise Tributária</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-muted-foreground">Data da análise</p>
              <p className="font-medium">{dataAnalise}</p>
            </div>
          </div>
        </div>

        {/* Dados da NF-e */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Dados da NF-e</h2>
          <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">Número</span>
              <span className="font-medium">{analise.numero_nfe}</span>
            </div>
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">Série</span>
              <span className="font-medium">{analise.serie}</span>
            </div>
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">Emitente</span>
              <span className="font-medium">{analise.emit_razao_social}</span>
            </div>
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">CNPJ</span>
              <span className="font-medium">{formatCNPJ(analise.emit_cnpj)}</span>
            </div>
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">UF</span>
              <span className="font-medium">{analise.emit_uf || '-'}</span>
            </div>
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">Data Emissão</span>
              <span className="font-medium">{dataEmissao}</span>
            </div>
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">Valor NF</span>
              <span className="font-bold">{formatCurrency(Number(analise.valor_nf))}</span>
            </div>
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">Total Produtos</span>
              <span className="font-medium">{analise.total_produtos}</span>
            </div>
          </div>
        </section>

        {/* Resumo tributário */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Resumo Tributário</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-xs text-muted-foreground">ICMS</p>
              <p className="text-lg font-bold">{formatCurrency(Number(analise.icms_total))}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-xs text-muted-foreground">ICMS-ST</p>
              <p className="text-lg font-bold">{formatCurrency(Number(analise.icms_st_total))}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-xs text-muted-foreground">IPI</p>
              <p className="text-lg font-bold">{formatCurrency(Number(analise.ipi_total))}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-xs text-muted-foreground">PIS + COFINS</p>
              <p className="text-lg font-bold">{formatCurrency(Number(analise.pis_total) + Number(analise.cofins_total))}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-xs text-muted-foreground">Carga Tributária Média</p>
              <p className="text-2xl font-bold text-primary">{formatNumber(Number(analise.carga_media_percentual))}%</p>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Margem Média</p>
              <p className="text-2xl font-bold text-emerald-600">{formatNumber(Number(analise.margem_media))}%</p>
            </div>
          </div>
        </section>

        {/* Parâmetros */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Parâmetros Utilizados</h2>
          <div className="grid gap-x-8 gap-y-2 sm:grid-cols-3">
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">RBT12</span>
              <span className="font-medium">{formatCurrency(Number(analise.config_rbt12))}</span>
            </div>
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">Anexo</span>
              <span className="font-medium">{analise.config_anexo.replace('_', ' ').replace('anexo', 'Anexo')}</span>
            </div>
            <div className="flex justify-between border-b py-1.5 text-sm">
              <span className="text-muted-foreground">Margem Desejada</span>
              <span className="font-medium">{formatNumber(Number(analise.config_margem))}%</span>
            </div>
          </div>
        </section>

        {/* Tabela de produtos */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Detalhamento por Produto</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 text-left">
                <th className="pb-2 pr-2">#</th>
                <th className="pb-2 pr-2">Produto</th>
                <th className="pb-2 pr-2">NCM</th>
                <th className="pb-2 pr-2 text-right">V. Total</th>
                <th className="pb-2 pr-2 text-right">Carga %</th>
                <th className="pb-2 pr-2 text-right">Preço Sug.</th>
                <th className="pb-2 pr-2 text-right">Margem %</th>
                <th className="pb-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2 pr-2 text-muted-foreground">{p.numero_item}</td>
                  <td className="py-2 pr-2 font-medium">{p.descricao}</td>
                  <td className="py-2 pr-2 font-mono text-xs">{p.ncm}</td>
                  <td className="py-2 pr-2 text-right">{formatCurrency(Number(p.valor_total))}</td>
                  <td className="py-2 pr-2 text-right">{formatNumber(Number(p.carga_tributaria_percentual))}%</td>
                  <td className="py-2 pr-2 text-right font-medium">
                    {p.preco_sugerido ? formatCurrency(Number(p.preco_sugerido)) : '-'}
                  </td>
                  <td className={`py-2 pr-2 text-right font-medium ${
                    Number(p.margem_percentual) >= 20 ? 'text-emerald-600' :
                    Number(p.margem_percentual) >= 10 ? 'text-amber-600' :
                    Number(p.margem_percentual) >= 0 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {formatNumber(Number(p.margem_percentual))}%
                  </td>
                  <td className="py-2 text-center text-xs">
                    <span className={`inline-block rounded-full px-2 py-0.5 ${
                      p.classificacao === 'alta' ? 'bg-emerald-100 text-emerald-700' :
                      p.classificacao === 'media' ? 'bg-amber-100 text-amber-700' :
                      p.classificacao === 'baixa' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.classificacao === 'alta' ? 'Alta' :
                       p.classificacao === 'media' ? 'Média' :
                       p.classificacao === 'baixa' ? 'Baixa' : 'Negativa'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Insights por produto */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Observações por Produto</h2>
          <div className="space-y-2">
            {produtos.filter(p => p.insight).map((p) => (
              <div key={p.id} className="rounded border-l-4 border-l-primary/30 bg-muted/50 px-4 py-2 text-sm">
                {p.insight}
              </div>
            ))}
          </div>
        </section>

        {/* Rodapé */}
        <div className="border-t pt-4 text-center text-xs text-muted-foreground">
          <p>Relatório gerado por Projeto Manuela | {dataAnalise}</p>
          <p className="mt-1">Este relatório tem caráter informativo. Consulte seu contador para decisões tributárias.</p>
        </div>
      </div>
    </div>
  )
}
