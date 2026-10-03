## Why

O design aprovado ([protótipo](https://claude.ai/artifact/YGzcXF56nDv8npsZkfPf1j)) reorganiza a tela Ajustes e define estados que o app ainda não trata. A seção Sobre leva o link da política de privacidade, exigido pelo login com Google e pelas lojas. E hoje um erro inesperado numa tela ou um link para uma rota que não existe deixam o usuário sem saída.

## What Changes

- Ajustes com as seções na ordem Idioma, Lembretes e **Sobre** (nova). A seção Conta entra em `add-auth`.
- Seção Sobre: links para a política de privacidade e os termos de uso (abrem no navegador) e a versão do app.
- Lembretes: os três horários passam a ser botões lado a lado ("Manhã", "Almoço", "Noite" com o horário embaixo), sem mudança de comportamento.
- Tela de **erro inesperado** com "Tentar de novo" e "Voltar ao início".
- Tela de **página não encontrada** com "Ir para Temas".
- Todos os textos em PT-BR e inglês.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `app-shell`: tela Ajustes com a seção Sobre, e os novos requisitos de erro inesperado e página não encontrada.

## Impact

- `src/app/settings.tsx`, `src/reminders/RemindersSection.tsx` (layout dos horários), dicionários em `src/i18n/`.
- Novos: `src/app/+not-found.tsx` e o tratamento de erro do expo-router (`ErrorBoundary` exportado pelo layout raiz).
- Configuração: URLs da política de privacidade e dos termos em `app.json` (`extra`).

## Fora de escopo

- Escrever e publicar a página da política de privacidade e dos termos (as URLs ficam configuráveis).
- Seção Conta, login e sincronização (`add-auth` e `add-cloud-sync`).
- Envio de erros para um serviço de monitoramento.
