## Context

Design aprovado no protótipo (artboards "Ajustes — conectado", "Erro inesperado" e "Página não encontrada"). O app usa expo-router (SDK 57): rotas em `src/app/`, `settings.tsx` já existe, e o layout raiz é `src/app/_layout.tsx`.

## Goals / Non-Goals

**Goals:**
- Ajustes no visual do protótipo; nenhum beco sem saída por erro ou rota inválida.

**Non-Goals:**
- Monitoramento de erros remoto.

## Decisions

- **Erro inesperado com o `ErrorBoundary` do expo-router:** exportar `ErrorBoundary` de um layout faz o router mostrar esse componente quando uma tela daquela árvore lança erro. Ele recebe `error` e `retry`, e o `retry` corresponde ao "Tentar de novo". Alternativa descartada: um error boundary React próprio, que duplicaria o que o router já oferece. A documentação do SDK 57 deve ser conferida na implementação.
- **Página não encontrada com `src/app/+not-found.tsx`,** a convenção do expo-router para rotas sem correspondência.
- **URLs legais em `app.json` → `extra.legal`** (`privacyUrl`, `termsUrl`), lidas com `expo-constants`; a versão vem de `Constants.expoConfig.version`. Abrem com `Linking.openURL` no navegador do sistema.
- **Horários dos lembretes:** os três presets viram botões lado a lado (`accessibilityRole="radio"`, nome acessível "Manhã 08:00" etc.), o que mantém a spec `reminders` intacta (só o visual muda).

## Risks / Trade-offs

- [URLs legais ainda sem página publicada] → valores provisórios até a política existir; publicar antes de liberar o login com Google.
