-- Atualiza as regras da RPC sem alterar registros, vínculos ou policies existentes.
-- O limite de horário é avaliado no fuso local do projeto (São Paulo).

BEGIN;

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

  SELECT f.id
  INTO v_funcionario_id
  FROM public."Funcionarios" AS f
  WHERE f.auth_user_id = auth.uid()
  FOR UPDATE;

  IF v_funcionario_id IS NULL THEN
    RAISE EXCEPTION 'FUNCIONARIO_NAO_VINCULADO' USING ERRCODE = '42501';
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

-- A substituição da função preserva owner e privilégios já concedidos.
-- Reafirma explicitamente o acesso somente a usuários autenticados.
REVOKE ALL PRIVILEGES
  ON FUNCTION public.registrar_ponto(text, double precision, double precision)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE
  ON FUNCTION public.registrar_ponto(text, double precision, double precision)
  TO authenticated;

NOTIFY pgrst, 'reload schema';

COMMIT;
