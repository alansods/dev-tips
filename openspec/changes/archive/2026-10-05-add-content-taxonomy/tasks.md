## 1. Modelo de conteúdo

- [x] 1.1 Testes falhando (`src/content/__tests__`): áreas da trilha (sem áreas, desconhecida, repetida, duas áreas), nível do card (sem nível, inválido), cadastro (válido, framework de linguagem inexistente, linguagem repetida) e posicionamento (framework válido, de outra linguagem, sem linguagem, linguagem fora do cadastro, comparativa com linguagem, direta na área)
- [x] 1.2 Builders das fixtures com `level: 'junior'` e trilhas com `areas`; fixture de cadastro
- [x] 1.3 Schema: `areas` (enum, não vazia, sem repetição), `language`, `framework` (regras de área repetida, framework sem linguagem e comparativa com linguagem na passada de integridade), `level` no `cardBase`; `taxonomySchema` e `validateTaxonomy`; `checkPlacement` e `validateTrack(input, taxonomy)`; `placementOf`
- [x] 1.4 Testes do modelo passando

## 2. Conteúdo do repositório

- [x] 2.1 Testes falhando: gate do repositório valida `content/taxonomy.json` e o nível de todos os cards; identidades das trilhas CRUD (`areas: ["backend"]`, comparativa) e Fundamentos web (`areas: ["fundamentos"]`)
- [x] 2.2 Criar `content/taxonomy.json` (Java, Python, JavaScript, TypeScript; Spring Boot, FastAPI, Express, NestJS) e registrá-lo para o app
- [x] 2.3 Adicionar `areas` às duas trilhas e `level` aos 100 cards, conforme o critério do design; gerar a lista de classificação para o PR
- [x] 2.4 Testes de conteúdo passando

## 3. Agrupamento

- [x] 3.1 Testes falhando para `src/content/navigation.ts`: áreas na ordem e sem as vazias, trilha em duas áreas, seções da área (direta, linguagens com contagem, comparativos), seções da linguagem (pura, frameworks com contagem) e trilhas do framework
- [x] 3.2 Implementar `navigation.ts` e a soma de progresso e revisões por área
- [x] 3.3 Testes de agrupamento passando

## 4. Telas de navegação

- [x] 4.1 Testes de tela falhando: "Home por áreas" (todos os cenários), "Tela da área" (Backend, Fundamentos, abrir trilha, área não encontrada, área com linguagens via catálogo de fixture), "Tela da linguagem", "Tela do framework", textos em inglês, "Voltar para as trilhas" (volta para a área) e "Revisão na Home" (soma na área, aviso no card da trilha); ajustar os testes que partiam da Home tocando numa trilha
- [x] 4.2 Extrair `TrackCard` e `FullScreenHeader`; criar `AreaCard` e `NavRow`
- [x] 4.3 Home por áreas em `src/app/(tabs)/index.tsx`; rotas `src/app/area/[areaId]/index.tsx`, `[languageId]/index.tsx` e `[languageId]/[frameworkId].tsx`
- [x] 4.4 i18n PT-BR e inglês: áreas, seções, contagens e mensagens de "não encontrado"
- [x] 4.5 Testes de tela passando

## 5. Chip de nível

- [x] 5.1 Testes falhando: "Nível na frente", "Nível no verso" e "Nível em inglês"
- [x] 5.2 `LevelChip` em `parts.tsx`, uso no `CardFace` e textos em `t.card.levels`
- [x] 5.3 Testes passando

## 6. Fechamento

- [x] 6.1 README e `openspec/config.yaml`: áreas, cadastro e nível
- [x] 6.2 Conferir no app (`npx expo start`): Backend → Comparativos → CRUD → estudar (chip visível) e Fundamentos → Fundamentos web, em PT e EN e nos temas claro e escuro — conferido no simulador iOS em PT e tema claro (Home, área Backend, área Fundamentos, chips Júnior e Pleno); inglês e escuro cobertos pelos testes
- [x] 6.3 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
