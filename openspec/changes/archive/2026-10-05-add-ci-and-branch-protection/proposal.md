## Why

As verificações do projeto (testes, lint, typecheck, Prettier e OpenSpec) rodam só no computador de quem faz o commit, e só quando alguém lembra. Nada impede um merge com erro, um push forçado ou a exclusão da `main` ou da `dev`, e ninguém acompanha falhas de segurança nas dependências. Foi assim que 21 arquivos ficaram fora do padrão do Prettier sem ninguém perceber.

## What Changes

- **CI:** um workflow do GitHub Actions roda as verificações do app e da API em todo PR e em todo push na `main` e na `dev`, numa máquina limpa.
- **Proteção de branches:** rulesets do GitHub exigem a CI verde para mudar a `main` e a `dev` e bloqueiam push forçado e exclusão. A `main` só muda por PR.
- **Dependabot só para segurança:** alertas de vulnerabilidade e PRs automáticos de correção quando uma dependência tiver falha conhecida, sem PRs semanais de atualização comum.
- Os testes locais continuam como hoje; a CI é uma segunda verificação.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

(nenhuma; é ferramenta de desenvolvimento e não muda o comportamento do app nem da API)

## Impact

- Novo: `.github/workflows/ci.yml`.
- Configuração do repositório no GitHub: 2 rulesets e as opções de segurança do Dependabot.
- README: seção sobre a CI.
- Sem mudança no código do app, da API ou nos dados.

## Fora de escopo

- Deploy automático da API e updates OTA do app (ficam para quando o app for para as lojas).
- Husky ou outros hooks de commit.
- Aprovação obrigatória de PR.
- PRs semanais de atualização de dependências.
