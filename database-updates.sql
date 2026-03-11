-- Execute este script no SQL Editor do seu Supabase para adicionar as novas funcionalidades de Caixa

-- 1. Adicionar coluna de método de pagamento na tabela de vendas
ALTER TABLE sales ADD COLUMN IF NOT EXISTS payment_method text CHECK (payment_method IN ('dinheiro', 'cartao_credito', 'cartao_debito', 'pix'));

-- 2. Criar tabela de controle de caixa (cash_registers)
CREATE TABLE IF NOT EXISTS cash_registers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  opened_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  closed_at timestamp with time zone,
  initial_balance numeric NOT NULL DEFAULT 0,
  final_balance numeric,
  status text NOT NULL CHECK (status IN ('open', 'closed')) DEFAULT 'open'
);

-- 3. Adicionar referência do caixa na tabela de vendas (opcional, mas recomendado para relatórios)
ALTER TABLE sales ADD COLUMN IF NOT EXISTS cash_register_id uuid REFERENCES cash_registers(id);

-- 4. Políticas de Segurança (RLS) para cash_registers
ALTER TABLE cash_registers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de caixas para todos" 
ON cash_registers FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção de caixas para todos" 
ON cash_registers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização de caixas para todos" 
ON cash_registers FOR UPDATE 
USING (true);
