## 1. Campo acima do teclado

- [x] 1.1 Spec: cenário "Campo acima do teclado" no requisito "Chat do card" (delta desta change)
- [x] 1.2 Teste falhando: com `Platform.OS` em `android` e em `ios`, o `KeyboardAvoidingView` da gaveta usa `behavior="padding"`
- [x] 1.3 Implementação: `behavior="padding"` nas duas plataformas em `ChatSheet.tsx`
- [x] 1.4 Teste passando

## 2. Sugestões sempre disponíveis

- [x] 2.1 Spec: cenários "Sugestões depois da resposta", "Sugestões durante o envio" e "Fora deste card" ajustado (delta desta change)
- [x] 2.2 Testes falhando: após uma resposta, as três sugestões aparecem e tocar em "Me dê um exemplo" envia; com "digitando…" ficam desabilitadas; com `inScope: false` cada sugestão aparece uma vez só
- [x] 2.3 Implementação: bloco inicial sempre no topo da conversa, mensagens embaixo; remover a lista repetida após `inScope: false`
- [x] 2.4 Testes passando

## 3. Verificação

- [x] 3.1 `openspec validate --strict`
- [x] 3.2 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`
