'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { resetPassword } from './actions'
import { toast } from 'sonner'

export default function RecuperarSenhaPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await resetPassword(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      setSent(true)
      toast.success('E-mail de recuperação enviado!')
    }

    setLoading(false)
  }

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">E-mail enviado</CardTitle>
          <CardDescription className="text-center">
            Verifique sua caixa de entrada para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardFooter className="pt-4">
          <Link href="/login" className="text-sm text-muted-foreground hover:underline mx-auto">
            Voltar para o login
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Recuperar Senha</CardTitle>
        <CardDescription className="text-center">
          Informe seu e-mail para receber o link de recuperação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Link href="/login" className="text-sm text-muted-foreground hover:underline mx-auto">
          Voltar para o login
        </Link>
      </CardFooter>
    </Card>
  )
}
