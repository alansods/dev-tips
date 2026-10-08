## Context

- **Navegação:** a tela da área usa `areaSections(catalog, taxonomy, area)`, de `src/content/navigation.ts`. Cada trilha é validada sozinha por `validateTrack`. O `validateCatalog` só confere ids repetidos entre trilhas.
- **Ícones:** os ícones das trilhas vêm de `trackIcon`, da change `track-icons`.
- **Progresso e revisão:** o progresso de cada trilha vem de `trackStats`, e a revisão de `dueCardIds`.

## Goals / Non-Goals

**Goals:**
- Uma ordem determinística, testável como função pura.
- Erros de pré-requisito no mesmo relatório de validação do catálogo.

**Non-Goals:**
- Recomendar trilhas por progresso ou interesse. Isso fica com o Início.

## Decisions

### 1. Campo `prerequisites` com padrão `[]`
No `trackSchema`, o campo é `z.array(id()).default([])`. O padrão evita `undefined` nas telas e nos testes.

### 2. Checagem entre trilhas no `validateCatalog`
Depois de validar cada trilha, o `validateCatalog` confere três coisas:
- **Ids inexistentes:** caminho `[i].prerequisites[j]`.
- **Autorreferência:** mesmo caminho.
- **Ciclos:** busca em profundidade com marcação de visita. O erro vai no caminho `[i].prerequisites` da primeira trilha do ciclo, com a mensagem "ciclo de pré-requisitos: a → b → a".

O `validateTrack` sozinho não tem como checar isso, porque não conhece as outras trilhas.

### 3. `areaPath` por ordenação topológica estável
1. Pega as trilhas da área na ordem do catálogo.
2. Repete até acabar: escolhe a primeira trilha cujos pré-requisitos *da área* já foram colocados.

Com 41 trilhas, o custo quadrático é irrelevante. Fica legível e cumpre o "empate pela ordem do catálogo".

`nextTracks(catalog, trackId)` devolve, na ordem do catálogo, as trilhas que listam `trackId` como pré-requisito. É usado na change do Início.

### 4. Estado da trilha em `rules.ts`
`trackStatus(stats)` devolve `'done' | 'started' | 'new'`:
- `done`: `known === total`;
- `started`: `answered > 0`;
- `new`: nos outros casos.

### 5. `PathList` na tela da área
`src/components/PathList.tsx` desenha a linha do tempo. Cada linha é um `Pressable` com rótulo "título, estado", contendo:
- o marcador: ✓ para concluída, ponto cheio para em andamento, anel para não iniciada;
- um traço vertical entre as linhas;
- o `TechIcon` de 32;
- o título;
- o estado;
- "N para revisar", em laranja.

A seção usa o `Section` de `FullScreen`, com o título "Ordem sugerida".

### 6. Pré-requisitos propostos

| Trilha | Pré-requisitos |
|---|---|
| fundamentos-web, git-e-colaboracao, java-essencial, python-essencial, sql-essencial, nosql, aws-essencial, crud-4-frameworks | — |
| javascript-essencial | fundamentos-web |
| javascript-assincrono, javascript-no-navegador, typescript-essencial | javascript-essencial |
| typescript-avancado | typescript-essencial |
| build-e-bundlers, react, vue | javascript-no-navegador |
| nodejs | javascript-assincrono |
| estado-e-dados-no-react, estilizacao-e-design-system, testes-no-frontend, nextjs, react-native | react |
| performance-no-nextjs | nextjs |
| angular | typescript-essencial |
| express | nodejs |
| nestjs | express, typescript-essencial |
| java-colecoes-e-concorrencia, spring-boot | java-essencial |
| fastapi, django | python-essencial |
| modelagem-de-dados, transacoes-e-performance, postgresql, mysql | sql-essencial |
| mongodb, redis | nosql |
| modulos-nativos-no-expo, pagamentos-no-app | react-native |
| ci-cd-essencial | git-e-colaboracao |
| github-actions | ci-cd-essencial |
| deploy-na-aws | aws-essencial |

## Risks / Trade-offs

- **Ordem que não agrada a todos:** a ordem é editorial e pode não servir para todo mundo. → É uma sugestão; as seções de sempre continuam embaixo.
- **Área longa:** a seção duplica as trilhas que já aparecem nas seções de baixo. → As linhas são compactas (uma linha por trilha), e o card completo continua nas seções.
