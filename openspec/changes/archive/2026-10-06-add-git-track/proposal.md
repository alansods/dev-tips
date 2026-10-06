## Why

Toda vaga pede versionamento com Git e trabalho em equipe com pull requests e code review, e entrevistas cobram merge vs rebase, conflitos e como desfazer erros. O catálogo só cita Git de passagem nas trilhas de CI/CD. Esta é a quinta trilha da série que cobre as lacunas de uma vaga de frontend sênior.

## What Changes

- Trilha nova **Git e colaboração** (`git-e-colaboracao`), com 24 cards em PT-BR e tradução completa para inglês, no mesmo formato das trilhas existentes:
  - **Modelo do Git:** commit, branch e HEAD, staging area e repositório remoto.
  - **Fluxo em equipe:** merge e rebase, pull request e code review, estratégia de branches e mensagens de commit.
  - **Resolver problemas:** conflitos, revert e reset, cherry-pick e reflog.
  - **Perguntas de entrevista.**
- A trilha fica direta na área Fundamentos, sem linguagem nem seção, depois de "Fundamentos web".

## Capabilities

### New Capabilities

- `git-content`: a trilha "Git e colaboração", com a posição na navegação, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.

### Modified Capabilities

Nenhuma. A área Fundamentos já lista as trilhas diretas na ordem do catálogo.

## Impact

- `content/tracks/git-e-colaboracao/track.json` e `translations/en.json`, registrados em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes novos: `src/content/__tests__/git-track.test.ts` e `src/__tests__/git-navigation.test.tsx`.
- README: lista de trilhas.
- Sem mudança no schema, nas telas, na navegação, na API ou nos dados salvos.

## Fora de escopo

- Plataformas (GitHub, GitLab, Bitbucket) além do que é comum a todas: pull request, revisão e proteção de branch.
- Internals do Git (objetos, packfiles), submodules, monorepos e Git LFS.
- GitHub Actions, que já tem trilha própria.
- As demais trilhas da série, cada uma num change próprio.
