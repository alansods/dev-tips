## MODIFIED Requirements

### Requirement: Gaveta de definição
Tocar num chip de termo SHALL abrir uma gaveta sobre a tela com o nome do termo, a definição e, quando o termo tiver `relatedTerms`, os chips desses termos. Tocar num chip dentro da gaveta SHALL trocar o conteúdo para o novo termo. A gaveta SHALL fechar pelo botão "Fechar" ou tocando na área escurecida fora dela. Abrir e fechar a gaveta MUST NOT alterar a sessão de estudo: o mesmo card continua visível, no mesmo lado.

#### Scenario: Abrir a definição
- **WHEN** o usuário toca no chip "CORS" no verso do Passo 13
- **THEN** a gaveta abre com "CORS" e a definição de CORS

#### Scenario: Navegar entre termos na gaveta
- **WHEN** a gaveta mostra "CORS" e o usuário toca no chip "Middleware" dentro dela
- **THEN** a gaveta passa a mostrar "Middleware" e sua definição

#### Scenario: Fechar sem perder a sessão
- **WHEN** a gaveta está aberta sobre o verso do Passo 13 e o usuário toca em "Fechar"
- **THEN** a gaveta some e o verso do Passo 13 continua visível, com os botões "Não sabia" e "Já sabia"

### Requirement: Aba Glossário
A aba Glossário SHALL listar todos os termos (cards `concept`) dos temas do catálogo, na ordem dos temas e do conteúdo, mostrando o nome do termo, o começo da definição e a quantidade de termos exibidos. Quando o catálogo tiver mais de um tema, cada item SHALL mostrar também o título do tema a que pertence. Quando o card do termo tiver resposta registrada, o item SHALL mostrar o selo "já sabia" ou "revisar". Tocar num termo SHALL abrir a gaveta de definição, com os termos relacionados daquele tema.

#### Scenario: Lista completa
- **WHEN** o usuário abre a aba Glossário sem busca
- **THEN** aparecem os 24 termos do tema CRUD seguidos dos 21 termos de Fundamentos web, e o texto "45 termos"

#### Scenario: Tema de cada termo
- **WHEN** a lista é exibida
- **THEN** o item "CORS" mostra "O mesmo CRUD em quatro frameworks" e o item "Cookie" mostra "Fundamentos web"

#### Scenario: Selo de status
- **WHEN** o card "CORS" foi marcado como "já sabia" e o card "DTO (Data Transfer Object)" como "não sabia"
- **THEN** na lista, CORS mostra o selo "já sabia" e DTO mostra o selo "revisar"

#### Scenario: Abrir termo pela lista
- **WHEN** o usuário toca em "Docker" na lista
- **THEN** a gaveta abre com a definição de Docker
