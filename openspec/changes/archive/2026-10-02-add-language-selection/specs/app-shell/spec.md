## ADDED Requirements

### Requirement: Tela Ajustes
O cabeçalho das abas SHALL ter, ao lado do botão de tema claro/escuro, um botão de engrenagem com rótulo acessível "Ajustes" ("Settings" em inglês). Tocar nele SHALL abrir a tela "Ajustes" em tela cheia, sem a barra de abas, com botão de voltar. A tela SHALL ter a seção "Idioma", com as opções de idioma e a atual marcada.

#### Scenario: Abrir Ajustes
- **WHEN** o usuário está na aba Temas e toca no botão "Ajustes"
- **THEN** a tela "Ajustes" abre sem a barra de abas e mostra a seção "Idioma" com o idioma atual marcado

#### Scenario: Voltar
- **WHEN** o usuário está em Ajustes e toca em voltar
- **THEN** volta para a aba de onde saiu
