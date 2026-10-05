## Context

O formato, a validação e a navegação já existem (`content-model` e `catalog-navigation`). Esta change é de conteúdo. A cobertura de tradução já é verificada para toda trilha do catálogo (`src/content/__tests__/coverage.test.ts`), e o gate do repositório valida estrutura, nível e cadastro.

## Goals / Non-Goals

**Goals:**
- Conteúdo correto e atual, no nível de entrevista técnica, curto o bastante para um card.
- Formato uniforme entre as 8 trilhas, para os testes poderem ser genéricos.

**Non-Goals:**
- Tutoriais longos ou passo a passo. Isso é papel das trilhas comparativas.

## Decisions

### 1. Estrutura fixa por trilha: 3 decks de conteúdo de 6 cards e 1 de perguntas com 6
Um formato único permite um teste parametrizado só (`it.each` sobre as 8 trilhas) e dá sessões de estudo curtas. São 24 cards por trilha, perto dos 27 de Fundamentos web.
*Alternativa descartada:* tamanho livre por trilha. Cada trilha precisaria de um teste próprio, e a navegação ficaria desigual.

### 2. Cards `code` com o snippet na linguagem e explicação curta
Mostram a sintaxe real (ex.: `useEffect` com cleanup, middleware do Express) sem virar tutorial. Os `relatedTerms` ligam cada card aos concepts do glossário da trilha, como nas trilhas atuais.

### 3. Termos podem se repetir entre trilhas
O glossário já agrupa por trilha e mostra a trilha de cada termo. Um termo como "Event loop" pode aparecer em JavaScript assíncrono e em Node.js, com a definição focada em cada contexto. A unicidade continua valendo dentro da trilha.

### 4. Conteúdo escrito como dado, gerado por script e revisado
Os 192 cards são escritos como dados estruturados num script de apoio no scratchpad (fora do repositório). O script grava `track.json` e `en.json` com a mesma formatação dos arquivos atuais (JSON com 2 espaços). O repositório recebe só o JSON, e a revisão é feita sobre ele no PR.

### 5. Cadastro já completo para as próximas changes
Vue, Next.js, Angular e Django entram agora em `content/taxonomy.json`. React passa para JavaScript, já que a maior parte do material de React é escrita em JS. Nenhuma trilha usa esses ids ainda, então a mudança não quebra nada.

### 6. Critério de nível
- **Júnior**: o que é e o uso básico.
- **Pleno**: usar bem, armadilhas comuns e organização.
- **Sênior**: internals, performance, trade-offs e arquitetura.

## Risks / Trade-offs

- [Volume de texto e risco de erro técnico] → Revisão no PR, com a lista de cards por trilha. Os testes garantem formato, ligações e cobertura de tradução, mas não a exatidão técnica.
- [APIs que mudam (Next.js App Router, React 19, Vue 3.5)] → O conteúdo foca nos conceitos estáveis e nas versões atuais. Detalhes de versão aparecem só quando são o assunto do card.
