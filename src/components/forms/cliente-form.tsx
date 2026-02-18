'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clienteSchema, type ClienteFormData } from '@/lib/validations/cliente'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Cliente } from '@/types/database'

interface ClienteFormProps {
  defaultValues?: Partial<Cliente>
  onSubmit: (data: ClienteFormData) => Promise<void>
  submitLabel?: string
}

export function ClienteForm({ defaultValues, onSubmit, submitLabel = 'Salvar' }: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(clienteSchema) as any,
    defaultValues: {
      razao_social: defaultValues?.razao_social || '',
      nome_fantasia: defaultValues?.nome_fantasia || '',
      cnpj: defaultValues?.cnpj || '',
      regime: defaultValues?.regime || undefined,
      atividade: defaultValues?.atividade || undefined,
      anexo_simples: defaultValues?.anexo_simples || undefined,
      rbt12: defaultValues?.rbt12 ? Number(defaultValues.rbt12) : undefined,
      telefone: defaultValues?.telefone || '',
      email: defaultValues?.email || '',
      observacoes: defaultValues?.observacoes || '',
    },
  })

  const regime = watch('regime')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="razao_social">Razão Social *</Label>
          <Input id="razao_social" {...register('razao_social')} />
          {errors.razao_social && (
            <p className="text-sm text-destructive">{errors.razao_social.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
          <Input id="nome_fantasia" {...register('nome_fantasia')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input id="cnpj" {...register('cnpj')} placeholder="00.000.000/0000-00" />
          {errors.cnpj && (
            <p className="text-sm text-destructive">{errors.cnpj.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Regime Tributário *</Label>
          <Select
            defaultValue={defaultValues?.regime}
            onValueChange={(val) => setValue('regime', val as ClienteFormData['regime'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
              <SelectItem value="lucro_real">Lucro Real</SelectItem>
              <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
            </SelectContent>
          </Select>
          {errors.regime && (
            <p className="text-sm text-destructive">{errors.regime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Atividade *</Label>
          <Select
            defaultValue={defaultValues?.atividade}
            onValueChange={(val) => setValue('atividade', val as ClienteFormData['atividade'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industria">Indústria</SelectItem>
              <SelectItem value="comercio_revenda">Comércio - Revenda</SelectItem>
              <SelectItem value="comercio_encomenda">Comércio - Encomenda</SelectItem>
            </SelectContent>
          </Select>
          {errors.atividade && (
            <p className="text-sm text-destructive">{errors.atividade.message}</p>
          )}
        </div>

        {regime === 'simples_nacional' && (
          <>
            <div className="space-y-2">
              <Label>Anexo do Simples Nacional</Label>
              <Select
                defaultValue={defaultValues?.anexo_simples || undefined}
                onValueChange={(val) => setValue('anexo_simples', val as ClienteFormData['anexo_simples'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anexo_i">Anexo I - Comércio</SelectItem>
                  <SelectItem value="anexo_ii">Anexo II - Indústria</SelectItem>
                  <SelectItem value="anexo_iii">Anexo III - Serviços</SelectItem>
                  <SelectItem value="anexo_iv">Anexo IV - Serviços</SelectItem>
                  <SelectItem value="anexo_v">Anexo V - Serviços</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rbt12">RBT12 - Receita Bruta 12 meses (R$)</Label>
              <Input
                id="rbt12"
                type="number"
                step="0.01"
                {...register('rbt12')}
                placeholder="Ex: 250000.00"
              />
              {errors.rbt12 && (
                <p className="text-sm text-destructive">{errors.rbt12.message}</p>
              )}
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" {...register('telefone')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea id="observacoes" {...register('observacoes')} rows={3} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : submitLabel}
      </Button>
    </form>
  )
}
