## Context

Formato e testes iguais às trilhas anteriores da série. Diferente delas, esta trilha não tem framework: é linguagem pura de `javascript`, como "JavaScript essencial" e as trilhas de TypeScript. A navegação já agrupa trilhas sem framework em "Linguagem pura" e só mostra a seção quando há trilhas na área, então a seção aparece em Mobile › JavaScript sem mudar código.

## Goals / Non-Goals

**Goals:**
- Explicar, no nível de entrevista, o caminho do código-fonte até o que roda no navegador e no aparelho: transpilação, bundling, otimizações e variáveis de ambiente.
- Cobrir as ferramentas citadas na vaga: Babel, Vite, Webpack, Metro e EAS Build.

**Non-Goals:**
- Escrever plugins de bundler ou configurações avançadas de Webpack.
- Repetir o que a trilha React Native já tem sobre EAS (Build, Submit, Update) e update OTA; aqui o foco é a configuração do build.

## Decisions

### 1. JavaScript puro, nas áreas Frontend e Mobile
Escolhido pelo usuário. Bundlers e transpiladores são ferramentas do ecossistema JavaScript, usadas com qualquer framework.
*Alternativa descartada:* framework React, que juntaria a trilha às anteriores da série, mas sugeriria que Vite, Webpack e Babel são coisa de React.

### 2. Registro no catálogo e ordem na tela
A trilha entra logo depois de `estilizacao-e-design-system`. Como "Linguagem pura" segue a ordem do catálogo, ela aparece depois de TypeScript avançado no Frontend. O cenário de TypeScript no Frontend ("depois das trilhas de JavaScript") continua válido, porque fala das trilhas de JavaScript da capability `javascript-content`.

### 3. Snippets
`js` para `babel.config.js` e `metro.config.js`, `ts` para `vite.config.ts` e componentes, `json` para `package.json` e `eas.json`, `bash` para comandos.

### 4. Versões
- Vite 8 trocou o par esbuild (dev) + Rollup (build) por um único bundler, o Rolldown, com Oxc nas transformações. O card fala do papel do Vite e cita a mudança, e os snippets usam só opções estáveis (`resolve.alias`, `server.proxy`, `build.sourcemap`).
- Expo: variáveis com prefixo `EXPO_PUBLIC_` são embutidas no bundle (não são segredo); no EAS, variáveis por ambiente (`development`, `preview`, `production`) com visibilidade (plain text, sensitive, secret) e o campo `environment` no perfil do `eas.json`.

### 5. Plano de cards (24)
Níveis: J = júnior, P = pleno, S = sênior.

| Deck | Cards |
|---|---|
| Transpilação | concept: Transpilação (J) · Babel (P) · Alvos e polyfills (P) · Source maps (P) — code: babel.config.js com plugin (P) · Alvos no package.json (P) |
| Bundlers na web | concept: Bundler (J) · Vite (P) · Webpack (P) · Tree shaking e code splitting (S) — code: vite.config.ts (P) · Rota carregada sob demanda (P) |
| Metro e EAS | concept: Metro (P) · Hermes (P) · Variáveis de ambiente no Expo (P) · Perfis do EAS Build (P) — code: eas.json com perfis (P) · metro.config.js para SVG (S) |
| Perguntas de entrevista | O que acontece no build de um app? (J) · Vite ou Webpack? (P) · Com TypeScript ainda preciso de Babel? (P) · Posso colocar uma chave secreta em VITE_ ou EXPO_PUBLIC_? (P) · Como reduzir um bundle grande? (S) · O app React Native demora para abrir: o que olhar? (S) |

### 6. Critério de nível
O mesmo das changes anteriores.

## Risks / Trade-offs

- [Ferramentas de build mudam rápido (Vite 8, Rolldown, Oxc)] → Os cards explicam o papel de cada ferramenta e citam as mudanças recentes sem depender delas nos snippets.
- [Exatidão técnica não é coberta por teste] → Consulta à doc antes de escrever e revisão no PR.
