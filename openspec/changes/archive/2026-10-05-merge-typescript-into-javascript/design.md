## Context

A navegação (capability `catalog-navigation`) já é genérica: a tela da área agrupa as trilhas pelo campo `language` de cada `track.json`, e a tela da linguagem separa "Linguagem pura" (sem `framework`) de "Frameworks" (agrupados pelo `framework`, na ordem do cadastro em `content/taxonomy.json`). Por isso, mudar onde uma trilha aparece é uma mudança de dados, não de código. Motivação em proposal.md › Why.

## Goals / Non-Goals

**Goals:**
- Levar TypeScript para dentro da linguagem `javascript` mudando só os dados e os testes.

**Non-Goals:**
- Mexer em `src/content/navigation.ts`, nas telas ou no schema de conteúdo.

## Decisions

1. **Remover `typescript` do cadastro em vez de escondê-lo.** Assim, uma trilha com `language: "typescript"` passa a falhar na validação do conteúdo, e ninguém recria a separação por engano. Alternativa descartada: manter a linguagem no cadastro sem trilhas. Ela não apareceria no app, mas continuaria disponível para um `track.json` novo.
2. **Mudar só o `language` do topo dos 4 `track.json`.** O `language` dos snippets (`ts`) diz como destacar o código, não onde a trilha fica no menu, então continua `ts`.
3. **Manter Angular e NestJS na posição atual do cadastro**, logo depois de Express. A ordem dos frameworks segue o cadastro, o que dá Frontend: React, Vue, Next.js, Angular e Backend: Express, NestJS. Alternativa descartada: reordenar o cadastro (por exemplo, por popularidade), porque mudaria a ordem sem pedido.
4. **Manter o nome "JavaScript" e o id `javascript`.** As rotas atuais continuam valendo, e as trilhas "TypeScript …" já deixam claro que o TS está ali. Alternativa descartada: "JavaScript / TypeScript", que só muda o nome exibido e alonga o card.
5. **Manter as specs `typescript-content` e `javascript-content` separadas.** Elas descrevem decks e conteúdo diferentes; só a posição no menu muda.
6. **Testes:** `typescript-tracks.test.ts` passa a esperar a posição `javascript`. `typescript-navigation.test.tsx` passa a abrir `/area/*/javascript`, com um cenário para a rota antiga. `javascript-navigation.test.tsx` passa a incluir as trilhas de TS e Angular/NestJS, mais a contagem da área. O `navigation.test.ts` usa um cadastro fictício e fica como está.

## Risks / Trade-offs

- [Links ou deep links salvos para `/area/*/typescript` param de funcionar] → Mostram "Linguagem não encontrada." com botão de voltar. O progresso não se perde, porque é guardado pelo id da trilha.
- [A tela Frontend › JavaScript fica mais longa (5 trilhas puras + 4 frameworks)] → Aceito; é o objetivo da mudança.

## Migration Plan

Nenhuma migração de dados: os ids das trilhas e as chaves de progresso não mudam. Para reverter, basta reverter o commit.
