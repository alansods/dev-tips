## Why

Ao estudar um card, o usuário às vezes não entende a resposta e não tem a quem perguntar. Um chat que responde só sobre o card na tela resolve a dúvida na hora, sem sair da sessão. É o primeiro recurso pago do plano Pro (change `add-subscriptions`, já arquivada).

## What Changes

- **Botão "Perguntar"** na barra de ações da sessão de estudo:
  - fica fixo no canto inferior direito, tanto na frente (ao lado de "Mostrar resposta") quanto no verso (ao lado de "Não sabia" e "Já sabia"), e nunca muda de lugar;
  - sem conta ou no plano grátis, mostra o selo **PRO** e abre o paywall;
  - para quem é Pro, abre o chat. Funciona no Android e no iOS. Não aparece na web.
- **Chat** numa gaveta inferior, no mesmo padrão da gaveta do glossário:
  - mostra o tipo e o título do card;
  - tem sugestões rápidas, mensagens com blocos de código, os estados de carregando, erro, fora do escopo e cota atingida, e um aviso de que a IA pode errar;
  - a conversa recomeça ao trocar de card.
- **API:** nova rota `POST /assistant/ask`.
  - recebe o texto do card, as últimas mensagens e a pergunta;
  - chama o **Gemini Flash** e responde só sobre o card;
  - usa a cota do Pro (`assertCanAsk` e `recordAnswered`). Pergunta fora do escopo não consome cota.
- Telas aprovadas no design: https://claude.ai/artifact/G1pWELAgvYJHWZYLngHjZ2 (telas 1 a 7 e 9).

## Capabilities

### New Capabilities
- `card-assistant`: o botão "Perguntar" na sessão, o chat do card no app e a rota da API que responde com o Gemini dentro da cota do Pro.

### Modified Capabilities
<!-- nenhuma: a barra de ações ganha o botão, mas os requisitos de study-flow não mudam -->

## Fora de escopo

- Venda do Pro no iOS: no iPhone, quem já é Pro usa o chat, e os demais veem o paywall com o aviso de indisponível.
- Guardar o histórico das conversas, streaming da resposta, voz e anexos.
- Chat na web.
- Perguntas sobre vários cards ou sobre a trilha inteira.

## Impact

- **API (`api/`):**
  - nova rota `api/src/routes/assistant.ts`;
  - novo cliente do Gemini em `api/src/assistant/gemini.ts`, colocado em `deps.ts`;
  - novo segredo `GEMINI_API_KEY` e nova variável `GEMINI_MODEL`.
- **App:**
  - `src/assistant/`: botão, gaveta do chat, texto do card e chamada à API;
  - mudanças em `src/study/StudySession.tsx`, na barra de ações;
  - textos em PT-BR e EN.
- **Externo:** uma chave de API do Gemini (Google AI Studio). O custo por pergunta foi estimado no planejamento: ~R$ 0,04, com teto de ~R$ 0,06.
