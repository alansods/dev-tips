## Context

O `content-model` está arquivado e o gate (`npm test`) já valida qualquer `content/themes/*/theme.json`. O material de origem foi fornecido em markdown (íntegro) e em JSON (truncado). Motivação em proposal.md e requisitos em `specs/crud-theme-content/spec.md`.

## Goals / Non-Goals

**Goals:**
- Um `theme.json` fiel ao material, revisável por diff e protegido por testes de contagem e de fidelidade.
- Um processo de transcrição que não dependa de redigitar ~60 blocos de código à mão.

**Non-Goals:**
- Gerar o `theme.json` em tempo de build. O arquivo é versionado e é a fonte que o app consome.
- Um parser genérico de markdown para temas futuros.

## Decisions

### 1. Markdown como fonte, JSON como artefato versionado
`content/sources/crud-4-frameworks.md` recebe o markdown exatamente como foi enviado. O `theme.json` é escrito a partir dele e versionado.
- *Alternativa:* usar o JSON enviado. Descartada porque ele veio truncado e usa chaves em PT que não batem com o `content-model`.

### 2. Transcrição assistida por script descartável
Um script Node único (fora do app, em `scripts/` ou no scratchpad) extrai do markdown os blocos de código de cada passo e framework, as notas, os textos "O que é/Por que importa", as linhas das tabelas e o glossário. Ele gera um rascunho do `theme.json`. Ids, `relatedTerms`, `language`, o mapeamento de endpoints e os complementos são completados à mão em cima do rascunho, e o resultado é revisado por diff.
- O script **não** vai para o repositório: o `theme.json` é a fonte para o app, e os testes de fidelidade garantem que ele continua batendo com o markdown. Rodar o script de novo depois sobrescreveria as edições manuais.
- *Alternativa:* redigitar tudo. Descartada pelo risco de erro sutil em código (aspas, `\`, indentação).

### 3. Teste de fidelidade
Em `src/content/__tests__/crud-theme.test.ts` (ambiente node), o teste lê o markdown e o `theme.json`:
- **Código:** para cada snippet de card `original`, verifica `markdown.includes(code)`. Comparação exata, sem normalizar.
- **Texto:** normaliza o markdown e cada texto (remove `**` e crases, colapsa espaços, aplica `toLowerCase`) e verifica a inclusão.
- Cards `supplement` são pulados.
- Uma falha lista o card, o campo e um trecho do texto que não foi encontrado.

Isso cobre transcrição errada e edição acidental futura sem acoplar o teste ao formato exato do markdown.

### 4. Teste de contagem e estrutura
O mesmo arquivo verifica:
- ordem e ids dos decks;
- contagem por tipo;
- passos 1..16 contíguos;
- tabela de endpoints;
- conjunto exato de `supplement` e suas posições;
- `relatedTerms` não vazio em steps e endpoints;
- os casos específicos (Passo 13 → `cors`, Passo 16 → `mock`).

### 5. Convenções de ids
- **Endpoints:** `endpoint-create`, `endpoint-list`, `endpoint-get`, `endpoint-update`, `endpoint-delete`.
- **Passos:** `step-01` … `step-16`.
- **Compare:** slug do conceito (`cmp-ponto-de-entrada`, `cmp-dto`, …).
- **Concepts:** slug do termo sem acento nem parênteses (`api`, `endpoint`, `dto`, `injecao-de-dependencia`, `venv`, …).
- **Complementos:** os ids da tabela da spec.

### 6. Mapeamento de campos do material
- **Passos 1–6 e 12–16:** `whatIs` vem de "O que é", `whyItMatters` de "Por que importa".
- **Passos 7–11:** `whatIs` vem de "Endpoint", `whyItMatters` de "Caminho", "Por que paginar" ou "Detalhe importante".
- **Snippet:** `file` vem do rótulo entre parênteses do framework (ex.: `.env + src/db.ts`, `terminal (porta 8080)`). `note` vem do parágrafo logo após o bloco.
- **`language`:** vem da cerca do bloco. Exceções:
  - Spring no Passo 1 vira `text`, porque são instruções e não Java;
  - o snippet Express do Passo 3 (`.env` + TS) fica `ts`.
- **Endpoints:** a descrição é o texto da tabela ("cria um produto" → "Cria um produto"). Os status vêm dos passos 7–11.

## Risks / Trade-offs

- [O script extrair um bloco errado (ex.: notas com crase)] → O teste de fidelidade pega texto que não existe no material, e a revisão por diff pega textos trocados de lugar.
- [Fidelidade case-insensitive deixar passar uma alteração de caixa] → Aceitável: só afeta capitalização. O código continua com comparação exata.
- [Os complementos divergirem do material (porta, nomes)] → Há um cenário específico para o `docker-compose`, e na revisão manual confiro os outros contra os passos 3, 7, 8 e 14.
- [Markdown com caracteres especiais (`\` de continuação de linha no bash do Passo 2)] → O JSON escapa normalmente e a comparação exata de código detecta qualquer perda.
