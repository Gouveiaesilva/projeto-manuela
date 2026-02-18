import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Calculator, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CalculoResumo {
  id: string
  preco_sugerido: number
  margem_percentual: number
  created_at: string
  cliente_nome: string
  produto_nome: string
}

interface UltimosCalculosProps {
  calculos: CalculoResumo[]
}

export function UltimosCalculos({ calculos }: UltimosCalculosProps) {
  if (calculos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimos Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Calculator className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum cálculo realizado ainda.
            </p>
            <Button asChild size="sm">
              <Link href="/calculadora">Fazer primeiro cálculo</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Últimos Cálculos</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/calculadora">
            Ver todos <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {calculos.map((calculo) => (
            <Link
              key={calculo.id}
              href={`/calculadora/${calculo.id}`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{calculo.produto_nome}</p>
                <p className="text-sm text-muted-foreground">{calculo.cliente_nome}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-medium">{formatCurrency(Number(calculo.preco_sugerido))}</p>
                <Badge variant={Number(calculo.margem_percentual) >= 0 ? 'secondary' : 'destructive'}>
                  {formatNumber(Number(calculo.margem_percentual))}%
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
