## 1. Ajustes

- [ ] 1.1 Testes falhando: "Ordem das seções", "Abrir a política de privacidade" e "Versão do app"
- [ ] 1.2 Adicionar `extra.legal` no `app.json`, a seção Sobre em `src/app/settings.tsx` e os textos nos dicionários
- [ ] 1.3 Trocar a lista de horários por botões lado a lado em `src/reminders/RemindersSection.tsx`; os testes de lembretes continuam verdes
- [ ] 1.4 Testes passando

## 2. Erro inesperado

- [ ] 2.1 Conferir na documentação do SDK 57 o `ErrorBoundary` do expo-router
- [ ] 2.2 Testes falhando: "Falha numa tela", "Tentar de novo" e "Voltar ao início"
- [ ] 2.3 Implementar o `ErrorBoundary` e a tela de erro
- [ ] 2.4 Testes passando

## 3. Página não encontrada

- [ ] 3.1 Testes falhando: "Rota inexistente" e "Ir para Temas"
- [ ] 3.2 Implementar `src/app/+not-found.tsx`
- [ ] 3.3 Testes passando

## 4. Verificação

- [ ] 4.1 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`
