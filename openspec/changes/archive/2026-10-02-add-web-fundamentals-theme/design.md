## Context

O schema genérico já aceita temas sem variantes nem colunas, e o catálogo exige o registro manual de cada pasta. A Home, a aba Progresso e a revisão percorrem o `catalog` inteiro. A aba Glossário junta os glossários de todos os temas, mas não mostra o tema de cada item. Os testes de tela da aba Progresso e do Glossário assumem um único tema. Requisitos nos deltas desta change.

## Goals / Non-Goals

**Goals:** conteúdo correto, curto e no mesmo tom do tema CRUD (PT-BR simples, com analogias e exemplos concretos), sem mudar telas além do rótulo de tema no Glossário.

**Non-Goals:** reorganizar as telas para muitos temas (filtros, seções).

## Decisions

### 1. Conteúdo autoral como `original`
O campo `origin` distingue o que veio do material de origem do que foi acrescentado a ele. Aqui, o próprio tema é a fonte, então tudo é `original` e o selo "Complemento" não aparece em todos os cards (o que não informaria nada).

### 2. Termos sem sobreposição com o CRUD
CORS, JSON, API, Endpoint e Status HTTP já existem no CRUD. Este tema usa termos complementares (política de mesma origem, preflight, código de status) e cita os do CRUD só no texto. Um teste garante que não há termos repetidos entre os dois glossários.

### 3. Glossário: rótulo do tema
Cada item da aba Glossário mostra o título do tema (texto pequeno e discreto) quando `catalog.length > 1`. O `accessibilityLabel` do item continua sendo só o termo, então os testes por nome não mudam. A ordem da lista segue o catálogo.

### 4. Testes de tela com vários temas
- **Aba Progresso:** cada tema ganha `testID="theme-progress-<id>"`. Os testes passam a consultar dentro da seção do tema CRUD com `within`.
- **Glossário:** a contagem e a busca seguem os novos cenários.

### 5. Escrita do `theme.json`
O arquivo é gerado por um script descartável, fora do repositório, com o conteúdo literal (como na change das perguntas), com indentação de 2 espaços e versionado. O gate de conteúdo valida estrutura e referências.

## Risks / Trade-offs

- [Imprecisão técnica no conteúdo autoral] → Respostas revisadas contra o comportamento padrão (RFCs de HTTP, documentação de navegadores sobre CORS e cookies). Elas são modelos curtos, não documentação completa.
- [Lista do glossário crescer muito com mais temas] → Com 45 termos ainda é tranquilo. Filtrar por tema fica para uma change futura.
