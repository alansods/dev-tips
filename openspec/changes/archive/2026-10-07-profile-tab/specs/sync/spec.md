## MODIFIED Requirements

### Requirement: O que sincroniza
Com sessão, o app SHALL sincronizar, por card, a resposta ("já sabia" ou "não sabia") com a caixa e a data de revisão, além do idioma escolhido e do framework preferido de cada trilha. Os lembretes, o último dia de estudo e os dias estudados MUST continuar só no aparelho. Sem sessão, o app MUST NOT chamar a API de sincronização.

#### Scenario: Progresso em outro aparelho
- **WHEN** o usuário marca `cors` como "já sabia" no aparelho A, e o aparelho B, com a mesma conta, sincroniza
- **THEN** no aparelho B, `cors` aparece como "já sabia", com a mesma data de revisão

#### Scenario: Lembretes por aparelho
- **WHEN** o lembrete está ligado no aparelho A
- **THEN** o aparelho B, com a mesma conta, mantém o lembrete como estava nele

#### Scenario: Sem conta
- **WHEN** não há sessão e o usuário responde cards
- **THEN** nenhuma chamada de sincronização é feita

### Requirement: Estado da sincronização
A tela Conta e a linha da conta na aba Perfil SHALL mostrar o estado da sincronização: "Sincronizado agora há pouco" (ou "Sincronizado há N minutos"), "Sincronizando…", "Aguardando conexão" (sem conexão, com mudanças na fila) ou "Não foi possível sincronizar" (erro da API).

#### Scenario: Sincronizado
- **WHEN** a última sincronização terminou há menos de 1 minuto
- **THEN** aparece "Sincronizado agora há pouco"

#### Scenario: Sem conexão com mudanças pendentes
- **WHEN** não há conexão e há respostas na fila
- **THEN** aparece "Aguardando conexão"
