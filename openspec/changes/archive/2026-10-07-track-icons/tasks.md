## 1. Logos e dados

- [x] 1.1 Spec: requisito "Ícone de linguagem, framework e trilha" em `specs/content-model/spec.md`
- [x] 1.2 Adicionar `simple-icons` como devDependency, criar `scripts/generate-tech-icons.mjs` e o script `npm run tech-icons`
- [x] 1.3 Preencher `icon` em `content/taxonomy.json` e nas trilhas com marca ou sigla, e gerar `src/content/techIcons.generated.ts`
- [x] 1.4 Teste falhando em `src/content/__tests__/taxonomy.test.ts` e em `src/content/__tests__/structure.test.ts` (ou nos arquivos de schema equivalentes) para "Logo desconhecido na trilha", "Sigla longa demais" e "Cadastro sem ícone"
- [x] 1.5 Adicionar `icon` ao `taxonomySchema` e ao `trackSchema`, validado contra `TECH_ICON_SLUGS`
- [x] 1.6 Teste falhando em `src/content/__tests__/icons.test.ts` para "Logo herdado do framework", "Logo herdado da linguagem", "Ícone da trilha tem prioridade", "Sigla" e "Trilha sem marca"
- [x] 1.7 Implementar `trackIcon`, `languageIcon` e `frameworkIcon` em `src/content/icons.ts`, e confirmar que os testes passam

## 2. Componente

- [x] 2.1 Spec: requisitos "Cores do ícone" e "Ícone decorativo" em `specs/track-icons/spec.md`
- [x] 2.2 Teste falhando para `logoColor` (cor da marca no claro; cor do texto para o Next.js no escuro; React mantém a cor no escuro) e para o `TechIcon` ficar fora da acessibilidade
- [x] 2.3 Criar os ícones de traço das áreas em `src/components/icons.tsx` e o `src/components/TechIcon.tsx` com `logoColor`, e confirmar que os testes passam

## 3. Telas

- [x] 3.1 Spec: requisito "Ícone nas listas e telas" em `specs/track-icons/spec.md`
- [x] 3.2 Teste falhando em `src/__tests__/track-icons.test.tsx` para os cenários de "Ícone nas listas e telas" e "Rótulo do card sem o ícone"
- [x] 3.3 Encaixar o ícone em `TrackCard`, `NavRow` (telas de área e de linguagem), `AreaCard`, na tela da trilha e nos painéis da aba Progresso, e confirmar que os testes passam

## 4. Verificação

- [x] 4.1 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
