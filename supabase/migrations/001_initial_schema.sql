-- ============================================
-- PreciFácil - Schema Inicial
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE regime_tributario AS ENUM ('simples_nacional', 'lucro_real', 'lucro_presumido');
CREATE TYPE atividade_tipo AS ENUM ('industria', 'comercio_revenda', 'comercio_encomenda');
CREATE TYPE anexo_simples AS ENUM ('anexo_i', 'anexo_ii', 'anexo_iii', 'anexo_iv', 'anexo_v');
CREATE TYPE tipo_icms AS ENUM ('normal', 'substituicao_tributaria', 'isento', 'reduzido');
CREATE TYPE operacao_tipo AS ENUM ('revenda', 'industrializacao', 'encomenda');
CREATE TYPE documento_categoria AS ENUM ('nota_fiscal', 'planilha', 'documento_tributario', 'comprovante', 'outro');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT NOT NULL DEFAULT '',
  telefone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grupos de clientes
CREATE TABLE grupos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  cnpj TEXT NOT NULL,
  regime regime_tributario NOT NULL,
  atividade atividade_tipo NOT NULL,
  anexo_simples anexo_simples,
  faixa_faturamento INTEGER,
  rbt12 NUMERIC(15, 2),
  telefone TEXT,
  email TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cnpj_unique_per_user UNIQUE (user_id, cnpj)
);

-- Produtos
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ncm_1 TEXT NOT NULL,
  ncm_2 TEXT,
  descricao TEXT,
  custo_aquisicao NUMERIC(12, 2) NOT NULL,
  tipo_icms tipo_icms NOT NULL DEFAULT 'normal',
  reducao_icms NUMERIC(5, 2) DEFAULT 0,
  aliquota_icms NUMERIC(5, 2) DEFAULT 0,
  mva_iva NUMERIC(5, 2) DEFAULT 0,
  descricao_tipi TEXT,
  aliquota_ipi NUMERIC(5, 2) DEFAULT 0,
  margem_desejada NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custos fixos
CREATE TABLE custos_fixos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor NUMERIC(12, 2) NOT NULL,
  categoria TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cálculos
CREATE TABLE calculos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  operacao operacao_tipo NOT NULL,
  regime_calculo regime_tributario NOT NULL,
  custo_compra NUMERIC(12, 2) NOT NULL,
  custo_embalagem NUMERIC(12, 2) DEFAULT 0,
  custo_mao_obra NUMERIC(12, 2) DEFAULT 0,
  custo_operacional NUMERIC(12, 2) DEFAULT 0,
  custo_frete NUMERIC(12, 2) DEFAULT 0,
  custo_outros NUMERIC(12, 2) DEFAULT 0,
  custo_total NUMERIC(12, 2) NOT NULL,
  carga_tributaria_percentual NUMERIC(5, 2) NOT NULL,
  aliquota_efetiva_simples NUMERIC(5, 2),
  icms_dentro_simples NUMERIC(5, 2),
  icms_st_fora_das BOOLEAN DEFAULT FALSE,
  icms_st_valor NUMERIC(12, 2) DEFAULT 0,
  preco_sugerido NUMERIC(12, 2) NOT NULL,
  imposto_valor NUMERIC(12, 2) NOT NULL,
  margem_liquida NUMERIC(12, 2) NOT NULL,
  margem_percentual NUMERIC(5, 2) NOT NULL,
  markup NUMERIC(5, 2) NOT NULL,
  margem_contribuicao NUMERIC(12, 2) NOT NULL,
  ponto_equilibrio NUMERIC(12, 2),
  lucro_desejado NUMERIC(12, 2),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cenários de simulação
CREATE TABLE cenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calculo_id UUID NOT NULL REFERENCES calculos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  preco_venda NUMERIC(12, 2) NOT NULL,
  imposto NUMERIC(12, 2) NOT NULL,
  receita_liquida NUMERIC(12, 2) NOT NULL,
  custo NUMERIC(12, 2) NOT NULL,
  margem_liquida NUMERIC(12, 2) NOT NULL,
  margem_percentual NUMERIC(5, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES produtos(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  categoria documento_categoria NOT NULL DEFAULT 'outro',
  arquivo_url TEXT NOT NULL,
  tamanho INTEGER NOT NULL,
  tipo_mime TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_clientes_user_id ON clientes(user_id);
CREATE INDEX idx_clientes_cnpj ON clientes(cnpj);
CREATE INDEX idx_clientes_grupo ON clientes(grupo_id);
CREATE INDEX idx_produtos_cliente_id ON produtos(cliente_id);
CREATE INDEX idx_produtos_ncm ON produtos(ncm_1);
CREATE INDEX idx_calculos_user_id ON calculos(user_id);
CREATE INDEX idx_calculos_cliente_id ON calculos(cliente_id);
CREATE INDEX idx_calculos_produto_id ON calculos(produto_id);
CREATE INDEX idx_calculos_created ON calculos(created_at DESC);
CREATE INDEX idx_cenarios_calculo ON cenarios(calculo_id);
CREATE INDEX idx_documentos_cliente ON documentos(cliente_id);

-- Trigger: updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_grupos_updated BEFORE UPDATE ON grupos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_clientes_updated BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_produtos_updated BEFORE UPDATE ON produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_custos_fixos_updated BEFORE UPDATE ON custos_fixos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_calculos_updated BEFORE UPDATE ON calculos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
