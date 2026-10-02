## 1. Base

- [x] 1.1 Instalar `zustand` com `npx expo install` e confirmar `npm test`, `npm run lint` e `npx tsc --noEmit` verdes
- [x] 1.2 Criar `src/study/copy.ts` com os textos fixos e os nomes das operações

## 2. Regras puras (Requirements: Deck com progresso e ação; Virar e responder; Resumo; Progresso)

- [x] 2.1 Escrever os testes que falham de `deckStats`, `deckAction` e `sessionCardIds`: deck nunca estudado, continuar de onde parou e deck dominado
- [x] 2.2 Escrever os testes que falham de `sessionReducer` e `summary`: virar, responder e avançar, não responder sem ver o verso, fim da sessão, resumo com e sem erros
- [x] 2.3 Implementar `src/study/rules.ts`; testes passando

## 3. Store (Requirement: Progresso enquanto o app está aberto)

- [x] 3.1 Escrever os testes que falham do store: registrar resposta, resposta substituída, chave por tema, variante preferida por tema e `resetStudyStore`
- [x] 3.2 Implementar `src/study/store.ts` com Zustand; testes passando

## 4. Componentes de card (Requirements: Frente e verso por tipo; Abas de framework; Exibição de código)

- [x] 4.1 Escrever os testes que falham de cada tipo de card (frente e verso) usando cards reais do tema CRUD: endpoint, passo, comparação, conceito e complemento
- [x] 4.2 Escrever os testes que falham de `VariantTabs` e `CodeBlock`: trocar de framework, aba selecionada acessível, código preservado na tela e rótulo do arquivo
- [x] 4.3 Implementar `ProgressBar`, `SupplementBadge`, `CodeBlock`, `VariantTabs`, os 5 componentes de card e o `CardFace` exaustivo; testes passando

## 5. Telas e navegação (Requirements: Tela do tema; Deck com progresso e ação; Sessão; Resumo; Home)

- [x] 5.1 Escrever os testes que falham de navegação com `renderRouter`: abrir o tema, voltar para os temas, deck com contagem e botão certo, primeiro card, sair no meio, escolha de framework mantida entre passos, resumo com "Revisar os que errei", progresso refletido na tela do tema e na Home, tocar no tema
- [x] 5.2 Implementar a tela do tema (`src/app/theme/[themeId].tsx`) e atualizar o card de tema da Home (Pressable, descrição, barra, "sei/total")
- [x] 5.3 Implementar a sessão (`src/app/study/[themeId]/[deckId].tsx`): cabeçalho, card com frente e verso, botões, resumo com reinício pelos errados e tratamento de tema ou deck inexistente; testes passando

## 6. Verificação final

- [x] 6.1 Rodar no navegador (`npx expo start --web`) e percorrer: Temas → tema → deck Passo a passo → virar → trocar framework → responder → resumo → revisar erros → voltar; capturas nos dois modos
- [x] 6.2 Conferir que todo cenário das duas specs (study-flow e delta de app-shell) tem pelo menos um teste com o mesmo nome
- [x] 6.3 Rodar `openspec validate add-study-flow --strict`
- [x] 6.4 Rodar `npm test`, `npm run lint`, `npx tsc --noEmit` e `npm run format:check`, todos verdes
