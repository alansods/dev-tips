## 1. Modelo de conteúdo (content-model)

- [x] 1.1 Testes falhando em `src/content/__tests__/` para os cenários de "Simulação de entrevista", "Card interview", "Áreas da trilha" (área `simulacoes`) e "Tradução de uma trilha" (`scenario.context`, `scenario.stack`, `why`, `watchOut`), além de simulação como pré-requisito na validação do catálogo
- [x] 1.2 `schema.ts`: `AREAS` com `simulacoes`, `kind`, `scenario`, `interviewCardSchema` na união e tipos exportados; helper `isSimulation`
- [x] 1.3 `integrity.ts`: `checkSimulation` (área exclusiva, deck único, só `interview`, sem posição e sem pré-requisitos, `scenario` obrigatório ou proibido, `interview` fora de simulação)
- [x] 1.4 Validação do catálogo: trilha não tem simulação como pré-requisito
- [x] 1.5 `translation.ts`: campos do `interview`, `scenario.context` e `scenario.stack` (com tamanho igual) no schema e no merge
- [x] 1.6 Testes do item 1.1 passando

## 2. Conteúdo das simulações (interview-simulations-content)

- [x] 2.1 Teste falhando `src/content/__tests__/interview-simulations.test.ts`: ids e ordem no fim do catálogo, deck `conversa`, quantidade de cards (5+4+4+4+4+4), `addedAt`, contexto ≤ 280 caracteres (PT e EN), origem, níveis (os 5 `senior`), `why` ou `watchOut` em todo card, snippets `sql` ou `text`, cobertura da tradução
- [x] 2.2 `content/tracks/sim-dashboard-lento/` (`track.json` + `translations/en.json`)
- [x] 2.3 `content/tracks/sim-pedidos-duplicados/`
- [x] 2.4 `content/tracks/sim-projetos-e-permissoes/`
- [x] 2.5 `content/tracks/sim-arquivos-em-segundo-plano/`
- [x] 2.6 `content/tracks/sim-funcionalidade-com-ia/`
- [x] 2.7 `content/tracks/sim-api-de-notificacoes/`
- [x] 2.8 Registro em `catalog.ts` e `translations.ts`; teste 2.1 e gate de conteúdo do repositório passando

## 3. Card interview na sessão (study-flow)

- [x] 3.1 Testes falhando: frente (Caso, contexto, pergunta, convite), verso (resposta, "Por que funciona" e "Atenção" só quando houver, snippet), selo "Simulação · <título>", textos em inglês
- [x] 3.2 `CardFace.tsx` e `parts.tsx`: frente e verso do `interview`; selo de origem para simulação
- [x] 3.3 `src/assistant/cardText.ts`: texto do card `interview` para o assistente
- [x] 3.4 Textos PT e EN em `src/i18n/pt-BR.ts` e `en.ts`
- [x] 3.5 Testes do item 3.1 passando

## 4. Tela da simulação (study-flow)

- [x] 4.1 Testes falhando: tela da simulação (caso, stack, "N perguntas", progresso, Começar conversa / Continuar / Praticar de novo, sem decks), sessão aberta pelo botão, "Voltar à simulação" no resumo, inglês
- [x] 4.2 `src/app/track/[trackId].tsx`: variante para simulação, reaproveitando a regra de ação do deck
- [x] 4.3 Sessão e resumo: rótulo "Voltar à simulação"
- [x] 4.4 Testes do item 4.1 passando

## 5. Navegação (catalog-navigation)

- [x] 5.1 Teste falhando `src/__tests__/simulations-navigation.test.tsx`: card da área Simulações por último com "6 simulações" e "sei/total", tela da área só com a seção "Simulações", abrir uma simulação, busca ("notificacoes") sob "Simulações", filtro de linguagem sem simulações, inglês ("Simulations")
- [x] 5.2 Nome e ícone da área (`icons.tsx`, i18n), contagem "N simulações" no card da área
- [x] 5.3 `src/app/area/[areaId]/index.tsx`: área `simulacoes` sem "Ordem sugerida", com a seção "Simulações"
- [x] 5.4 Ajustar testes existentes que fixam a lista ou a ordem das áreas
- [x] 5.5 Testes do item 5.1 passando

## 6. Início (home)

- [x] 6.1 Testes falhando: "Continue de onde parou" com simulação ("Simulação", sem "deck N de M"), sugestões sem simulações, primeiro acesso e Perfil sem a opção "Simulações"
- [x] 6.2 Testes falhando de "Novidades": título "Novidades"/"What's new", item de área nova ("Nova área", "6 simulações", abre a área), simulações da área nova não aparecem como itens próprios, simulação nova numa área antiga, áreas sem data não aparecem, ordem e limite de 3; ajustar `sections.test.ts` e `home.test.tsx` existentes
- [x] 6.3 `AREA_ADDED_AT` em `schema.ts`; `whatsNew` em `src/home/sections.ts`; seção "Novidades" em `HomeSections.tsx` com o item de área; textos PT/EN
- [x] 6.4 `src/home/sections.ts`: simulações fora das sugestões e de "Comece por aqui"; opções de interesse sem Simulações
- [x] 6.5 Testes dos itens 6.1 e 6.2 passando

## 7. Fechamento

- [x] 7.1 README: área Simulações e o formato `kind: "simulation"`
- [x] 7.2 Conferência manual no app (`npx expo start`): área, tela da simulação, sessão em PT e EN, claro e escuro, card na revisão de hoje depois de um "Não sabia"
- [x] 7.3 `openspec validate --strict`, `npm test`, `npm run lint`, `npx prettier --check .` e `npx tsc --noEmit`
