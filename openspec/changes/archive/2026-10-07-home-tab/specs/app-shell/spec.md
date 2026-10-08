## MODIFIED Requirements

### Requirement: Navegação por abas
O app SHALL ter 4 abas inferiores, nesta ordem: **Início**, **Trilhas**, **Glossário** e **Perfil**. Cada aba SHALL ter um rótulo de texto e um ícone. Ao abrir, o app SHALL mostrar a aba Início. A aba ativa MUST ser indicada visualmente e para leitores de tela. O cabeçalho das abas SHALL mostrar só o título da aba, sem botões.

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
- **THEN** o cabeçalho não tem o botão de tema nem o botão "Ajustes"

### Requirement: Aba Perfil
A aba Perfil SHALL mostrar, nesta ordem:
1. a seção "Conta" (quando disponível na plataforma);
2. a seção "Seu estudo", com o resumo do estudo e a linha "Progresso por trilha", que abre a tela Progresso;
3. a seção "Áreas de interesse";
4. a seção "Idioma", com as opções de idioma e a atual marcada;
5. a seção "Lembretes" (quando disponível na plataforma);
6. a seção "Tema";
7. a seção "Sobre".

Telas abertas a partir da aba Perfil (Conta, Paywall, Progresso) SHALL voltar para a aba Perfil.

#### Scenario: Abrir o Perfil
- **WHEN** o usuário toca na aba Perfil
- **THEN** a aba Perfil é exibida, com a barra de abas, e mostra a seção "Idioma" com o idioma atual marcado

#### Scenario: Ordem das seções
- **WHEN** o usuário abre a aba Perfil no celular
- **THEN** as seções aparecem na ordem "Conta", "Seu estudo", "Áreas de interesse", "Idioma", "Lembretes", "Tema" e "Sobre"

#### Scenario: Web sem conta
- **WHEN** o app roda na web
- **THEN** a aba Perfil não mostra a seção "Conta"

#### Scenario: Abrir o progresso por trilha
- **WHEN** o usuário toca em "Progresso por trilha"
- **THEN** a tela Progresso abre, e voltar retorna para a aba Perfil
