'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCalculadoraStore } from '@/stores/calculadora-store'
import { formatNumber } from '@/lib/utils'

export function AliquotasDisplay() {
  const { cliente, produto, cargaTributaria, simplesOutput } = useCalculadoraStore()

  if (!cliente || !produto) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alíquotas e Tributação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Selecione um cliente e produto para ver as alíquotas.
          </p>
        </CardContent>
      </Card>
    )
  }

  const tipoIcmsLabels: Record<string, string> = {
    normal: 'Normal',
    substituicao_tributaria: 'Substituição Tributária',
    isento: 'Isento',
    reduzido: 'Reduzido',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Alíquotas e Tributação
          <Badge variant="outline">{tipoIcmsLabels[produto.tipo_icms]}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Carga Tributária Total</dt>
            <dd className="text-lg font-bold text-primary">{formatNumber(cargaTributaria)}%</dd>
          </div>

          {simplesOutput && (
            <>
              <div>
                <dt className="text-muted-foreground">Alíquota Efetiva (Simples)</dt>
                <dd className="font-mono">{formatNumber(simplesOutput.aliquotaEfetiva)}%</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">ICMS dentro do Simples</dt>
                <dd className="font-mono">{formatNumber(simplesOutput.icmsDentroSimples)}%</dd>
              </div>
              {simplesOutput.icmsStForaDAS && (
                <>
                  <div>
                    <dt className="text-muted-foreground">Alíquota sem ICMS (DAS)</dt>
                    <dd className="font-mono">{formatNumber(simplesOutput.aliquotaSemIcms)}%</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">ICMS-ST (fora DAS)</dt>
                    <dd className="font-mono">
                      R$ {formatNumber(simplesOutput.icmsStValor)}
                    </dd>
                  </div>
                </>
              )}
              <div className="col-span-full">
                <dt className="mb-1 text-muted-foreground">Distribuição dos Tributos</dt>
                <dd className="flex flex-wrap gap-2">
                  <Badge variant="secondary">IRPJ: {formatNumber(simplesOutput.detalhamento.irpj)}%</Badge>
                  <Badge variant="secondary">CSLL: {formatNumber(simplesOutput.detalhamento.csll)}%</Badge>
                  <Badge variant="secondary">COFINS: {formatNumber(simplesOutput.detalhamento.cofins)}%</Badge>
                  <Badge variant="secondary">PIS: {formatNumber(simplesOutput.detalhamento.pis)}%</Badge>
                  <Badge variant="secondary">CPP: {formatNumber(simplesOutput.detalhamento.cpp)}%</Badge>
                  <Badge variant="secondary">ICMS: {formatNumber(simplesOutput.detalhamento.icms)}%</Badge>
                </dd>
              </div>
            </>
          )}

          {!simplesOutput && (
            <>
              <div>
                <dt className="text-muted-foreground">ICMS</dt>
                <dd className="font-mono">
                  {produto.tipo_icms === 'isento' ? 'Isento' : `${formatNumber(Number(produto.aliquota_icms))}%`}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">IPI</dt>
                <dd className="font-mono">{formatNumber(Number(produto.aliquota_ipi))}%</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">PIS</dt>
                <dd className="font-mono">1,65%</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">COFINS</dt>
                <dd className="font-mono">7,60%</dd>
              </div>
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
