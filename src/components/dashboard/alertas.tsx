import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface AlertasProps {
  clientesSemCalculo: { id: string; razao_social: string }[]
}

export function Alertas({ clientesSemCalculo }: AlertasProps) {
  if (clientesSemCalculo.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-amber-500" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {clientesSemCalculo.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">Clientes sem cálculos:</p>
              <ul className="space-y-1">
                {clientesSemCalculo.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/clientes/${c.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {c.razao_social}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
