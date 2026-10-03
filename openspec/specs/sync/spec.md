# sync Specification

## Purpose

Mantém uma cópia do progresso e das preferências na conta do usuário, juntando as mudanças feitas em cada aparelho, sem deixar de funcionar offline.
## Requirements

### Requirement: Enviar mudanças à API
`PUT /sync`, com sessão válida, SHALL receber `{ "cards": [{ "themeId", "cardId", "result", "box", "due", "updatedAt" }], "settings": { "language", "preferredVariant", "updatedAt" } }` (as duas partes opcionais; `result`, `box` e `due` nulos significam "sem resposta", usados ao zerar). Para cada card, a API SHALL guardar a versão recebida só se o `updatedAt` dela for maior que o guardado; o mesmo vale para `settings`. A resposta SHALL ser `200` com `{ "serverTime" }`. Um corpo inválido SHALL responder `400` com o código `invalid_body`; mais de 500 cards numa requisição SHALL responder `400` com o código `too_many_items`.

#### Scenario: Mudança nova
- **WHEN** o card `cors` está guardado com `updatedAt` 100 e o aparelho envia `cors` com `updatedAt` 200
- **THEN** a API guarda a versão de `updatedAt` 200

#### Scenario: Mudança antiga
- **WHEN** o card `cors` está guardado com `updatedAt` 300 e chega uma versão com `updatedAt` 200
- **THEN** a API mantém a versão de `updatedAt` 300 e responde `200`

#### Scenario: Corpo inválido
- **WHEN** um card chega sem `cardId`
- **THEN** a resposta é `400` com `error.code` igual a `invalid_body`

#### Scenario: Dados de outro usuário
- **WHEN** o usuário A envia mudanças
- **THEN** elas ficam só na conta de A, e o usuário B não as recebe

### Requirement: Buscar mudanças da API
`GET /sync?since=<timestamp>`, com sessão válida, SHALL devolver `200` com `{ "cards": [...], "settings"?, "serverTime" }`: os cards e as preferências da conta guardados depois de `since`. Sem `since`, SHALL devolver tudo.

#### Scenario: Só o que mudou
- **WHEN** a conta tem os cards `api` (guardado em 100) e `cors` (guardado em 300), e o aparelho pede `since=200`
- **THEN** a resposta traz só `cors`

#### Scenario: Primeira busca
- **WHEN** o aparelho pede sem `since`
- **THEN** a resposta traz todos os cards e as preferências da conta

### Requirement: O que sincroniza
Com sessão, o app SHALL sincronizar, por card, a resposta ("já sabia" ou "não sabia") com a caixa e a data de revisão, além do idioma escolhido e do framework preferido de cada tema. Os lembretes e o último dia de estudo MUST continuar só no aparelho. Sem sessão, o app MUST NOT chamar a API de sincronização.

#### Scenario: Progresso em outro aparelho
- **WHEN** o usuário marca `cors` como "já sabia" no aparelho A, e o aparelho B, com a mesma conta, sincroniza
- **THEN** no aparelho B, `cors` aparece como "já sabia", com a mesma data de revisão

#### Scenario: Lembretes por aparelho
- **WHEN** o lembrete está ligado no aparelho A
- **THEN** o aparelho B, com a mesma conta, mantém o lembrete como estava nele

#### Scenario: Sem conta
- **WHEN** não há sessão e o usuário responde cards
- **THEN** nenhuma chamada de sincronização é feita

### Requirement: Quando sincronizar
Com sessão e conexão, o app SHALL sincronizar (enviar a fila e buscar mudanças) ao abrir, ao voltar para o primeiro plano, ao reconectar e 5 segundos depois da última resposta a um card. Mudanças feitas sem conexão SHALL ficar numa fila salva no aparelho e ser enviadas na próxima sincronização, mesmo que o app tenha sido fechado.

#### Scenario: Depois de responder
- **WHEN** o usuário responde três cards seguidos
- **THEN** uma única sincronização acontece 5 segundos depois da última resposta

#### Scenario: Offline e depois online
- **WHEN** o usuário responde cards sem conexão, fecha o app e o abre de novo com conexão
- **THEN** as respostas são enviadas à API

### Requirement: Conflitos
Quando o mesmo card mudar em dois aparelhos, SHALL valer a mudança com o `updatedAt` mais recente, card a card; o mesmo vale para as preferências. Mudanças de cards diferentes MUST NOT se perder.

#### Scenario: Mesmo card em dois aparelhos
- **WHEN** `cors` é marcado como "não sabia" no aparelho A às 10:00 e como "já sabia" no aparelho B às 10:05, e os dois sincronizam
- **THEN** nos dois aparelhos `cors` fica como "já sabia"

#### Scenario: Cards diferentes
- **WHEN** o aparelho A responde `api` e o aparelho B responde `cors`, ambos offline, e depois os dois sincronizam
- **THEN** os dois aparelhos ficam com `api` e `cors` respondidos

### Requirement: Primeiro login
No primeiro login de um aparelho, o progresso local SHALL ser juntado ao da conta pelas mesmas regras de conflito, sem apagar nada que só exista de um dos lados. Ao terminar, o app SHALL mostrar por alguns segundos a mensagem "Seu progresso foi salvo na conta.".

#### Scenario: Aparelho com progresso, conta vazia
- **WHEN** o aparelho tem 10 cards respondidos e o usuário entra numa conta nova
- **THEN** a conta passa a ter os 10 cards, e aparece "Seu progresso foi salvo na conta."

#### Scenario: Os dois com progresso
- **WHEN** o aparelho tem `api` respondido e a conta tem `cors` respondido
- **THEN** depois do login, o aparelho e a conta têm `api` e `cors`

### Requirement: Zerar sincronizado
"Zerar progresso" de um tema, com sessão, SHALL zerar também esse tema na conta, para que os outros aparelhos zerem na próxima sincronização.

#### Scenario: Zerar em um aparelho
- **WHEN** o usuário zera o tema CRUD no aparelho A, e o aparelho B sincroniza
- **THEN** no aparelho B o tema CRUD também aparece zerado

### Requirement: Estado da sincronização
A tela Conta e a linha da conta em Ajustes SHALL mostrar o estado da sincronização: "Sincronizado agora há pouco" (ou "Sincronizado há N minutos"), "Sincronizando…", "Aguardando conexão" (sem conexão, com mudanças na fila) ou "Não foi possível sincronizar" (erro da API).

#### Scenario: Sincronizado
- **WHEN** a última sincronização terminou há menos de 1 minuto
- **THEN** aparece "Sincronizado agora há pouco"

#### Scenario: Sem conexão com mudanças pendentes
- **WHEN** não há conexão e há respostas na fila
- **THEN** aparece "Aguardando conexão"

### Requirement: Aviso de offline
Com sessão e sem conexão, as abas SHALL mostrar abaixo do cabeçalho o aviso "Offline. Seu progresso será enviado depois.", sem bloquear nenhuma ação. O aviso SHALL sumir quando a conexão voltar. Sem sessão, o aviso MUST NOT aparecer.

#### Scenario: Ficar offline com conta
- **WHEN** há sessão e a conexão cai
- **THEN** a aba Temas mostra "Offline. Seu progresso será enviado depois." e os cards continuam abrindo normalmente

#### Scenario: Reconectar
- **WHEN** a conexão volta
- **THEN** o aviso some

#### Scenario: Offline sem conta
- **WHEN** não há sessão e a conexão cai
- **THEN** nenhum aviso de offline aparece
