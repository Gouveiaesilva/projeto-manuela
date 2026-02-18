'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCalculadoraStore } from '@/stores/calculadora-store'
import { formatCurrency } from '@/lib/utils'
import type { CustoComposicao } from '@/types/calculadora'

const custoFields: { key: keyof CustoComposicao; label: string }[] = [
  { key: 'custoCompra', label: 'Custo de Compra (R$)' },
  { key: 'custoEmbalagem', label: 'Embalagem (R$)' },
  { key: 'custoMaoObra', label: 'Mão de Obra (R$)' },
  { key: 'custoOperacional', label: 'Operacional (R$)' },
  { key: 'custoFrete', label: 'Frete (R$)' },
  { key: 'custoOutros', label: 'Outros Custos (R$)' },
]

export function FormacaoCusto() {
  const { custos, custoTotal, margemDesejada, setCusto, setMargemDesejada, cliente, produto } =
    useCalculadoraStore()

  const disabled = !cliente || !produto

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formação de Custo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {custoFields.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="number"
                step="0.01"
                min="0"
                value={custos[key] || ''}
                onChange={(e) => setCusto(key, Number(e.target.value) || 0)}
                disabled={disabled}
              />
            </div>
          ))}

          <div className="space-y-1">
            <Label htmlFor="margem_desejada">Margem Desejada (%)</Label>
            <Input
              id="margem_desejada"
              type="number"
              step="0.1"
              min="0"
              max="99"
              value={margemDesejada || ''}
              onChange={(e) => setMargemDesejada(Number(e.target.value) || 0)}
              disabled={disabled}
            />
          </div>
        </div>

        {custoTotal > 0 && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <span className="text-sm text-muted-foreground">Custo Total</span>
            <p className="text-2xl font-bold">{formatCurrency(custoTotal)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
