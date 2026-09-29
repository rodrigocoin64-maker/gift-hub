-- Recebe a qualidade e idade da leitura do navegador, mas mantém a decisão
-- final e o horário oficial no RPC server-side já instalado.
-- Accuracy máxima de 100 m evita aceitar fixes muito imprecisos sem exigir
-- precisão irrealista de GPS em celulares comuns. A leitura deve ter até 30 s;
-- tolera até 5 s de diferença futura por pequenas diferenças de relógio.
BEGIN;

REVOKE ALL PRIVILEGES
  ON FUNCTION public.registrar_ponto(text, double precision, double precision)
  FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.registrar_ponto(
  p_tipo text,
  p_latitude double precision,
  p_longitude double precision,
  p_accuracy double precision,
  p_timestamp bigint
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_instante timestamptz := pg_catalog.clock_timestamp();
  v_timestamp_servidor_ms bigint;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'SESSAO_NAO_AUTENTICADA' USING ERRCODE = '42501';
  END IF;

  IF p_latitude IS NULL OR p_longitude IS NULL
    OR p_latitude < -90 OR p_latitude > 90
    OR p_longitude < -180 OR p_longitude > 180 THEN
    RAISE EXCEPTION 'LOCALIZACAO_INVALIDA' USING ERRCODE = '22023';
  END IF;

  IF p_accuracy IS NULL
    OR p_accuracy::text IN ('NaN', 'Infinity', '-Infinity')
    OR p_accuracy <= 0 OR p_accuracy > 100 THEN
    RAISE EXCEPTION 'LOCALIZACAO_IMPRECISA' USING ERRCODE = '22023';
  END IF;

  v_timestamp_servidor_ms := pg_catalog.floor(
    pg_catalog.date_part('epoch', v_instante) * 1000
  )::bigint;
  IF p_timestamp IS NULL
    OR p_timestamp < v_timestamp_servidor_ms - 30000
    OR p_timestamp > v_timestamp_servidor_ms + 5000 THEN
    RAISE EXCEPTION 'LOCALIZACAO_DESATUALIZADA' USING ERRCODE = '22023';
  END IF;

  -- O RPC de três argumentos já valida auth.uid(), funcionário vinculado,
  -- raio de 100 m, horário 07:00–20:00 em America/Sao_Paulo, jornada e usa
  -- clock_timestamp() do servidor para gravar entrada/saída. Ele deixa de ser
  -- diretamente executável por authenticated e só é chamado por este wrapper.
  RETURN public.registrar_ponto(p_tipo, p_latitude, p_longitude);
END;
$$;

REVOKE ALL PRIVILEGES
  ON FUNCTION public.registrar_ponto(text, double precision, double precision, double precision, bigint)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE
  ON FUNCTION public.registrar_ponto(text, double precision, double precision, double precision, bigint)
  TO authenticated;

NOTIFY pgrst, 'reload schema';
COMMIT;
