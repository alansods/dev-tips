## Context

- O plano Pro já existe (change `add-subscriptions`, arquivada).
  - Na API, `assertCanAsk` e `recordAnswered`, em `api/src/billing/quota.ts`, aplicam a cota.
  - No app, `useIsPro()`, `useSubscriptionStore` e a rota `/paywall` ficam em `src/subscriptions/` e `src/app/paywall.tsx`.
- A sessão de estudo fica em `src/study/StudySession.tsx`.
  - A barra de ações tem "Mostrar resposta" na frente e "Não sabia" e "Já sabia" no verso.
  - O card recebido já está no idioma atual, porque a trilha passa por `localizeTrack`.
  - A gaveta do glossário (`src/glossary/TermSheet.tsx`) é um `Modal` transparente com painel inferior. O chat segue o mesmo padrão.
- Chamadas autenticadas do app passam por `authFetch` (`src/auth/api.ts`), que renova o token sozinho.

## Goals / Non-Goals

**Goals:**
- Custo por pergunta limitado e previsível, com tamanhos máximos de entrada e saída.
- A API testável sem chamar o Gemini de verdade.
- O botão "Perguntar" sempre no mesmo lugar da barra, sem mudar o layout das outras ações.

**Non-Goals:**
- Garantir que o modelo nunca saia do assunto. A instrução e o campo `inScope` reduzem isso, mas não é uma garantia formal.
- Moderação de conteúdo além dos filtros padrão do Gemini.

## Decisions

### 1. O app envia o texto do card
- **Escolha:** a API não tem o conteúdo das trilhas. O app monta o texto do card a partir do objeto já traduzido e envia junto com a pergunta (`src/assistant/cardText.ts`).
  - O texto é um JSON com os campos do card, sem `id` e sem `relatedTerms`, e cortado em 8.000 caracteres.
- **Alternativa descartada:** empacotar `content/tracks` na API e buscar o card pelo id. Isso garante que o texto é o card real, mas obriga um novo deploy da API a cada mudança de conteúdo, e o pacote do Worker cresce cerca de 1 MB.
- **Risco aceito:** um cliente adulterado pode mandar outro texto. Como só Pro pode perguntar e a cota limita a 100 perguntas, o pior caso é o próprio assinante usar a cota dele com outro assunto.

### 2. API sem estado
- O app envia as últimas 6 mensagens a cada pergunta. A API aceita até 10, como folga.
- Nada da conversa é guardado no servidor, o que é mais simples e mais barato. A conversa vive em memória no app, por card.

### 3. Gemini via REST, atrás de `deps`
- **Cliente:** `api/src/assistant/gemini.ts` faz `POST https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent` com a chave no cabeçalho `x-goog-api-key`.
- **Conteúdo do pedido:**
  - `systemInstruction`: as regras, o texto do card e o idioma;
  - `contents`: o histórico e a pergunta, com os papéis `user` e `model`;
  - `generationConfig`: `responseMimeType: application/json`, um schema `{ inScope: boolean, answer: string }`, `maxOutputTokens` de 1.500 e `temperature` de 0,4, com `thinkingConfig.thinkingLevel: "low"`. O Gemini 3 raciocina em nível `high` por padrão, e esses tokens contam no limite de saída: com 800 tokens e raciocínio alto, a resposta vinha cortada (JSON incompleto).
- **Por que REST e não o SDK `@google/genai`:** sem dependência nova no Worker, e o pedido fica explícito para o teste conferir. O SDK marca `responseSchema` como obsoleto em favor de `response_format`. Na implementação, confiro na documentação atual qual campo a REST v1beta aceita.
- **Testes:** o cliente entra em `Deps` como `gemini: GeminiClient`. Os testes usam um falso que grava o pedido e devolve a resposta escolhida.
- **Tempo limite:** `AbortSignal.timeout(30_000)`. Erro, tempo esgotado ou JSON inválido viram `502 assistant_unavailable`.

### 4. Fluxo da rota `POST /assistant/ask`

```
requireAuth → validar corpo (Zod) → ticket = assertCanAsk() → gemini.ask()
  → inScope ? recordAnswered(ticket) : (nada)
  → answer = inScope ? modelo : texto fixo de recusa
  → 200 { answer, inScope, questions: uso atualizado }
```

O texto de recusa é fixo na API, não vem do modelo. Assim fica previsível e testável.

### 5. App: `src/assistant/`
- **`AskButton.tsx`:** quadrado de 52px com contorno e ícone de balão com "?". Com `isPro` falso, leva o selo "PRO" no canto e abre `/paywall`. Fica como último filho da barra em `StudySession`, nas duas faces.
- **`ChatSheet.tsx`:** a gaveta (`Modal` transparente com painel de ~85% da altura), com a lista de mensagens, as sugestões, o campo, o rodapé de cota e o aviso de IA. Usa `KeyboardAvoidingView` para o teclado não cobrir o campo.
- **`useCardChat.ts`:** guarda o estado da conversa por `cardId`, com mensagens, status (`idle`, `sending`, `error`, `quota`) e a última pergunta para "Tentar de novo".
  - A `StudySession` guarda a conversa só do card atual. Ao mudar `card.id`, a conversa é zerada.
- **`api.ts`:** `ask()` chama `authFetch('/assistant/ask')` e mapeia os erros:
  - `NetworkError` vira `offline`;
  - `403 pro_required` vira `pro_required`;
  - `429` vira `quota`;
  - o resto vira `error`.
- **`MessageText.tsx`:** divide o texto pelas cercas de três crases e renderiza blocos de código com `CodeBlock`, que já existe em `src/components/cards/parts.tsx`.
- **Uso da cota:** depois de uma resposta, o app atualiza `useSubscriptionStore` com o `questions` devolvido. Assim a tela Conta fica certa sem outra chamada.

### 6. Configuração
- `GEMINI_MODEL` vai como variável em `wrangler.jsonc`, com o nome exato do Flash conferido na documentação do Google na implementação.
- `GEMINI_API_KEY` vai como segredo (`wrangler secret put`), e os tipos dele entram em `api/src/secrets.d.ts`.

## Risks / Trade-offs

- **[Modelo sai do assunto mesmo assim]** → A instrução é explícita, o texto do card é a única fonte e há o rótulo `inScope`. O custo de um desvio é uma pergunta da cota.
- **[Formato JSON quebrado]** → Validado com Zod. Uma falha vira `502` e não consome a cota.
- **[Prompt injection vinda do próprio usuário]** → O impacto se limita à conversa dele. Não há ferramentas, dados de outros usuários nem segredos no contexto do modelo.
- **[Latência alta, de vários segundos]** → "digitando…", resposta curta (`maxOutputTokens`) e tempo limite de 30 segundos.
- **[Preço do Gemini muda (já dobra em 01/2027)]** → O modelo fica configurável em `GEMINI_MODEL`, e a cota limita o pior caso.

## Migration Plan

1. Criar a chave no Google AI Studio e rodar `npx wrangler secret put GEMINI_API_KEY`. Conferir `GEMINI_MODEL` e fazer o deploy da API.
2. Publicar o app. Sem a chave, a rota responde `502` e o chat mostra "Não consegui responder agora.".

**Rollback:** reverter o deploy. Não há migration de banco.
