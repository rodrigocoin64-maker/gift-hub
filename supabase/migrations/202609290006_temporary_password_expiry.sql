-- Prazo curto para credenciais temporárias e invalidação de sessões anteriores
-- à troca da senha. A migration não remove nem altera registros de ponto.

BEGIN;

ALTER TABLE public."Funcionarios"
  ADD COLUMN IF NOT EXISTS primeiro_acesso_expira_em timestamptz,
  ADD COLUMN IF NOT EXISTS primeiro_acesso_concluido_em timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Funcionarios'
      AND column_name = 'primeiro_acesso_expira_em' AND data_type = 'timestamp with time zone'
  ) OR NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Funcionarios'
      AND column_name = 'primeiro_acesso_concluido_em' AND data_type = 'timestamp with time zone'
  ) THEN
    RAISE EXCEPTION 'As colunas de validade do primeiro acesso precisam ser timestamptz.';
  END IF;
END
$$;

-- Contas que já aguardavam primeiro acesso recebem um prazo a partir desta migration.
UPDATE public."Funcionarios"
SET primeiro_acesso_expira_em = pg_catalog.clock_timestamp() + INTERVAL '48 hours'
WHERE primeiro_acesso IS TRUE
  AND primeiro_acesso_expira_em IS NULL;

GRANT UPDATE (primeiro_acesso, primeiro_acesso_expira_em, primeiro_acesso_concluido_em)
  ON TABLE public."Funcionarios"
  TO service_role;

-- Uma sessão emitida antes de a senha definitiva ser gravada não pode ler o histórico.
-- Esta policy é um guard restritivo adicional; policies existentes são preservadas.
DO $$
DECLARE
  v_policy record;
BEGIN
  SELECT * INTO v_policy
  FROM pg_catalog.pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'pontos'
    AND policyname = 'pontos_first_access_expiry_guard';

  IF FOUND THEN
    IF v_policy.permissive <> 'RESTRICTIVE'
      OR v_policy.cmd <> 'SELECT'
      OR v_policy.roles::text <> '{authenticated}'
      OR v_policy.qual IS NULL
      OR v_policy.qual NOT ILIKE '%auth.uid%'
      OR v_policy.qual NOT ILIKE '%auth.jwt%'
      OR v_policy.qual NOT ILIKE '%primeiro_acesso_expira_em%'
      OR v_policy.qual NOT ILIKE '%primeiro_acesso_concluido_em%' THEN
      RAISE EXCEPTION 'A policy pontos_first_access_expiry_guard existe com configuração diferente; revise-a antes de continuar.';
    END IF;
  ELSE
    CREATE POLICY pontos_first_access_expiry_guard
      ON public.pontos
      AS RESTRICTIVE
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public."Funcionarios" AS f
          WHERE f.id = pontos.funcionario_id
            AND f.auth_user_id = (SELECT auth.uid())
            AND f.primeiro_acesso = false
            AND (f.primeiro_acesso_expira_em IS NULL
              OR f.primeiro_acesso_expira_em > pg_catalog.clock_timestamp())
            AND (
              f.primeiro_acesso_concluido_em IS NULL
              OR COALESCE(((SELECT auth.jwt()) ->> 'iat')::bigint, 0)
                >= pg_catalog.floor(pg_catalog.date_part('epoch', f.primeiro_acesso_concluido_em))::bigint
            )
        )
      );
  END IF;
END
$$;

-- Defense in depth para INSERT/UPDATE de pontos, inclusive chamadas diretas a RPCs.
-- auth.uid(), o funcionário vinculado, a expiração e o iat do JWT são revalidados no banco.
CREATE OR REPLACE FUNCTION public.validar_sessao_registro_ponto()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_auth_user_id uuid;
  v_primeiro_acesso boolean;
  v_expira_em timestamptz;
  v_concluido_em timestamptz;
  v_token_iat bigint;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'SESSAO_NAO_AUTENTICADA' USING ERRCODE = '42501';
  END IF;

  SELECT f.auth_user_id, f.primeiro_acesso,
         f.primeiro_acesso_expira_em, f.primeiro_acesso_concluido_em
  INTO v_auth_user_id, v_primeiro_acesso, v_expira_em, v_concluido_em
  FROM public."Funcionarios" AS f
  WHERE f.id = NEW.funcionario_id
  FOR SHARE;

  IF v_auth_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'FUNCIONARIO_NAO_VINCULADO' USING ERRCODE = '42501';
  END IF;

  IF v_primeiro_acesso IS TRUE THEN
    IF v_expira_em IS NULL OR v_expira_em <= pg_catalog.clock_timestamp() THEN
      RAISE EXCEPTION 'PRIMEIRO_ACESSO_EXPIRADO' USING ERRCODE = '42501';
    END IF;
    RAISE EXCEPTION 'PRIMEIRO_ACESSO_PENDENTE' USING ERRCODE = '42501';
  END IF;

  v_token_iat := COALESCE(((auth.jwt()) ->> 'iat')::bigint, 0);
  IF v_concluido_em IS NOT NULL
    AND v_token_iat < pg_catalog.floor(pg_catalog.date_part('epoch', v_concluido_em))::bigint THEN
    RAISE EXCEPTION 'SESSAO_ANTERIOR_A_TROCA' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL PRIVILEGES
  ON FUNCTION public.validar_sessao_registro_ponto()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS pontos_validar_sessao_funcionario ON public.pontos;
CREATE TRIGGER pontos_validar_sessao_funcionario
  BEFORE INSERT OR UPDATE ON public.pontos
  FOR EACH ROW
  EXECUTE FUNCTION public.validar_sessao_registro_ponto();

NOTIFY pgrst, 'reload schema';

COMMIT;
