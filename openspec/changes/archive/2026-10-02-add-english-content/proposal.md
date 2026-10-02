## Why

A change `add-language-selection` entregou o app em inglês e o mecanismo de tradução de conteúdo (`translations/en.json`), mas os temas existentes não foram traduzidos. Com o app em inglês, a interface muda e os cards continuam em PT-BR. Para quem estuda para uma entrevista em inglês, isso tira o valor da troca de idioma.

## What Changes

- Tradução completa para inglês do tema "O mesmo CRUD em quatro frameworks" (5 decks, 73 cards) e do tema "Fundamentos web" (4 decks, 27 cards), em `content/themes/<id>/translations/en.json`.
- Registro das duas traduções no app.
- Teste de cobertura: todo texto exibido de tema, deck e card precisa ter tradução, exceto código, nomes de arquivo, tags e valores que são identificadores.
- O conteúdo em PT-BR não muda.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `crud-theme-content`: novo requisito de tradução completa para inglês.
- `web-fundamentals-content`: novo requisito de tradução completa para inglês.

## Impact

- Conteúdo novo em `content/themes/crud-4-frameworks/translations/en.json` e `content/themes/fundamentos-web/translations/en.json`.
- `src/content/translations.ts` (registro) e `src/content/translation.ts` (função de cobertura).
- O bundle do app cresce com o texto traduzido (cerca de 50 KB).

## Fora de escopo

- Outros idiomas.
- Revisão da tradução por falante nativo; o texto pode ser ajustado depois sem mudar a estrutura.
- Traduzir o material de origem em `content/sources/`.
