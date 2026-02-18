'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { produtoSchema, type ProdutoFormData } from '@/lib/validations/produto'
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
import type { Produto } from '@/types/database'

interface ProdutoFormProps {
  defaultValues?: Partial<Produto>
  onSubmit: (data: ProdutoFormData) => Promise<void>
  submitLabel?: string
}

export function ProdutoForm({ defaultValues, onSubmit, submitLabel = 'Salvar' }: ProdutoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(produtoSchema) as any,
    defaultValues: {
      nome: defaultValues?.nome || '',
      ncm_1: defaultValues?.ncm_1 || '',
      ncm_2: defaultValues?.ncm_2 || '',
      descricao: defaultValues?.descricao || '',
      custo_aquisicao: defaultValues?.custo_aquisicao ? Number(defaultValues.custo_aquisicao) : undefined,
      tipo_icms: defaultValues?.tipo_icms || undefined,
      reducao_icms: defaultValues?.reducao_icms ? Number(defaultValues.reducao_icms) : 0,
      aliquota_icms: defaultValues?.aliquota_icms ? Number(defaultValues.aliquota_icms) : 0,
      mva_iva: defaultValues?.mva_iva ? Number(defaultValues.mva_iva) : 0,
      descricao_tipi: defaultValues?.descricao_tipi || '',
      aliquota_ipi: defaultValues?.aliquota_ipi ? Number(defaultValues.aliquota_ipi) : 0,
      margem_desejada: defaultValues?.margem_desejada ? Number(defaultValues.margem_desejada) : 0,
    },
  })

  const tipoIcms = watch('tipo_icms')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Produto *</Label>
          <Input id="nome" {...register('nome')} />
          {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="custo_aquisicao">Custo de Aquisição (R$) *</Label>
          <Input id="custo_aquisicao" type="number" step="0.01" {...register('custo_aquisicao')} />
          {errors.custo_aquisicao && <p className="text-sm text-destructive">{errors.custo_aquisicao.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ncm_1">NCM Principal *</Label>
          <Input id="ncm_1" {...register('ncm_1')} placeholder="8 dígitos" maxLength={8} />
          {errors.ncm_1 && <p className="text-sm text-destructive">{errors.ncm_1.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ncm_2">NCM Secundário</Label>
          <Input id="ncm_2" {...register('ncm_2')} placeholder="8 dígitos (opcional)" maxLength={8} />
        </div>

        <div className="space-y-2">
          <Label>Tipo ICMS *</Label>
          <Select
            defaultValue={defaultValues?.tipo_icms}
            onValueChange={(val) => setValue('tipo_icms', val as ProdutoFormData['tipo_icms'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="substituicao_tributaria">Substituição Tributária (ST)</SelectItem>
              <SelectItem value="isento">Isento</SelectItem>
              <SelectItem value="reduzido">Reduzido</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipo_icms && <p className="text-sm text-destructive">{errors.tipo_icms.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="aliquota_icms">Alíquota ICMS (%)</Label>
          <Input id="aliquota_icms" type="number" step="0.01" {...register('aliquota_icms')} />
        </div>

        {tipoIcms === 'substituicao_tributaria' && (
          <div className="space-y-2">
            <Label htmlFor="mva_iva">MVA/IVA (%)</Label>
            <Input id="mva_iva" type="number" step="0.01" {...register('mva_iva')} />
          </div>
        )}

        {tipoIcms === 'reduzido' && (
          <div className="space-y-2">
            <Label htmlFor="reducao_icms">Redução Base ICMS (%)</Label>
            <Input id="reducao_icms" type="number" step="0.01" {...register('reducao_icms')} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="aliquota_ipi">Alíquota IPI (%)</Label>
          <Input id="aliquota_ipi" type="number" step="0.01" {...register('aliquota_ipi')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="margem_desejada">Margem Desejada (%)</Label>
          <Input id="margem_desejada" type="number" step="0.1" {...register('margem_desejada')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao_tipi">Descrição TIPI</Label>
          <Input id="descricao_tipi" {...register('descricao_tipi')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" {...register('descricao')} rows={2} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : submitLabel}
      </Button>
    </form>
  )
}
