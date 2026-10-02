# app-shell Specification

## Purpose

Define a estrutura comum do app (navegação por abas, tema visual claro/escuro, fontes e acesso ao catálogo de temas) sobre a qual as telas de estudo são construídas.

## Requirements

### Requirement: Navegação por abas
O app SHALL ter 3 abas inferiores, nesta ordem: **Temas**, **Glossário** e **Progresso**. Cada aba SHALL ter um rótulo de texto e um ícone. Ao abrir, o app SHALL mostrar a aba Temas. A aba ativa MUST ser indicada visualmente e para leitores de tela.

#### Scenario: App abre na aba Temas
- **WHEN** o app é aberto
- **THEN** a tela Temas é exibida e a aba Temas está marcada como selecionada

#### Scenario: Trocar de aba
- **WHEN** o usuário toca na aba Glossário
- **THEN** a tela Glossário é exibida e a aba Glossário passa a ser a selecionada

#### Scenario: Abas na ordem do design
- **WHEN** a barra de abas é exibida
- **THEN** as abas aparecem na ordem Temas, Glossário, Progresso, cada uma com rótulo visível

### Requirement: Telas provisórias
Enquanto a change de glossário não for implementada, a aba Glossário SHALL exibir o título da tela e uma mensagem informando que o conteúdo ainda vai chegar.

#### Scenario: Glossário provisório
- **WHEN** o usuário abre a aba Glossário
- **THEN** vê o título "Glossário" e uma mensagem de que a tela ainda está em construção

### Requirement: Tema claro e escuro
O app SHALL ter um modo claro e um modo escuro, com as cores do design aprovado. Por padrão, o modo SHALL seguir a configuração do sistema. O cabeçalho SHALL ter um botão para alternar o modo manualmente. A escolha manual SHALL prevalecer sobre o sistema e SHALL ser lembrada entre aberturas do app. O botão MUST ter rótulo de acessibilidade que diga para qual modo ele muda.

#### Scenario: Segue o sistema por padrão
- **WHEN** não há escolha salva e o sistema está em modo escuro
- **THEN** o app abre no modo escuro

#### Scenario: Alternar manualmente
- **WHEN** o app está no modo claro e o usuário toca no botão de tema
- **THEN** o app passa para o modo escuro e o botão passa a se chamar "Usar tema claro"

#### Scenario: Escolha lembrada
- **WHEN** o usuário escolheu o modo escuro e reabre o app com o sistema em modo claro
- **THEN** o app abre no modo escuro

#### Scenario: Preferência indisponível
- **WHEN** a leitura da preferência salva falha
- **THEN** o app segue o sistema, sem exibir erro

### Requirement: Contraste mínimo
Nos dois modos, o texto principal e o texto secundário MUST ter contraste de pelo menos 4,5:1 com o fundo e com as superfícies onde aparecem. O texto sobre a cor de destaque também MUST ter contraste de pelo menos 4,5:1.

#### Scenario: Contraste dos tokens
- **WHEN** o contraste dos pares de cor de texto e fundo de cada modo é calculado
- **THEN** todos os pares ficam em 4,5:1 ou mais

### Requirement: Fontes do design
O app SHALL usar IBM Plex Sans para textos da interface e JetBrains Mono para código e rótulos técnicos. A tela inicial (splash) SHALL permanecer visível até as fontes carregarem. Se as fontes falharem ao carregar, o app SHALL abrir mesmo assim, com a fonte do sistema.

#### Scenario: Falha ao carregar fontes
- **WHEN** o carregamento das fontes falha
- **THEN** o app esconde a splash e exibe a aba Temas com a fonte do sistema

### Requirement: Catálogo de temas no app
O app SHALL acessar os temas empacotados por um catálogo único. Todo tema em `content/themes/<theme-id>/` MUST estar registrado no catálogo, e todo tema registrado MUST existir nessa pasta. Os temas do catálogo SHALL vir com os valores padrão do schema já aplicados (`origin`, `tags`, `relatedTerms`).

#### Scenario: Tema registrado
- **WHEN** o catálogo é carregado
- **THEN** ele contém o tema `crud-4-frameworks`, com os 4 decks

#### Scenario: Pasta sem registro
- **WHEN** existe uma pasta em `content/themes/` que não está registrada no catálogo
- **THEN** a suíte de testes falha indicando o tema não registrado

#### Scenario: Padrões aplicados
- **WHEN** um card do catálogo omitia `tags` no `theme.json`
- **THEN** o card exposto pelo catálogo tem `tags` igual a lista vazia

### Requirement: Home mínima
A aba Temas SHALL listar cada tema do catálogo, na ordem do catálogo. Cada tema SHALL aparecer como um card tocável com o título, a descrição, uma barra de progresso e o texto "sei/total", calculados com a mesma regra de progresso da capability `study-flow`. Tocar no card SHALL abrir a tela do tema.

#### Scenario: Lista de temas
- **WHEN** a aba Temas é exibida
- **THEN** o título "O mesmo CRUD em quatro frameworks" aparece na lista

#### Scenario: Progresso do tema na Home
- **WHEN** nenhum card do tema tem resposta registrada
- **THEN** o card do tema mostra "0/" seguido do total de cards do tema, e a barra está vazia

#### Scenario: Tocar no tema
- **WHEN** o usuário toca no card do tema
- **THEN** a tela do tema abre
