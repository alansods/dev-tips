## Why

Duas melhorias pedidas depois da revisão das trilhas novas:

1. **Senioridade.** A classificação foi feita trilha a trilha e ficou inconsistente. O mesmo assunto aparece com níveis diferentes (N+1 é pleno no CRUD e sênior no Spring Boot e no Django). Além disso, há armadilhas comuns marcadas como sênior e fundamentos de OOP marcados como pleno.
2. **Banco de dados.** A área lista as 8 trilhas numa seção só. Elas devem aparecer separadas em "Relacionais" e "Não relacionais".

## What Changes

- **Nível dos cards:** um critério único, aplicado a todas as trilhas:
  - **Júnior:** o que é e o uso básico.
  - **Pleno:** usar bem no dia a dia, as armadilhas comuns e a performance comum.
  - **Sênior:** internals, trade-offs de arquitetura, sistemas distribuídos e operação em produção em escala.

  Isso muda o nível de 67 cards. A lista está em design.md.
- **Seções dentro da área:** uma trilha direta na área pode declarar `section` (`relacionais` ou `nao-relacionais`). A tela da área agrupa essas trilhas em seções nomeadas, nessa ordem.
- **Trilhas de banco de dados:**
  - SQL essencial, Modelagem de dados, Transações e performance, PostgreSQL e MySQL ficam em "Relacionais";
  - MongoDB, Redis e "NoSQL: modelos e quando usar" ficam em "Não relacionais".

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `content-model`: o campo opcional `section`, só para trilhas diretas na área.
- `catalog-navigation`: a tela da área mostra as seções nomeadas depois de "Trilhas", e os textos ganham "Relacionais/Relational" e "Não relacionais/Non-relational".
- `database-content`: cada trilha de banco declara a sua seção.

## Impact

- `src/content/schema.ts` (`SECTIONS`, campo `section`), `src/content/integrity.ts` (só em trilhas diretas), `src/content/navigation.ts` (agrupamento) e `src/app/area/[areaId]/index.tsx`.
- i18n: `nav.sections`.
- Conteúdo: `section` nas 8 trilhas de banco e o `level` de 67 cards em 23 trilhas.
- Sem mudança na API nem nos dados salvos.

## Fora de escopo

- Seções em outras áreas: o mecanismo serve, mas nenhuma outra área usa seções por enquanto.
- Mudar o texto dos cards. Só o nível muda.
