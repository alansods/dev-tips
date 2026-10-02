## Why

O app tem um único tema. "Fundamentos web" foi o próximo tema escolhido. Ele combina com o CRUD, porque explica a base que toda API usa (HTTP, REST, navegador e segurança), e é assunto frequente em entrevistas fullstack.

## What Changes

- **Novo tema `fundamentos-web`**, sem frameworks nem tabela comparativa (o schema genérico já suporta), com 4 decks:
  - **HTTP**: 7 termos (HTTP, método, código de status, cabeçalho, corpo, HTTPS, cache HTTP);
  - **REST**: 6 termos (REST, recurso, stateless, path param, query string, versionamento);
  - **Navegador e segurança**: 8 termos (política de mesma origem, preflight, cookie, localStorage, sessão, XSS, CSRF, token de acesso);
  - **Perguntas de entrevista**: 6 cards (o que acontece ao digitar uma URL, cookie ou localStorage para o token, por que o OPTIONS antes do PUT, XSS vs CSRF, 304 Not Modified, REST vs GraphQL).
- **Conteúdo autoral:** o tema não vem de um material externo, então os cards são `original` (o próprio tema é a fonte) e não levam o selo "Complemento".
- **Sem duplicar termos do CRUD**, como CORS, JSON e API, para o glossário não repetir conceitos.
- **Glossário com dois temas:** a lista junta os termos de todos os temas e cada item mostra a que tema pertence.
- O tema é registrado no catálogo e aparece na Home, na aba Progresso e na revisão espaçada sem mudanças nessas telas.

## Capabilities

### New Capabilities
- `web-fundamentals-content`: o que o tema Fundamentos web precisa conter e como se liga ao glossário.

### Modified Capabilities
- `glossary`: a lista mostra o tema de cada termo quando há mais de um tema; os cenários de contagem e busca passam a considerar os dois temas.

## Impact

- **Novos arquivos:** `content/themes/fundamentos-web/theme.json` e testes em `src/content/__tests__/web-theme.test.ts`.
- **Arquivos alterados:** `src/content/catalog.ts` (registro), a aba Glossário (rótulo do tema por item) e os testes de telas que assumiam um único tema (aba Progresso e Glossário).
- Nenhuma dependência nova.

## Fora de escopo

- Os temas Banco de dados, Frontend/React e System design.
- Ordenar ou filtrar o glossário por tema.
- Marcar temas como "novo" na Home.
