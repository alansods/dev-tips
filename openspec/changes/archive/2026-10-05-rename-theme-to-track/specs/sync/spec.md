## MODIFIED Requirements

### Requirement: Enviar mudanças à API
`PUT /sync`, com sessão válida, SHALL receber `{ "cards": [{ "trackId", "cardId", "result", "box", "due", "updatedAt" }], "settings": { "language", "preferredVariant", "updatedAt" } }` (as duas partes opcionais; `result`, `box` e `due` nulos significam "sem resposta", usados ao zerar). Para cada card, a API SHALL guardar a versão recebida só se o `updatedAt` dela for maior que o guardado; o mesmo vale para `settings`. A resposta SHALL ser `200` com `{ "serverTime" }`. Um corpo inválido SHALL responder `400` com o código `invalid_body`; mais de 500 cards numa requisição SHALL responder `400` com o código `too_many_items`.

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

### Requirement: O que sincroniza
Com sessão, o app SHALL sincronizar, por card, a resposta ("já sabia" ou "não sabia") com a caixa e a data de revisão, além do idioma escolhido e do framework preferido de cada trilha. Os lembretes e o último dia de estudo MUST continuar só no aparelho. Sem sessão, o app MUST NOT chamar a API de sincronização.

#### Scenario: Progresso em outro aparelho
- **WHEN** o usuário marca `cors` como "já sabia" no aparelho A, e o aparelho B, com a mesma conta, sincroniza
- **THEN** no aparelho B, `cors` aparece como "já sabia", com a mesma data de revisão

#### Scenario: Lembretes por aparelho
- **WHEN** o lembrete está ligado no aparelho A
- **THEN** o aparelho B, com a mesma conta, mantém o lembrete como estava nele

#### Scenario: Sem conta
- **WHEN** não há sessão e o usuário responde cards
- **THEN** nenhuma chamada de sincronização é feita

### Requirement: Zerar sincronizado
"Zerar progresso" de uma trilha, com sessão, SHALL zerar também essa trilha na conta, para que os outros aparelhos zerem na próxima sincronização.

#### Scenario: Zerar em um aparelho
- **WHEN** o usuário zera a trilha CRUD no aparelho A, e o aparelho B sincroniza
- **THEN** no aparelho B a trilha CRUD também aparece zerado

### Requirement: Aviso de offline
Com sessão e sem conexão, as abas SHALL mostrar abaixo do cabeçalho o aviso "Offline. Seu progresso será enviado depois.", sem bloquear nenhuma ação. O aviso SHALL sumir quando a conexão voltar. Sem sessão, o aviso MUST NOT aparecer.

#### Scenario: Ficar offline com conta
- **WHEN** há sessão e a conexão cai
- **THEN** a aba Trilhas mostra "Offline. Seu progresso será enviado depois." e os cards continuam abrindo normalmente

#### Scenario: Reconectar
- **WHEN** a conexão volta
- **THEN** o aviso some

#### Scenario: Offline sem conta
- **WHEN** não há sessão e a conexão cai
- **THEN** nenhum aviso de offline aparece
