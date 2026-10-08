## MODIFIED Requirements

### Requirement: Navegação por abas
O app SHALL ter 3 abas inferiores, nesta ordem: **Trilhas**, **Glossário** e **Perfil**. Cada aba SHALL ter um rótulo de texto e um ícone. Ao abrir, o app SHALL mostrar a aba Trilhas. A aba ativa MUST ser indicada visualmente e para leitores de tela. O cabeçalho das abas SHALL mostrar só o título da aba, sem botões.

#### Scenario: App abre na aba Trilhas
- **WHEN** o app é aberto
- **THEN** a tela Trilhas é exibida e a aba Trilhas está marcada como selecionada

#### Scenario: Trocar de aba
- **WHEN** o usuário toca na aba Glossário
- **THEN** a tela Glossário é exibida e a aba Glossário passa a ser a selecionada

#### Scenario: Abas na ordem do design
- **WHEN** a barra de abas é exibida
- **THEN** as abas aparecem na ordem Trilhas, Glossário, Perfil, cada uma com rótulo visível

#### Scenario: Cabeçalho sem botões
- **WHEN** a aba Trilhas é exibida
- **THEN** o cabeçalho não tem o botão de tema nem o botão "Ajustes"

### Requirement: Tema claro e escuro
O app SHALL ter um modo claro e um modo escuro, com as cores do design aprovado. A aba Perfil SHALL ter a seção "Tema" com três opções, e a atual marcada:
- **Automático**, o padrão, que segue a configuração do sistema;
- **Claro**;
- **Escuro**.

A escolha SHALL ser lembrada entre aberturas do app. "Claro" e "Escuro" SHALL prevalecer sobre o sistema, e voltar para "Automático" SHALL fazer o app seguir o sistema de novo. Se a leitura da escolha salva falhar, o app SHALL seguir o sistema, sem exibir erro.

#### Scenario: Segue o sistema por padrão
- **WHEN** não há escolha salva e o sistema está em modo escuro
- **THEN** o app abre no modo escuro, e a seção "Tema" mostra "Automático" marcado

#### Scenario: Alternar manualmente
- **WHEN** o sistema está em modo claro e o usuário escolhe "Escuro" na seção "Tema"
- **THEN** o app passa para o modo escuro, e "Escuro" fica marcado

#### Scenario: Escolha lembrada
- **WHEN** o usuário escolheu "Escuro" e reabre o app com o sistema em modo claro
- **THEN** o app abre no modo escuro

#### Scenario: Voltar para o automático
- **WHEN** o usuário tinha escolhido "Escuro", o sistema está em modo claro e ele escolhe "Automático"
- **THEN** o app passa para o modo claro e continua seguindo o sistema nas próximas aberturas

#### Scenario: Preferência indisponível
- **WHEN** a leitura da preferência salva falha
- **THEN** o app segue o sistema, sem exibir erro

### Requirement: Seção Sobre
A seção "Sobre" da aba Perfil SHALL mostrar o link "Política de privacidade", o link "Termos de uso" e a versão do app. Tocar num link SHALL abrir o endereço configurado no navegador do aparelho. A versão SHALL ser a versão configurada do app (ex.: "1.0.0").

#### Scenario: Abrir a política de privacidade
- **WHEN** o usuário toca em "Política de privacidade"
- **THEN** o app abre no navegador o endereço configurado da política de privacidade

#### Scenario: Versão do app
- **WHEN** a versão configurada do app é "1.0.0"
- **THEN** a seção Sobre mostra "Versão" com "1.0.0"

## ADDED Requirements

### Requirement: Aba Perfil
A aba Perfil SHALL mostrar, nesta ordem:
1. a seção "Conta" (quando disponível na plataforma);
2. a seção "Seu estudo", com o resumo do estudo e a linha "Progresso por trilha", que abre a tela Progresso;
3. a seção "Idioma", com as opções de idioma e a atual marcada;
4. a seção "Lembretes" (quando disponível na plataforma);
5. a seção "Tema";
6. a seção "Sobre".

Telas abertas a partir da aba Perfil (Conta, Paywall, Progresso) SHALL voltar para a aba Perfil.

#### Scenario: Abrir o Perfil
- **WHEN** o usuário toca na aba Perfil
- **THEN** a aba Perfil é exibida, com a barra de abas, e mostra a seção "Idioma" com o idioma atual marcado

#### Scenario: Ordem das seções
- **WHEN** o usuário abre a aba Perfil no celular
- **THEN** as seções aparecem na ordem "Conta", "Seu estudo", "Idioma", "Lembretes", "Tema" e "Sobre"

#### Scenario: Web sem conta
- **WHEN** o app roda na web
- **THEN** a aba Perfil não mostra a seção "Conta"

#### Scenario: Abrir o progresso por trilha
- **WHEN** o usuário toca em "Progresso por trilha"
- **THEN** a tela Progresso abre, e voltar retorna para a aba Perfil

## REMOVED Requirements

### Requirement: Tela Ajustes
**Reason**: A tela Ajustes, aberta pelo botão de engrenagem do cabeçalho, foi substituída pela aba Perfil.
**Migration**: As mesmas seções (Conta, Idioma, Lembretes e Sobre) ficam na aba Perfil, descrita no requisito "Aba Perfil".
