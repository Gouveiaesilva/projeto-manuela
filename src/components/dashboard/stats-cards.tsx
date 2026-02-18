import { Card, CardContent } from '@/components/ui/card'
import { Users, FileText, Calculator, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface StatsCardsProps {
  totalClientes: number
  totalAnalises: number
  totalCalculos: number
  margemMedia: number | null
}

export function StatsCards({ totalClientes, totalAnalises, totalCalculos, margemMedia }: StatsCardsProps) {
  const cards = [
    {
      title: 'Análises XML',
      value: totalAnalises.toString(),
      icon: FileText,
      color: 'text-primary bg-primary/10',
    },
    {
      title: 'Clientes',
      value: totalClientes.toString(),
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Cálculos Manuais',
      value: totalCalculos.toString(),
      icon: Calculator,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Margem Média',
      value: margemMedia !== null ? `${formatNumber(margemMedia)}%` : '-',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="transition-shadow hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{card.value}</p>
              </div>
              <div className={`rounded-lg p-2.5 ${card.color}`}>
                <card.icon className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
