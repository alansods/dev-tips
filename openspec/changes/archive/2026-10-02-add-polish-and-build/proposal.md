## Why

O app funciona, mas ainda tem a cara do template: o ícone e a splash são os do Expo, a virada do card é seca e não há configuração para gerar um build instalável. Este é o polimento previsto no plano, antes de usar o app no dia a dia, sem o Expo Go.

## What Changes

- **Animação de virar o card:** a frente gira e dá lugar ao verso em cerca de 250 ms. Respeita a opção de "reduzir movimento" do sistema: com ela ligada, a troca é imediata.
- **Identidade visual própria:**
  - ícone do app (cards empilhados com o acento azul do design sobre fundo escuro);
  - ícone adaptativo do Android (frente, fundo e monocromático);
  - splash com o mesmo desenho sobre o fundo escuro do tema;
  - favicon para a web.
- **Alvos de toque:** os chips de termos relacionados chegam a 44 pt de área tocável, o mínimo do design, sem mudar o tamanho visual.
- **Configuração de build com EAS** (`eas.json`), com 3 perfis:
  - `development`: development build;
  - `preview`: APK e build interno para testar no celular;
  - `production`: lojas.

  Mais o identificador do app (`bundleIdentifier` / `package`). Rodar o build exige a conta Expo do usuário: fica documentado, mas não é executado nesta change.

## Capabilities

### New Capabilities
- `app-polish`: animação de virar, identidade visual (ícone e splash), alvos de toque mínimos e configuração de build.

### Modified Capabilities
<!-- nenhuma -->

## Impact

- **Novos arquivos:**
  - `scripts/generate-icons.mjs`, gerador determinístico dos PNGs, só com Node e `zlib`, sem dependências;
  - os PNGs em `assets/`;
  - `eas.json`;
  - `src/study/useReducedMotion.ts`.
- **Arquivos alterados:** `app.json` (ícones, splash, cores e identificadores), a sessão de estudo (animação) e `TermChips` (`hitSlop`).
- Nenhuma dependência de runtime nova. O `eas-cli` é usado via `npx`, sem instalar.

## Fora de escopo

- Executar `eas build` e publicar nas lojas: depende de login na conta Expo e de contas de desenvolvedor Apple e Google.
- Ícone desenhado por designer. O ícone gerado é provisório, mas coerente com o design.
- Animações em outras telas e haptics.
