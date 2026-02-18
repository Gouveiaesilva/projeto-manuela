-- ============================================
-- PreciFácil - Row Level Security
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE custos_fixos ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Grupos
CREATE POLICY "grupos_select_own" ON grupos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "grupos_insert_own" ON grupos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "grupos_update_own" ON grupos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "grupos_delete_own" ON grupos FOR DELETE USING (auth.uid() = user_id);

-- Clientes
CREATE POLICY "clientes_select_own" ON clientes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "clientes_insert_own" ON clientes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clientes_update_own" ON clientes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "clientes_delete_own" ON clientes FOR DELETE USING (auth.uid() = user_id);

-- Produtos (via cliente)
CREATE POLICY "produtos_select_own" ON produtos FOR SELECT USING (
  EXISTS (SELECT 1 FROM clientes WHERE clientes.id = produtos.cliente_id AND clientes.user_id = auth.uid())
);
CREATE POLICY "produtos_insert_own" ON produtos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM clientes WHERE clientes.id = produtos.cliente_id AND clientes.user_id = auth.uid())
);
CREATE POLICY "produtos_update_own" ON produtos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM clientes WHERE clientes.id = produtos.cliente_id AND clientes.user_id = auth.uid())
);
CREATE POLICY "produtos_delete_own" ON produtos FOR DELETE USING (
  EXISTS (SELECT 1 FROM clientes WHERE clientes.id = produtos.cliente_id AND clientes.user_id = auth.uid())
);

-- Custos fixos (via cliente)
CREATE POLICY "custos_fixos_select_own" ON custos_fixos FOR SELECT USING (
  EXISTS (SELECT 1 FROM clientes WHERE clientes.id = custos_fixos.cliente_id AND clientes.user_id = auth.uid())
);
CREATE POLICY "custos_fixos_insert_own" ON custos_fixos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM clientes WHERE clientes.id = custos_fixos.cliente_id AND clientes.user_id = auth.uid())
);
CREATE POLICY "custos_fixos_update_own" ON custos_fixos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM clientes WHERE clientes.id = custos_fixos.cliente_id AND clientes.user_id = auth.uid())
);
CREATE POLICY "custos_fixos_delete_own" ON custos_fixos FOR DELETE USING (
  EXISTS (SELECT 1 FROM clientes WHERE clientes.id = custos_fixos.cliente_id AND clientes.user_id = auth.uid())
);

-- Cálculos
CREATE POLICY "calculos_select_own" ON calculos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "calculos_insert_own" ON calculos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "calculos_update_own" ON calculos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "calculos_delete_own" ON calculos FOR DELETE USING (auth.uid() = user_id);

-- Cenários (via cálculo)
CREATE POLICY "cenarios_select_own" ON cenarios FOR SELECT USING (
  EXISTS (SELECT 1 FROM calculos WHERE calculos.id = cenarios.calculo_id AND calculos.user_id = auth.uid())
);
CREATE POLICY "cenarios_insert_own" ON cenarios FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM calculos WHERE calculos.id = cenarios.calculo_id AND calculos.user_id = auth.uid())
);
CREATE POLICY "cenarios_delete_own" ON cenarios FOR DELETE USING (
  EXISTS (SELECT 1 FROM calculos WHERE calculos.id = cenarios.calculo_id AND calculos.user_id = auth.uid())
);

-- Documentos
CREATE POLICY "documentos_select_own" ON documentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documentos_insert_own" ON documentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documentos_delete_own" ON documentos FOR DELETE USING (auth.uid() = user_id);
