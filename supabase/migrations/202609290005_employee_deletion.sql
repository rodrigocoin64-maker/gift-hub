-- Exclusão administrativa completa e transacional dos dados de ponto do funcionário.
-- A conta Auth é removida pela Edge Function; este RPC remove pontos e cadastro em uma transação.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public."Funcionarios"') IS NULL THEN
    RAISE EXCEPTION 'A tabela public."Funcionarios" não existe.';
  END IF;
  IF to_regclass('public.pontos') IS NULL THEN
    RAISE EXCEPTION 'A tabela public.pontos não existe.';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Funcionarios' AND column_name = 'id'
  ) OR NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pontos' AND column_name = 'funcionario_id'
  ) THEN
    RAISE EXCEPTION 'Faltam colunas necessárias à exclusão de funcionário.';
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.excluir_funcionario(p_funcionario_id bigint)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_pontos_excluidos integer := 0;
  v_funcionarios_excluidos integer := 0;
  v_nome text;
BEGIN
  IF COALESCE(auth.role(), '') <> 'service_role' THEN
    RAISE EXCEPTION 'ACESSO_NEGADO' USING ERRCODE = '42501';
  END IF;

  IF p_funcionario_id IS NULL OR p_funcionario_id <= 0 THEN
    RAISE EXCEPTION 'FUNCIONARIO_INVALIDO' USING ERRCODE = '22023';
  END IF;

  SELECT f.nome
  INTO v_nome
  FROM public."Funcionarios" AS f
  WHERE f.id = p_funcionario_id
  FOR UPDATE;

  DELETE FROM public.pontos AS p
  WHERE p.funcionario_id = p_funcionario_id;
  GET DIAGNOSTICS v_pontos_excluidos = ROW_COUNT;

  DELETE FROM public."Funcionarios" AS f
  WHERE f.id = p_funcionario_id;
  GET DIAGNOSTICS v_funcionarios_excluidos = ROW_COUNT;

  RETURN pg_catalog.jsonb_build_object(
    'funcionarioId', p_funcionario_id,
    'nome', v_nome,
    'funcionarioExcluido', v_funcionarios_excluidos = 1,
    'pontosExcluidos', v_pontos_excluidos
  );
END;
$$;

REVOKE ALL PRIVILEGES
  ON FUNCTION public.excluir_funcionario(bigint)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE
  ON FUNCTION public.excluir_funcionario(bigint)
  TO service_role;

NOTIFY pgrst, 'reload schema';

COMMIT;
