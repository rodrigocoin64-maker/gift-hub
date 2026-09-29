-- Primeiro acesso obrigatório para contas novas; contas já existentes permanecem ativas.
-- A senha temporária não é salva no banco. Auth guarda somente um comprovante HMAC
-- privado em app_metadata até o primeiro acesso ser concluído.

BEGIN;

ALTER TABLE public."Funcionarios"
  ADD COLUMN IF NOT EXISTS primeiro_acesso boolean;

DO $$
DECLARE
  v_tipo text;
  v_nullable text;
BEGIN
  SELECT data_type, is_nullable
  INTO v_tipo, v_nullable
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'Funcionarios'
    AND column_name = 'primeiro_acesso';

  IF v_tipo <> 'boolean' THEN
    RAISE EXCEPTION 'public."Funcionarios".primeiro_acesso precisa ser boolean.';
  END IF;

  IF v_nullable IS NULL THEN
    RAISE EXCEPTION 'A coluna public."Funcionarios".primeiro_acesso não foi criada.';
  END IF;
END
$$;

ALTER TABLE public."Funcionarios"
  ALTER COLUMN primeiro_acesso SET DEFAULT false;

UPDATE public."Funcionarios"
SET primeiro_acesso = false
WHERE primeiro_acesso IS NULL;

ALTER TABLE public."Funcionarios"
  ALTER COLUMN primeiro_acesso SET NOT NULL;

-- A Edge Function é a única API que pode alterar este marcador.
GRANT UPDATE (primeiro_acesso)
  ON TABLE public."Funcionarios"
  TO service_role;

-- Durante o primeiro acesso, o funcionário pode carregar o próprio perfil,
-- mas não pode consultar seus pontos pela API.
DO $$
DECLARE
  v_existente record;
BEGIN
  SELECT *
  INTO v_existente
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'pontos'
    AND policyname = 'pontos_first_access_select_guard';

  IF FOUND THEN
    IF v_existente.permissive <> 'RESTRICTIVE'
      OR v_existente.cmd <> 'SELECT'
      OR v_existente.roles::text <> '{authenticated}'
      OR v_existente.qual IS NULL
      OR v_existente.qual NOT ILIKE '%primeiro_acesso%'
      OR v_existente.qual NOT ILIKE '%auth.uid%' THEN
      RAISE EXCEPTION 'A policy pontos_first_access_select_guard existe com configuração diferente; revise-a antes de continuar.';
    END IF;
  ELSE
    CREATE POLICY pontos_first_access_select_guard
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
        )
      );
  END IF;
END
$$;

-- A RPC permanece responsável por raio, horário, auth.uid() e horário do servidor.
CREATE OR REPLACE FUNCTION public.registrar_ponto(
  p_tipo text,
  p_latitude double precision,
  p_longitude double precision
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_funcionario_id public."Funcionarios".id%TYPE;
  v_primeiro_acesso boolean;
  v_registro public.pontos%ROWTYPE;
  v_latitude_residencia CONSTANT double precision := -23.4668757;
  v_longitude_residencia CONSTANT double precision := -46.8714549;
  v_raio_permitido CONSTANT double precision := 100;
  v_a double precision;
  v_distancia double precision;
  v_instante timestamptz;
  v_horario_local time;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'SESSAO_NAO_AUTENTICADA' USING ERRCODE = '42501';
  END IF;

  IF p_tipo IS NULL OR p_tipo NOT IN ('Entrada', 'Saída') THEN
    RAISE EXCEPTION 'TIPO_DE_PONTO_INVALIDO' USING ERRCODE = '22023';
  END IF;

  v_instante := pg_catalog.clock_timestamp();
  v_horario_local := (v_instante AT TIME ZONE 'America/Sao_Paulo')::time;

  -- Permite todos os segundos do minuto 20:00; a partir de 20:01 bloqueia.
  IF v_horario_local < TIME '07:00:00'
    OR v_horario_local >= TIME '20:01:00' THEN
    RAISE EXCEPTION 'FORA_DO_HORARIO' USING ERRCODE = '42501';
  END IF;

  IF p_latitude IS NULL OR p_longitude IS NULL
    OR p_latitude < -90 OR p_latitude > 90
    OR p_longitude < -180 OR p_longitude > 180 THEN
    RAISE EXCEPTION 'LOCALIZACAO_INVALIDA' USING ERRCODE = '22023';
  END IF;

  v_a := pg_catalog.power(pg_catalog.sin(pg_catalog.radians(p_latitude - v_latitude_residencia) / 2), 2)
    + pg_catalog.cos(pg_catalog.radians(v_latitude_residencia))
    * pg_catalog.cos(pg_catalog.radians(p_latitude))
    * pg_catalog.power(pg_catalog.sin(pg_catalog.radians(p_longitude - v_longitude_residencia) / 2), 2);
  v_a := LEAST(1.0, GREATEST(0.0, v_a));
  v_distancia := 2 * 6371000 * pg_catalog.asin(pg_catalog.sqrt(v_a));

  IF v_distancia > v_raio_permitido THEN
    RAISE EXCEPTION 'FORA_DA_AREA' USING ERRCODE = '42501';
  END IF;

  SELECT f.id, f.primeiro_acesso
  INTO v_funcionario_id, v_primeiro_acesso
  FROM public."Funcionarios" AS f
  WHERE f.auth_user_id = auth.uid()
  FOR UPDATE;

  IF v_funcionario_id IS NULL THEN
    RAISE EXCEPTION 'FUNCIONARIO_NAO_VINCULADO' USING ERRCODE = '42501';
  END IF;
  IF v_primeiro_acesso IS TRUE THEN
    RAISE EXCEPTION 'PRIMEIRO_ACESSO_PENDENTE' USING ERRCODE = '42501';
  END IF;

  IF p_tipo = 'Entrada' THEN
    IF EXISTS (
      SELECT 1
      FROM public.pontos AS p
      WHERE p.funcionario_id = v_funcionario_id
        AND p.saida IS NULL
    ) THEN
      RAISE EXCEPTION 'JORNADA_ABERTA' USING ERRCODE = '23505';
    END IF;

    BEGIN
      INSERT INTO public.pontos (funcionario_id, entrada, saida)
      VALUES (v_funcionario_id, v_instante, NULL)
      RETURNING * INTO v_registro;
    EXCEPTION WHEN unique_violation THEN
      RAISE EXCEPTION 'JORNADA_ABERTA' USING ERRCODE = '23505';
    END;
  ELSE
    SELECT p.*
    INTO v_registro
    FROM public.pontos AS p
    WHERE p.funcionario_id = v_funcionario_id
      AND p.saida IS NULL
    ORDER BY p.entrada DESC
    LIMIT 1
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'SEM_JORNADA_ABERTA' USING ERRCODE = 'P0001';
    END IF;

    UPDATE public.pontos AS p
    SET saida = v_instante
    WHERE p.id = v_registro.id
    RETURNING p.* INTO v_registro;
  END IF;

  RETURN pg_catalog.jsonb_build_object(
    'id', v_registro.id,
    'funcionario_id', v_registro.funcionario_id,
    'entrada', v_registro.entrada,
    'saida', v_registro.saida
  );
END;
$$;

REVOKE ALL PRIVILEGES
  ON FUNCTION public.registrar_ponto(text, double precision, double precision)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE
  ON FUNCTION public.registrar_ponto(text, double precision, double precision)
  TO authenticated;

NOTIFY pgrst, 'reload schema';

COMMIT;
