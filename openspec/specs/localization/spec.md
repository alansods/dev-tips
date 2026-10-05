# localization Specification

## Purpose
Permite usar o app em português do Brasil ou em inglês, na interface e no conteúdo, com a escolha salva no aparelho e textos em PT-BR quando falta tradução.
## Requirements
### Requirement: Idiomas disponíveis
O app SHALL oferecer dois idiomas: "Português (Brasil)" (`pt-BR`) e "English" (`en`). Cada opção SHALL aparecer com o próprio nome no próprio idioma, independente do idioma atual.

#### Scenario: Nomes das opções
- **WHEN** o app está em inglês e o usuário abre Ajustes
- **THEN** as opções de idioma são "Português (Brasil)" e "English"

### Requirement: Idioma inicial pelo aparelho
Sem escolha salva, o app SHALL usar inglês se o idioma preferido do aparelho for inglês (qualquer região, ex.: `en-US`, `en-GB`) e PT-BR em qualquer outro caso, incluindo quando não for possível ler o idioma do aparelho.

#### Scenario: Aparelho em inglês
- **WHEN** o idioma preferido do aparelho é `en-GB` e não há escolha salva
- **THEN** o app abre em inglês

#### Scenario: Aparelho em outro idioma
- **WHEN** o idioma preferido do aparelho é `es-ES` e não há escolha salva
- **THEN** o app abre em PT-BR

#### Scenario: Aparelho em português
- **WHEN** o idioma preferido do aparelho é `pt-PT` e não há escolha salva
- **THEN** o app abre em PT-BR

### Requirement: Trocar o idioma
Escolher um idioma em Ajustes SHALL mudar todo o app para esse idioma imediatamente, sem reiniciar e sem perder o progresso, o agendamento ou a sessão de navegação. A escolha SHALL ser salva no aparelho e prevalecer sobre o idioma do aparelho nas próximas aberturas. Se a leitura falhar ou o valor salvo for inválido, o app SHALL usar o idioma inicial pelo aparelho, sem exibir erro.

#### Scenario: Troca imediata
- **WHEN** o app está em PT-BR e o usuário escolhe "English" em Ajustes
- **THEN** o título da tela passa a "Settings" e, ao voltar, as abas mostram "Tracks", "Glossary" e "Progress"

#### Scenario: Escolha mantida ao reabrir
- **WHEN** o aparelho está em inglês, o usuário escolhe "Português (Brasil)", fecha o app e abre de novo
- **THEN** o app abre em PT-BR

#### Scenario: Progresso preservado
- **WHEN** a trilha CRUD tem 4 cards como já sabidos e o usuário troca o idioma
- **THEN** a aba Progresso continua mostrando 4 cards já sabidos

#### Scenario: Valor salvo inválido
- **WHEN** o idioma salvo no aparelho não é `pt-BR` nem `en`
- **THEN** o app usa o idioma inicial pelo aparelho e não exibe erro

### Requirement: Interface traduzida
Todo texto fixo da interface SHALL existir nos dois idiomas e ser exibido no idioma atual: títulos das abas e telas, botões, rótulos, contadores, mensagens de estado vazio, confirmações, rótulos acessíveis e textos das notificações. Os textos em inglês dos principais rótulos SHALL ser:
- abas: "Tracks", "Glossary", "Progress"; tela de ajustes: "Settings";
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

### Requirement: Conteúdo no idioma escolhido
Com o app em inglês, cada texto de trilha, deck e card SHALL ser exibido em inglês quando houver tradução para ele, e em PT-BR quando não houver, campo a campo. Com o app em PT-BR, o conteúdo SHALL ser o original. Código de snippets, ids, métodos HTTP, caminhos, status, nomes de variantes e linguagens MUST NOT mudar com o idioma.

#### Scenario: Card traduzido
- **WHEN** o app está em inglês e o card concept "CORS" tem `definition` traduzida
- **THEN** o card mostra a definição em inglês

#### Scenario: Tradução parcial
- **WHEN** o app está em inglês e um card step tem só `title` traduzido
- **THEN** o card mostra o título em inglês e o "o que é" e o "por que importa" em PT-BR

#### Scenario: Trilha sem tradução
- **WHEN** o app está em inglês e a trilha não tem arquivo de tradução
- **THEN** a trilha aparece todo em PT-BR, com a interface em inglês, sem erro

#### Scenario: Código não muda
- **WHEN** o usuário troca o idioma com um card step aberto
- **THEN** o código do snippet é o mesmo nos dois idiomas

### Requirement: Busca do glossário no idioma exibido
A busca do glossário SHALL comparar o texto digitado com o termo, os sinônimos e a definição como são exibidos no idioma atual.

#### Scenario: Buscar em inglês
- **WHEN** o app está em inglês, a definição de "CORS" está traduzida e contém "browser", e o usuário busca "browser"
- **THEN** "CORS" aparece no resultado

