## Why

O tema CRUD ensina **como** fazer o CRUD, mas não cobre perguntas clássicas de entrevista que nascem desse mesmo código: PUT vs PATCH, idempotência, paginação, N+1, transações, JWT, migrations e SQL injection. Elas foram identificadas como lacunas no plano inicial e são o tipo de conteúdo que o app promete reforçar.

## What Changes

- **Novo tipo de card `question`** no `content-model`: pergunta, resposta modelo e, opcionalmente, um snippet. Na frente aparece a pergunta e no verso a resposta (e o código, se houver).
- **Novo deck "Perguntas de entrevista"** no fim do tema CRUD, com 8 cards marcados como `supplement`, porque não vêm do material original:
  1. PUT vs PATCH;
  2. idempotência;
  3. paginação por offset vs cursor;
  4. problema N+1;
  5. transações;
  6. autenticação com JWT (e 401 vs 403);
  7. migrations vs `synchronize`/`ddl-auto`;
  8. SQL injection e parâmetros (`$1`).
- Todo card de pergunta liga a termos do glossário.
- O total de cards do tema passa de 65 para 73. Os cenários que citavam números absolutos são atualizados.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `content-model`: novo requisito "Card question"; o snippet também pode aparecer em cards `question`.
- `crud-theme-content`: 5 decks (novo `perguntas-de-entrevista` com 8 cards `question`); complementos passam a incluir as perguntas; perguntas também precisam de termos relacionados.
- `study-flow`: frente e verso do tipo `question`; a tela do tema mostra 5 decks.
- `progress`: o cenário "Com progresso" usa o novo total (73 cards).
- `app-shell`: o cenário "Tema registrado" deixa de fixar a quantidade de decks.

## Impact

- **Schema:** `src/content/schema.ts` (novo tipo) e `integrity.ts`, onde as regras de `relatedTerms` já são genéricas.
- **Conteúdo:** `content/themes/crud-4-frameworks/theme.json` ganha o deck novo.
- **Telas e testes:** `CardFace` (novo componente de verso e frente) e `copy.ts`, mais os testes de contagem do tema.
- Os testes de fidelidade não mudam, porque cards `supplement` são pulados.

## Fora de escopo

- Perguntas para outros temas.
- Quiz de múltipla escolha a partir das perguntas.
- Campo `interviewQuestion` dentro dos outros tipos de card: o tipo próprio cobre o caso com menos impacto.
