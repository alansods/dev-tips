## Context

Formato e testes iguais às trilhas anteriores da série. A trilha é direta na área Fundamentos, como "Fundamentos web": sem linguagem, sem framework e sem seção. A tela da área lista as trilhas diretas na ordem do catálogo, então nenhum código muda.

O cenário "Fundamentos com o conteúdo atual" da capability `catalog-navigation` descreve o catálogo original de teste (só CRUD e Fundamentos web), que os testes de navegação usam por mock. Ele não muda; a nova posição é descrita na capability `git-content`.

## Goals / Non-Goals

**Goals:**
- Cobrir, no nível de entrevista, o modelo mental do Git (commits, branches, HEAD, staging, remoto), o fluxo em equipe (PR, review, merge vs rebase, estratégias de branch) e como sair de problemas comuns (conflitos, desfazer, recuperar).

**Non-Goals:**
- Internals do Git e comandos raros. GitHub Actions, que já tem trilha.

## Decisions

### 1. Trilha direta em Fundamentos
Escolhido pelo usuário. Git é base para qualquer stack.
*Alternativas descartadas:* seção CI/CD de DevOps e Cloud (esconderia um assunto básico numa área avançada) e as duas áreas (repetiria a trilha sem necessidade).

### 2. Comandos atuais
Os snippets usam `git switch` e `git restore` (no lugar dos usos antigos de `git checkout`), `git push --force-with-lease` (em vez de `--force`) e `git revert -m 1` para merges. `bash` para comandos e `text` para mensagens de commit e marcadores de conflito.

### 3. Plano de cards (24)
Níveis: J = júnior, P = pleno, S = sênior.

| Deck | Cards |
|---|---|
| Modelo do Git | concept: Commit (J) · Branch e HEAD (J) · Staging area (J) · Repositório remoto (P) — code: Fluxo do dia a dia (J) · Desfazer no local (P) |
| Fluxo em equipe | concept: Merge e rebase (P) · Pull request e code review (P) · Estratégia de branches (S) · Mensagem de commit (P) — code: Atualizar a branch com rebase (P) · Conventional Commits (J) |
| Resolver problemas | concept: Conflito (P) · revert e reset (P) · cherry-pick (P) · reflog (S) — code: Resolver um conflito (P) · Achar o commit do bug com bisect (S) |
| Perguntas de entrevista | fetch ou pull? (J) · Quando usar merge e quando usar rebase? (P) · Commitei na branch errada. E agora? (P) · Como desfazer um commit que já foi enviado? (P) · O que você observa num code review? (S) · Um segredo foi commitado. O que fazer? (S) |

### 4. Critério de nível
O mesmo das changes anteriores.

## Risks / Trade-offs

- [Comandos com variações entre versões e plataformas] → Só comandos estáveis e atuais do Git, conferidos na documentação oficial.
- [Exatidão técnica não é coberta por teste] → Revisão no PR.
