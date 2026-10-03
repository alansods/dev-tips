## MODIFIED Requirements

### Requirement: Tela Ajustes
O cabeçalho das abas SHALL ter, ao lado do botão de tema claro/escuro, um botão de engrenagem com rótulo acessível "Ajustes" ("Settings" em inglês). Tocar nele SHALL abrir a tela "Ajustes" em tela cheia, sem a barra de abas, com botão de voltar. A tela SHALL ter, nesta ordem, a seção "Conta" (quando disponível na plataforma), a seção "Idioma", com as opções de idioma e a atual marcada, a seção "Lembretes" (quando disponível na plataforma) e a seção "Sobre".

#### Scenario: Abrir Ajustes
- **WHEN** o usuário está na aba Temas e toca no botão "Ajustes"
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
