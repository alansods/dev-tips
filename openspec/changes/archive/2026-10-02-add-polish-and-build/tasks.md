## 1. Ícones (Requirement: Identidade visual)

- [x] 1.1 Escrever os testes que falham: ícone principal 1024×1024 RGB, tamanhos e transparência dos demais PNGs, ícones reproduzíveis
- [x] 1.2 Implementar `scripts/generate-icons.js` (PNG sem dependências), o script `npm run icons`, e gerar os assets; testes passando

## 2. Configuração (Requirements: Identidade visual; Configuração de build)

- [x] 2.1 Escrever os testes que falham: configuração do app, perfis de build, identificadores do app
- [x] 2.2 Atualizar o `app.json` e criar o `eas.json`; testes passando

## 3. Animação e toque (Requirements: Animação de virar; Alvos de toque)

- [x] 3.1 Escrever os testes que falham: duração da animação, reduzir movimento, botões disponíveis durante a animação, chips de termos relacionados (≥ 44)
- [x] 3.2 Implementar `useReducedMotion`, `flipDuration`, a animação na `StudySession` e o `hitSlop` dos chips; testes passando

## 4. Verificação final

- [x] 4.1 No navegador: virar cards e conferir a animação; ver o favicon novo
- [x] 4.2 Conferir que todo cenário da spec tem pelo menos um teste com o mesmo nome
- [x] 4.3 Rodar `openspec validate add-polish-and-build --strict` e `npx expo-doctor`
- [x] 4.4 Rodar `npm test`, `npm run lint`, `npx tsc --noEmit` e `npm run format:check`, todos verdes
