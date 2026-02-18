'use client'

import { useAnaliseStore } from '@/stores/analise-store'
import { UploadZone } from '@/components/xml/upload-zone'
import { ConfigForm } from '@/components/xml/config-form'
import { TotalsSummary } from '@/components/analise/totals-summary'
import { ProductTable } from '@/components/analise/product-table'
import { InsightsPanel } from '@/components/analise/insights-panel'
import { Button } from '@/components/ui/button'
import { RotateCcw, Save, FileText } from 'lucide-react'
import { salvarAnalise } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AnaliseXMLPage() {
  const { etapa, analise, resetar, voltarParaConfig } = useAnaliseStore()
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async () => {
    if (!analise) return
    setSalvando(true)
    try {
      const id = await salvarAnalise(analise)
      toast.success('Análise salva com sucesso!')
      router.push(`/analise-xml/${id}/relatorio`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Análise de NF-e</h1>
        <p className="text-muted-foreground">
          {etapa === 'upload' && 'Faça upload de um XML de NF-e para análise tributária'}
          {etapa === 'config' && 'Configure os parâmetros da análise'}
          {etapa === 'resultado' && 'Resultado da análise tributária'}
        </p>
      </div>

      {/* Etapa 1: Upload */}
      {etapa === 'upload' && <UploadZone />}

      {/* Etapa 2: Configuração */}
      {etapa === 'config' && <ConfigForm />}

      {/* Etapa 3: Resultado */}
      {etapa === 'resultado' && analise && (
        <div className="space-y-6">
          {/* Totais */}
          <TotalsSummary totais={analise.nfe.totais} resumo={analise.resumo} />

          {/* Insights */}
          <InsightsPanel resumo={analise.resumo} />

          {/* Tabela de produtos */}
          <ProductTable produtos={analise.produtos} />

          {/* Ações */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSalvar} disabled={salvando}>
              <Save className="mr-2 size-4" />
              {salvando ? 'Salvando...' : 'Salvar Análise'}
            </Button>
            <Button variant="outline" onClick={voltarParaConfig}>
              <RotateCcw className="mr-2 size-4" />
              Reconfigurar
            </Button>
            <Button variant="outline" onClick={resetar}>
              <FileText className="mr-2 size-4" />
              Novo XML
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
