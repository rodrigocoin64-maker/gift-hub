# Preparação para produção

O projeto ainda não está publicado. Quando escolher o host:

## Arquivos publicados

Configure a pasta de publicação como `public/` e a página inicial como `index.html` dentro dessa pasta. Não publique a raiz do projeto. Mantenha `supabase/`, `.git/`, `.env*`, dumps, backups e logs fora do artefato estático.

## Headers HTTPS

Configure os headers HTTP de resposta do host (não apenas tags HTML). Substitua `<PROJECT_ID>` pelo identificador público do projeto Supabase e teste a política contra a página publicada:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self'; connect-src 'self' https://<PROJECT_ID>.supabase.co; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), camera=(), microphone=()
Strict-Transport-Security: max-age=31536000
```

HSTS só deve ser habilitado depois que HTTPS estiver funcionando em todo o domínio. Acrescente `includeSubDomains` somente se todos os subdomínios também usarem HTTPS. Se o SDK passar a usar outro domínio/CDN ou Realtime, ajuste `connect-src` apenas para os hosts necessários. O CDN atual está fixado em versão; para reduzir a dependência externa, pode ser servido localmente após revisão da distribuição.

## Supabase Auth

- Em **Authentication → URL Configuration**, configure `Site URL` para a origem HTTPS de produção.
- Em **Redirect URLs**, permita apenas a URL exata da aplicação publicada e as rotas realmente usadas para recuperação de senha. Remova URLs temporárias de desenvolvimento na configuração de produção; não use curingas amplos.
- O fluxo monta o destino de recuperação a partir da origem e do caminho atuais. Confirme esse caminho na publicação final antes de restringir a allowlist.
- Revise as políticas RLS e o Security Advisor no próprio projeto após aplicar as migrations; esta auditoria local não consultou o banco remoto.

## Secrets das Edge Functions

Mantenha somente no ambiente server-side do Supabase:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (ou secret map equivalente aceito pelo código)
- `SUPABASE_ANON_KEY`/chave publicável para operações Auth server-side
- `DIRECTOR_BOOTSTRAP_EMAIL`, `DIRECTOR_BOOTSTRAP_CODE` e `DIRECTOR_BOOTSTRAP_ENABLED` somente durante um bootstrap inicial autorizado

O bootstrap está separado e desabilitado por padrão. Como já existe Diretor, remova/desconfigure os três secrets de bootstrap e deixe `DIRECTOR_BOOTSTRAP_ENABLED` ausente ou diferente de `true`. Nunca coloque a service role key em arquivos de `public/`.

## Localização e privacidade

A aplicação pública envia a leitura do navegador; o banco calcula a distância e usa o próprio relógio para o ponto. A precisão e o timestamp do navegador são sinais auxiliares e podem ser manipulados pelo usuário. As coordenadas permanecem na função SQL server-side, mas também constam em migrations históricas: mantenha o repositório privado. Se já tiver sido público, trate o local de trabalho como informação exposta e revise o histórico antes de abrir o repositório novamente.
