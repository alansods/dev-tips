## 1. Spec

- [x] 1.1 Delta da spec `card-assistant` (requisito "Enviar pergunta no app": teclado fecha e conversa rola até a última mensagem; cenários "Segunda pergunta" e "Teclado fecha ao enviar")

## 2. Teclado fecha ao enviar

- [x] 2.1 Teste falhando: `Keyboard.dismiss` é chamado ao enviar pelo botão e por uma sugestão
- [x] 2.2 Implementação: `Keyboard.dismiss()` no `send` do `ChatSheet`
- [x] 2.3 Teste passando

## 3. Segunda pergunta visível

- [x] 3.1 Testes falhando: duas perguntas seguidas mostram as 2 perguntas e as 2 respostas em ordem; a conversa chama `scrollToEnd` quando o conteúdo cresce
- [x] 3.2 Implementação: `ref` na `ScrollView` + `onContentSizeChange` → `scrollToEnd`; chave estável das mensagens
- [x] 3.3 Testes passando

## 4. Balão com código do tamanho do conteúdo

- [x] 4.1 Spec: cenário "Conversa longa com código"
- [x] 4.2 Teste falhando: a área de rolagem do bloco de código não cresce (`flexGrow: 0`)
- [x] 4.3 Implementação: `flexGrow: 0` na `ScrollView` horizontal do `MessageText`
- [x] 4.4 Teste passando

## 5. Verificação

- [x] 5.1 Verificação manual no iPhone: 3 perguntas seguidas com respostas que tenham código, cada resposta visível no fim, teclado fecha a cada envio
- [x] 5.2 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
