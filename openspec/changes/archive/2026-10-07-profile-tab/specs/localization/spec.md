## MODIFIED Requirements

### Requirement: Trocar o idioma
Escolher um idioma na aba Perfil SHALL mudar todo o app para esse idioma imediatamente, sem reiniciar e sem perder o progresso, o agendamento ou a sessão de navegação. A escolha SHALL ser salva no aparelho e prevalecer sobre o idioma do aparelho nas próximas aberturas. Se a leitura falhar ou o valor salvo for inválido, o app SHALL usar o idioma inicial pelo aparelho, sem exibir erro.

#### Scenario: Troca imediata
- **WHEN** o app está em PT-BR e o usuário escolhe "English" na aba Perfil
- **THEN** o título da tela passa a "Settings" e, ao voltar, as abas mostram "Tracks", "Glossary" e "Progress"

#### Scenario: Escolha mantida ao reabrir
- **WHEN** o aparelho está em inglês, o usuário escolhe "Português (Brasil)", fecha o app e abre de novo
- **THEN** o app abre em PT-BR

#### Scenario: Progresso preservado
- **WHEN** a trilha CRUD tem 4 cards como já sabidos e o usuário troca o idioma
- **THEN** a tela Progresso continua mostrando 4 cards já sabidos

#### Scenario: Valor salvo inválido
- **WHEN** o idioma salvo no aparelho não é `pt-BR` nem `en`
- **THEN** o app usa o idioma inicial pelo aparelho e não exibe erro

### Requirement: Interface traduzida
Todo texto fixo da interface SHALL existir nos dois idiomas e ser exibido no idioma atual: títulos das abas e telas, botões, rótulos, contadores, mensagens de estado vazio, confirmações, rótulos acessíveis e textos das notificações. Os textos em inglês dos principais rótulos SHALL ser:
- abas: "Tracks", "Glossary", "Profile"; tela de progresso: "Progress";
- seção de tema: "Theme", com "Automatic", "Light" e "Dark";
- botões de resposta: "I didn't know" e "I knew it"; "Show answer";
- ações do deck: "Study", "Continue", "Study again";
- revisão: "Today's review", "Review now", "Nothing to review today.";
- resumo: "Review the ones I missed", "Back to track";
- progresso: "Reset progress", "Reset", "Cancel".

O app MUST NOT exibir texto fixo de interface no idioma diferente do escolhido.

#### Scenario: Sessão em inglês
- **WHEN** o app está em inglês e o usuário vira um card
- **THEN** aparecem os botões "I didn't know" e "I knew it"

#### Scenario: Rótulo acessível traduzido
- **WHEN** o app está em inglês e o usuário termina uma sessão com 3 acertos
- **THEN** o resumo tem o rótulo acessível "3 I knew it"

#### Scenario: Dicionários completos
- **WHEN** a suíte de testes roda
- **THEN** todo texto do dicionário PT-BR tem um texto correspondente, não vazio, no dicionário inglês, e vice-versa
