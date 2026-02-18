import { z } from 'zod'

export const calculoInputSchema = z.object({
  cliente_id: z.string().uuid(),
  produto_id: z.string().uuid(),
  operacao: z.enum(['revenda', 'industrializacao', 'encomenda']),
  custo_compra: z.coerce.number().positive('Custo deve ser positivo'),
  custo_embalagem: z.coerce.number().min(0).default(0),
  custo_mao_obra: z.coerce.number().min(0).default(0),
  custo_operacional: z.coerce.number().min(0).default(0),
  custo_frete: z.coerce.number().min(0).default(0),
  custo_outros: z.coerce.number().min(0).default(0),
  margem_desejada: z.coerce.number().min(0).max(99, 'Margem deve ser menor que 99%'),
})

export type CalculoInputData = z.infer<typeof calculoInputSchema>
