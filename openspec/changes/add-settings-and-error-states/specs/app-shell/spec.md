## MODIFIED Requirements

### Requirement: Tela Ajustes
O cabeçalho das abas SHALL ter, ao lado do botão de tema claro/escuro, um botão de engrenagem com rótulo acessível "Ajustes" ("Settings" em inglês). Tocar nele SHALL abrir a tela "Ajustes" em tela cheia, sem a barra de abas, com botão de voltar. A tela SHALL ter, nesta ordem, a seção "Idioma", com as opções de idioma e a atual marcada, a seção "Lembretes" (quando disponível na plataforma) e a seção "Sobre".

#### Scenario: Abrir Ajustes
- **WHEN** o usuário está na aba Temas e toca no botão "Ajustes"
- **THEN** a tela "Ajustes" abre sem a barra de abas e mostra a seção "Idioma" com o idioma atual marcado

#### Scenario: Voltar
- **WHEN** o usuário está em Ajustes e toca em voltar
- **THEN** volta para a aba de onde saiu

#### Scenario: Ordem das seções
- **WHEN** o usuário abre Ajustes no celular
- **THEN** as seções aparecem na ordem "Idioma", "Lembretes" e "Sobre"

## ADDED Requirements

### Requirement: Seção Sobre
A seção "Sobre" de Ajustes SHALL mostrar o link "Política de privacidade", o link "Termos de uso" e a versão do app. Tocar num link SHALL abrir o endereço configurado no navegador do aparelho. A versão SHALL ser a versão configurada do app (ex.: "1.0.0").

#### Scenario: Abrir a política de privacidade
- **WHEN** o usuário toca em "Política de privacidade"
- **THEN** o app abre no navegador o endereço configurado da política de privacidade

#### Scenario: Versão do app
- **WHEN** a versão configurada do app é "1.0.0"
- **THEN** a seção Sobre mostra "Versão" com "1.0.0"

### Requirement: Erro inesperado
Quando uma tela falhar ao ser exibida, o app SHALL mostrar a tela "Algo deu errado", com a explicação de que o progresso está salvo no aparelho, o botão "Tentar de novo" (exibe a tela de novo) e o link "Voltar ao início" (abre a aba Temas). A tela MUST NOT mostrar detalhes técnicos do erro. O progresso salvo MUST NOT ser perdido.

#### Scenario: Falha numa tela
- **WHEN** a tela do tema lança um erro ao ser exibida
- **THEN** aparece "Algo deu errado" com os botões "Tentar de novo" e "Voltar ao início", sem a mensagem técnica do erro

#### Scenario: Tentar de novo
- **WHEN** a falha era passageira e o usuário toca em "Tentar de novo"
- **THEN** a tela é exibida normalmente

#### Scenario: Voltar ao início
- **WHEN** o usuário toca em "Voltar ao início"
- **THEN** o app abre a aba Temas, com o progresso intacto

### Requirement: Página não encontrada
Uma rota que não existe no app SHALL mostrar a tela "Não encontramos esta página", com a explicação de que o conteúdo pode ter mudado de lugar e o botão "Ir para Temas".

#### Scenario: Rota inexistente
- **WHEN** o app abre a rota `/nao-existe`
- **THEN** aparece "Não encontramos esta página" com o botão "Ir para Temas"

#### Scenario: Ir para Temas
- **WHEN** o usuário toca em "Ir para Temas"
- **THEN** o app abre a aba Temas
