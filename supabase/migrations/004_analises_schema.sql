-- ============================================
-- Migration 004: Tabelas de Análises XML
-- ============================================

-- Tabela principal: metadados da NF-e + resumo da análise
CREATE TABLE IF NOT EXISTS analises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Dados da NF-e
  chave_acesso TEXT NOT NULL,
  numero_nfe INTEGER NOT NULL,
  serie INTEGER NOT NULL DEFAULT 1,
  data_emissao TIMESTAMPTZ,

  -- Emitente
  emit_cnpj TEXT NOT NULL,
  emit_razao_social TEXT NOT NULL,
  emit_nome_fantasia TEXT,
  emit_uf TEXT,
  emit_crt INTEGER,

  -- Destinatário
  dest_cnpj TEXT,
  dest_razao_social TEXT,
  dest_uf TEXT,

  -- Totais da NF
  valor_produtos DECIMAL(15,2) NOT NULL DEFAULT 0,
  valor_nf DECIMAL(15,2) NOT NULL DEFAULT 0,
  icms_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  icms_st_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  ipi_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  pis_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  cofins_total DECIMAL(15,2) NOT NULL DEFAULT 0,

  -- Config usada na análise
  config_rbt12 DECIMAL(15,2) NOT NULL,
  config_anexo TEXT NOT NULL,
  config_margem DECIMAL(5,2) NOT NULL,

  -- Resumo
  total_produtos INTEGER NOT NULL DEFAULT 0,
  carga_media_percentual DECIMAL(5,2),
  margem_media DECIMAL(5,2),
  produtos_lucrativos INTEGER NOT NULL DEFAULT 0,
  produtos_deficitarios INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabela de produtos analisados
CREATE TABLE IF NOT EXISTS analise_produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analise_id UUID NOT NULL REFERENCES analises(id) ON DELETE CASCADE,

  -- Dados do produto
  numero_item INTEGER NOT NULL,
  codigo TEXT,
  descricao TEXT NOT NULL,
  ncm TEXT,
  cfop TEXT,
  unidade TEXT,
  quantidade DECIMAL(15,4) NOT NULL DEFAULT 0,
  valor_unitario DECIMAL(15,4) NOT NULL DEFAULT 0,
  valor_total DECIMAL(15,2) NOT NULL DEFAULT 0,

  -- Impostos do XML
  icms_cst TEXT,
  icms_base DECIMAL(15,2) DEFAULT 0,
  icms_aliquota DECIMAL(5,2) DEFAULT 0,
  icms_valor DECIMAL(15,2) DEFAULT 0,
  icms_st_base DECIMAL(15,2) DEFAULT 0,
  icms_st_mva DECIMAL(5,2) DEFAULT 0,
  icms_st_valor DECIMAL(15,2) DEFAULT 0,
  ipi_valor DECIMAL(15,2) DEFAULT 0,
  pis_valor DECIMAL(15,2) DEFAULT 0,
  cofins_valor DECIMAL(15,2) DEFAULT 0,

  -- Resultados da análise
  carga_tributaria_percentual DECIMAL(5,2),
  aliquota_efetiva DECIMAL(5,2),
  icms_st_fora_das BOOLEAN DEFAULT false,
  icms_st_calculado DECIMAL(15,2) DEFAULT 0,
  preco_sugerido DECIMAL(15,2),
  margem_percentual DECIMAL(5,2),
  margem_liquida DECIMAL(15,2),
  markup DECIMAL(7,2),
  classificacao TEXT CHECK (classificacao IN ('alta', 'media', 'baixa', 'negativa')),
  insight TEXT,

  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_analises_user_id ON analises(user_id);
CREATE INDEX IF NOT EXISTS idx_analises_created_at ON analises(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analises_emit_cnpj ON analises(emit_cnpj);
CREATE INDEX IF NOT EXISTS idx_analise_produtos_analise_id ON analise_produtos(analise_id);

-- RLS
ALTER TABLE analises ENABLE ROW LEVEL SECURITY;
ALTER TABLE analise_produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas suas análises"
  ON analises FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários inserem apenas suas análises"
  ON analises FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários deletam apenas suas análises"
  ON analises FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários veem produtos de suas análises"
  ON analise_produtos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM analises
      WHERE analises.id = analise_produtos.analise_id
      AND analises.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários inserem produtos de suas análises"
  ON analise_produtos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM analises
      WHERE analises.id = analise_produtos.analise_id
      AND analises.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários deletam produtos de suas análises"
  ON analise_produtos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM analises
      WHERE analises.id = analise_produtos.analise_id
      AND analises.user_id = auth.uid()
    )
  );

-- Trigger updated_at
CREATE OR REPLACE TRIGGER set_updated_at_analises
  BEFORE UPDATE ON analises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
