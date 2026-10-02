## Context

A sessão de estudo (`src/study/StudySession.tsx`) troca a frente pelo verso instantaneamente. Os assets em `assets/` são os do template Expo. Não há biblioteca de imagem disponível (nem PIL nem ImageMagick). O `sips` do macOS não rasteriza SVG. Requisitos em `specs/app-polish/spec.md`.

## Goals / Non-Goals

**Goals:** acabamento sem dependências novas de runtime, ícones reproduzíveis por script e build pronto para rodar com um comando quando o usuário quiser.

**Non-Goals:** ícone final de designer e publicação nas lojas.

## Decisions

### 1. Animação com `Animated` do React Native
- Um `Animated.Value` vai de 0 a 1 quando `revealed` muda para `true`. O card interpola `rotateY` (de 90° a 0°) e `opacity` (de 0 a 1) no verso, com `perspective` de 900.
- A duração vem de `flipDuration(reducedMotion)`: 0 ou 250 ms, uma função pura e testável.
- `useNativeDriver: true`, que funciona no iOS e no Android. Na web, o RN Web cai para JS sem quebrar.
- Os botões dependem só do estado do reducer, não da animação, por isso aparecem na hora.
- *Alternativa:* Reanimated. Descartada porque é dependência nova para uma animação simples.

### 2. `useReducedMotion`
O hook lê `AccessibilityInfo.isReduceMotionEnabled()` na montagem e assina o evento `reduceMotionChanged`. Erros são tratados como "desativado".

### 3. Gerador de ícones sem dependências
- `scripts/generate-icons.mjs` desenha com primitivas geométricas: retângulos arredondados com anti-aliasing por supersampling 4×. Codifica PNG manualmente (assinatura, IHDR, IDAT com `zlib.deflateSync`, IEND, CRC32).
- **Desenho:** um card de trás (`#273140`) levemente deslocado e um card da frente (`#8296FF`) com três linhas de "texto" (`#0A0F1F`).
- **Arquivos gerados:**
  - `icon.png`: RGB, fundo `#0C1015`;
  - `android-icon-foreground.png`: transparente, desenho dentro de 66%;
  - `android-icon-background.png`: sólido;
  - `android-icon-monochrome.png`: branco sobre transparente;
  - `splash-icon.png`: transparente;
  - `favicon.png`.
- É determinístico: sem data nem aleatoriedade, então a mesma saída sempre.
- Script `npm run icons`.

### 4. `app.json` e `eas.json`
- `app.json`:
  - `ios.bundleIdentifier` e `android.package` = `dev.devtips.app`;
  - `android.adaptiveIcon.backgroundColor` = `#0C1015`;
  - plugin `expo-splash-screen` com `{ image: './assets/splash-icon.png', backgroundColor: '#0C1015', imageWidth: 200 }`.
- `eas.json` com `cli.appVersionSource: 'remote'` e os três perfis. O `preview` usa `android.buildType: 'apk'`.
- Como gerar o build fica documentado na resposta e no README da change: `npx eas-cli@latest login`, depois `npx eas-cli@latest build --profile preview --platform android`.

### 5. Testes
- `scripts/__tests__/icons.test.ts`: lê o cabeçalho dos PNGs (largura, altura, tipo de cor) e roda o gerador em diretório temporário duas vezes, comparando bytes.
- Teste de config para `app.json` e `eas.json`.
- `flipDuration` testada em unidade. O teste de tela verifica os botões logo depois de "Mostrar resposta" (já coberto pelos fluxos existentes; aqui ganha nome próprio).
- Teste do `TermChips`: `minHeight + hitSlop.top + hitSlop.bottom >= 44`.

## Risks / Trade-offs

- [`rotateY` com `perspective` renderizar diferente no Android antigo] → A opacidade junto suaviza qualquer diferença, e com movimento reduzido nem anima.
- [Ícone gerado ficar simples demais] → É provisório e fácil de trocar: basta substituir os PNGs, ou ajustar as formas no script.
- [O jest não roda `.mjs` facilmente] → O gerador é escrito como CommonJS (`.js`) para ser importado nos testes, com um wrapper de CLI no mesmo arquivo.
