## Context

O repositório tem apenas OpenSpec e git; ainda não existe código nem `package.json`. Esta é a primeira change com implementação, então ela também precisa criar a base mínima do projeto para rodar testes, lint e typecheck. Motivação e escopo estão em proposal.md, e os requisitos em `specs/content-model/spec.md`.

## Goals / Non-Goals

**Goals:**
- Uma única fonte para os tipos de conteúdo: os tipos TypeScript usados pelo app derivam do schema, sem duplicação.
- Validação que acumula erros de estrutura **e** de integridade numa mesma execução.
- Base de projeto que a change de scaffold apenas estende (rotas, tema, Prettier), sem refazer.

**Non-Goals:**
- Como o app carrega os `theme.json` em runtime (índice estático, lazy loading): fica para `theme-catalog`.
- Revalidar conteúdo em runtime no app. O gate é a suíte de testes.

## Decisions

### 1. Projeto base: `create-expo-app` com template `blank-typescript`, já nesta change
Criar o projeto Expo agora evita montar um Node/TS avulso (ts-jest) que teria de ser trocado por `jest-expo` na change de scaffold. O preset `jest-expo` roda testes TS puros sem configuração extra. ESLint entra via `npx expo lint` (`eslint-config-expo`). Scripts: `test`, `lint`, `typecheck` (`tsc --noEmit`).
- *Alternativa:* Node puro + ts-jest agora e Expo depois. Descartada porque seria retrabalho e haveria dois runners durante a transição.
- A versão exata do SDK e do Zod é a mais recente estável no momento do apply, conferida na documentação (Context7).

### 2. Zod para estrutura, tipos via `z.infer`
O schema Zod define estrutura, padrões (`origin`, `tags`, `relatedTerms`) e formatos (kebab-case, `path` com `/`, faixa de status, enum de linguagens). Os cards usam `z.discriminatedUnion('type', [...])`. Os tipos exportados (`Theme`, `Deck`, `Card`, `StepCard`…) são `z.output<typeof …>`.
- *Alternativa:* JSON Schema + ajv. Descartada porque exigiria gerar tipos TS à parte, enquanto o Zod já é a stack definida no projeto.

### 3. Validação em duas passadas, mescladas
Refinamentos de objeto no Zod não rodam quando a estrutura já falhou. Isso impediria o cenário "título vazio + step sem variante" de reportar os dois erros. Por isso a validação tem duas passadas independentes:
1. **Estrutural:** `safeParse` do schema.
2. **Integridade:** uma função que percorre o input **cru** de forma defensiva (ignora nós com formato inesperado, que já foram reportados na passada 1) e verifica:
   - unicidade de ids de decks e cards e de termos;
   - cobertura de `snippets` × `variants` e de `values` × `compareColumns`;
   - `variant` dos cards `code`;
   - `relatedTerms` (existe, é concept, não aponta para si);
   - `number` único por deck.

Os erros das duas passadas são unidos, formatados e deduplicados. Sucesso só acontece quando as duas passadas estão limpas, e aí o resultado é a saída do Zod (com padrões aplicados).
- *Alternativa:* fazer tudo em `superRefine`. Descartada porque perde erros de integridade sempre que houver um erro estrutural.

### 4. API pública pequena e sem exceções
- `validateTheme(input: unknown): { ok: true; theme: Theme } | { ok: false; errors: ContentError[] }`
- `validateCatalog(inputs: unknown[])`: valida cada tema e checa ids de tema duplicados.
- `getGlossary(theme: Theme): ConceptCard[]`
- `ContentError = { path: string; message: string }`, com path no formato `decks[1].cards[3].snippets.fastapi` e mensagens em PT-BR (incluindo as do Zod, via mapa de erro customizado).

### 5. Gate de conteúdo como teste Jest em ambiente node
`src/content/__tests__/repository-content.test.ts` lê `content/themes/*/theme.json` com `fs`, valida cada um, confere id = nome da pasta e falha listando `arquivo → path: mensagem`. O arquivo usa o docblock `@jest-environment node`. Se não houver tema, o teste passa.

### 6. Layout
```
src/content/
  schema.ts        # schemas Zod + tipos exportados
  integrity.ts     # passada de integridade
  validate.ts      # validateTheme, validateCatalog, formatação de erros
  glossary.ts      # getGlossary
  index.ts         # API pública
  __tests__/       # um describe por requirement da spec
  __fixtures__/    # builders de tema válido para os testes
content/themes/.gitkeep
```

## Risks / Trade-offs

- [A passada de integridade duplica um pouco do conhecimento estrutural] → Ela só lê os campos de que precisa e ignora nós malformados. Os testes cobrem a combinação de erro estrutural com erro de integridade.
- [Mensagens do Zod em inglês vazarem] → Mapa de erro customizado, com teste verificando que as mensagens dos cenários estão em PT-BR.
- [O template do Expo mudar entre versões] → Depois de gerar, remover só o que conflita e registrar a versão do SDK no `package.json`. A change de scaffold parte desse estado.
- [Sem revalidação em runtime, um JSON quebrado poderia chegar ao app] → O conteúdo só entra pelo repositório e `npm test` é obrigatório antes de arquivar e de fazer build.
