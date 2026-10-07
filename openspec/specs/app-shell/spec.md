# app-shell Specification

## Purpose

Define a estrutura comum do app (navegação por abas, tema visual claro/escuro, fontes e acesso ao catálogo de trilhas) sobre a qual as telas de estudo são construídas.
## Requirements
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

### Requirement: Contraste mínimo
Nos dois modos, o texto principal e o texto secundário MUST ter contraste de pelo menos 4,5:1 com o fundo e com as superfícies onde aparecem. O texto sobre a cor de destaque também MUST ter contraste de pelo menos 4,5:1.

#### Scenario: Contraste dos tokens
- **WHEN** o contraste dos pares de cor de texto e fundo de cada modo é calculado
- **THEN** todos os pares ficam em 4,5:1 ou mais

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

### Requirement: Seção Sobre
A seção "Sobre" da aba Perfil SHALL mostrar o link "Política de privacidade", o link "Termos de uso" e a versão do app. Tocar num link SHALL abrir o endereço configurado no navegador do aparelho. A versão SHALL ser a versão configurada do app (ex.: "1.0.0").

#### Scenario: Abrir a política de privacidade
- **WHEN** o usuário toca em "Política de privacidade"
- **THEN** o app abre no navegador o endereço configurado da política de privacidade

#### Scenario: Versão do app
- **WHEN** a versão configurada do app é "1.0.0"
- **THEN** a seção Sobre mostra "Versão" com "1.0.0"

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

