## RENAMED Requirements

- FROM: `### Requirement: Catálogo de temas no app`
- TO: `### Requirement: Catálogo de trilhas no app`


## MODIFIED Requirements

### Requirement: Navegação por abas
O app SHALL ter 3 abas inferiores, nesta ordem: **Trilhas**, **Glossário** e **Progresso**. Cada aba SHALL ter um rótulo de texto e um ícone. Ao abrir, o app SHALL mostrar a aba Trilhas. A aba ativa MUST ser indicada visualmente e para leitores de tela.

#### Scenario: App abre na aba Trilhas
- **WHEN** o app é aberto
- **THEN** a tela Trilhas é exibida e a aba Trilhas está marcada como selecionada

#### Scenario: Trocar de aba
- **WHEN** o usuário toca na aba Glossário
- **THEN** a tela Glossário é exibida e a aba Glossário passa a ser a selecionada

#### Scenario: Abas na ordem do design
- **WHEN** a barra de abas é exibida
- **THEN** as abas aparecem na ordem Trilhas, Glossário, Progresso, cada uma com rótulo visível

### Requirement: Fontes do design
O app SHALL usar IBM Plex Sans para textos da interface e JetBrains Mono para código e rótulos técnicos. A tela inicial (splash) SHALL permanecer visível até as fontes carregarem. Se as fontes falharem ao carregar, o app SHALL abrir mesmo assim, com a fonte do sistema.

#### Scenario: Falha ao carregar fontes
- **WHEN** o carregamento das fontes falha
- **THEN** o app esconde a splash e exibe a aba Trilhas com a fonte do sistema

### Requirement: Catálogo de trilhas no app
O app SHALL acessar as trilhas empacotadas por um catálogo único. Toda trilha em `content/tracks/<track-id>/` MUST estar registrado no catálogo, e toda trilha registrada MUST existir nessa pasta. As trilhas do catálogo SHALL vir com os valores padrão do schema já aplicados (`origin`, `tags`, `relatedTerms`).

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `crud-4-frameworks`, com todos os decks do seu `track.json`

#### Scenario: Pasta sem registro
- **WHEN** existe uma pasta em `content/tracks/` que não está registrada no catálogo
- **THEN** a suíte de testes falha indicando a trilha não registrada

#### Scenario: Padrões aplicados
- **WHEN** um card do catálogo omitia `tags` no `track.json`
- **THEN** o card exposto pelo catálogo tem `tags` igual a lista vazia

### Requirement: Home mínima
A aba Trilhas SHALL listar cada trilha do catálogo, na ordem do catálogo. Cada trilha SHALL aparecer como um card tocável com o título, a descrição, uma barra de progresso e o texto "sei/total", calculados com a mesma regra de progresso da capability `study-flow`. Tocar no card SHALL abrir a tela da trilha.

#### Scenario: Lista de trilhas
- **WHEN** a aba Trilhas é exibida
- **THEN** o título "O mesmo CRUD em quatro frameworks" aparece na lista

#### Scenario: Progresso da trilha na Home
- **WHEN** nenhum card da trilha tem resposta registrada
- **THEN** o card da trilha mostra "0/" seguido do total de cards da trilha, e a barra está vazia

#### Scenario: Tocar na trilha
- **WHEN** o usuário toca no card da trilha
- **THEN** a tela da trilha abre

### Requirement: Tela Ajustes
O cabeçalho das abas SHALL ter, ao lado do botão de tema claro/escuro, um botão de engrenagem com rótulo acessível "Ajustes" ("Settings" em inglês). Tocar nele SHALL abrir a tela "Ajustes" em tela cheia, sem a barra de abas, com botão de voltar. A tela SHALL ter, nesta ordem, a seção "Conta" (quando disponível na plataforma), a seção "Idioma", com as opções de idioma e a atual marcada, a seção "Lembretes" (quando disponível na plataforma) e a seção "Sobre".

#### Scenario: Abrir Ajustes
- **WHEN** o usuário está na aba Trilhas e toca no botão "Ajustes"
- **THEN** a tela "Ajustes" abre sem a barra de abas e mostra a seção "Idioma" com o idioma atual marcado

#### Scenario: Voltar
- **WHEN** o usuário está em Ajustes e toca em voltar
- **THEN** volta para a aba de onde saiu

#### Scenario: Ordem das seções
- **WHEN** o usuário abre Ajustes no celular
- **THEN** as seções aparecem na ordem "Conta", "Idioma", "Lembretes" e "Sobre"

#### Scenario: Web sem conta
- **WHEN** o app roda na web
- **THEN** a tela Ajustes não mostra a seção "Conta"

### Requirement: Erro inesperado
Quando uma tela falhar ao ser exibida, o app SHALL mostrar a tela "Algo deu errado", com a explicação de que o progresso está salvo no aparelho, o botão "Tentar de novo" (exibe a tela de novo) e o link "Voltar ao início" (abre a aba Trilhas). A tela MUST NOT mostrar detalhes técnicos do erro. O progresso salvo MUST NOT ser perdido.

#### Scenario: Falha numa tela
- **WHEN** a tela da trilha lança um erro ao ser exibida
- **THEN** aparece "Algo deu errado" com os botões "Tentar de novo" e "Voltar ao início", sem a mensagem técnica do erro

#### Scenario: Tentar de novo
- **WHEN** a falha era passageira e o usuário toca em "Tentar de novo"
- **THEN** a tela é exibida normalmente

#### Scenario: Voltar ao início
- **WHEN** o usuário toca em "Voltar ao início"
- **THEN** o app abre a aba Trilhas, com o progresso intacto

### Requirement: Página não encontrada
Uma rota que não existe no app SHALL mostrar a tela "Não encontramos esta página", com a explicação de que o conteúdo pode ter mudado de lugar e o botão "Ir para Trilhas".

#### Scenario: Rota inexistente
- **WHEN** o app abre a rota `/nao-existe`
- **THEN** aparece "Não encontramos esta página" com o botão "Ir para Trilhas"

#### Scenario: Ir para Trilhas
- **WHEN** o usuário toca em "Ir para Trilhas"
- **THEN** o app abre a aba Trilhas
