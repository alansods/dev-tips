## MODIFIED Requirements

### Requirement: Navegação por abas
O app SHALL ter 4 abas inferiores, nesta ordem: **Início**, **Trilhas**, **Glossário** e **Perfil**. Cada aba SHALL ter um rótulo de texto e um ícone. Ao abrir, o app SHALL mostrar a aba Início. A aba ativa MUST ser indicada visualmente e para leitores de tela. As abas MUST NOT ter cabeçalho com o título da tela, porque o nome da aba já aparece na barra de abas. O conteúdo de cada aba SHALL começar logo abaixo da barra de status do aparelho, sem ficar escondido por ela.

#### Scenario: App abre na aba Trilhas
- **WHEN** o app é aberto
- **THEN** a aba Início é exibida e está marcada como selecionada; tocar em Trilhas mostra a tela Trilhas

#### Scenario: Trocar de aba
- **WHEN** o usuário toca na aba Glossário
- **THEN** a tela Glossário é exibida e a aba Glossário passa a ser a selecionada

#### Scenario: Abas na ordem do design
- **WHEN** a barra de abas é exibida
- **THEN** as abas aparecem na ordem Início, Trilhas, Glossário, Perfil, cada uma com rótulo visível

#### Scenario: Cabeçalho sem botões
- **WHEN** a aba Trilhas é exibida
- **THEN** não há cabeçalho com o título "Trilhas" nem botões de tema ou "Ajustes"; o título só aparece na barra de abas
