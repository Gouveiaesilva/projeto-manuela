import { z } from 'zod'
import { ncmSchema } from './common'

export const produtoSchema = z.object({
  nome: z.string().min(2, 'Mínimo 2 caracteres').max(200),
  ncm_1: ncmSchema,
  ncm_2: ncmSchema.optional().or(z.literal('')),
  descricao: z.string().max(500).optional().or(z.literal('')),
  custo_aquisicao: z.coerce.number().positive('Custo deve ser maior que zero'),
  tipo_icms: z.enum(['normal', 'substituicao_tributaria', 'isento', 'reduzido'], {
    message: 'Selecione o tipo de ICMS',
  }),
  reducao_icms: z.coerce.number().min(0).max(100).default(0),
  aliquota_icms: z.coerce.number().min(0).max(100).default(0),
  mva_iva: z.coerce.number().min(0).max(200).default(0),
  descricao_tipi: z.string().max(500).optional().or(z.literal('')),
  aliquota_ipi: z.coerce.number().min(0).max(100).default(0),
  margem_desejada: z.coerce.number().min(0).max(99).default(0),
})

export type ProdutoFormData = z.infer<typeof produtoSchema>
