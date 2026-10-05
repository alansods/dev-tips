## 1. Seções

- [x] 1.1 Testes falhando: "Trilha direta com seção", "Seção desconhecida" e "Seção em trilha de linguagem" (`taxonomy.test.ts`); agrupamento por seção em `navigation.test.ts`; "Área Banco de dados" com as duas seções e os textos em inglês (`database-navigation.test.tsx`)
- [x] 1.2 `SECTIONS` e o campo `section` em `schema.ts`; a regra "só em trilha direta" em `integrity.ts`
- [x] 1.3 `areaSections` com `grouped`; a tela da área desenha as seções; os textos em `nav.sections`
- [x] 1.4 `section` nas 8 trilhas de banco de dados
- [x] 1.5 Testes de seções passando

## 2. Níveis

- [x] 2.1 Aplicar os 67 ajustes de nível da tabela do design (só o campo `level`)
- [x] 2.2 Conferir que as trilhas das capabilities de conteúdo continuam com os três níveis (testes existentes)

## 3. Fechamento

- [x] 3.1 Conferir no simulador a área Banco de dados com as duas seções — "Relacionais" no topo, conferido no simulador; "Não relacionais" coberta pelos testes de tela
- [x] 3.2 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
