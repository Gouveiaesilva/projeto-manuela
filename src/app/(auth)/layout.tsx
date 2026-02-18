import { Calculator, TrendingUp, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Calculator,
    title: 'Cálculo Automático',
    description: 'Precificação com todos os tributos calculados automaticamente',
  },
  {
    icon: TrendingUp,
    title: 'Simulação de Cenários',
    description: 'Compare margens e encontre o preço ideal para cada produto',
  },
  {
    icon: Shield,
    title: 'Simples Nacional',
    description: 'Suporte completo aos Anexos I a V com alíquota efetiva',
  },
  {
    icon: Zap,
    title: 'Tempo Real',
    description: 'KPIs atualizados instantaneamente a cada alteração',
  },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel esquerdo — Branding */}
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projeto Manuela</h1>
          <p className="mt-1 text-sm opacity-80">por Manuela Maia Contabilidade</p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              Precificação inteligente<br />para contadores
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed opacity-80">
              Automatize cálculos tributários complexos e encontre o preço de venda
              ideal para cada produto dos seus clientes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg bg-white/10 p-4">
                <feature.icon className="mb-2 size-5" />
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="mt-1 text-xs leading-relaxed opacity-75">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs opacity-50">
          &copy; {new Date().getFullYear()} Projeto Manuela. Todos os direitos reservados.
        </p>
      </div>

      {/* Painel direito — Formulário */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Projeto Manuela</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Precificação inteligente para contadores
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
