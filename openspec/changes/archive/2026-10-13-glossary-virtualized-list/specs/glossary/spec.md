## MODIFIED Requirements

### Requirement: Aba Glossário
A aba Glossário SHALL listar todos os termos (cards `concept`) das trilhas do catálogo, na ordem das trilhas e do conteúdo, mostrando o nome do termo, o começo da definição e a quantidade de termos exibidos. Quando o catálogo tiver mais de uma trilha, cada item SHALL mostrar também o título da trilha a que pertence. Quando o card do termo tiver resposta registrada, o item SHALL mostrar o selo "já sabia" ou "revisar". Tocar num termo SHALL abrir a gaveta de definição, com os termos relacionados daquela trilha. A lista SHALL montar só os termos próximos da área visível, montando os demais conforme o usuário rola; a contagem continua mostrando o total de termos exibidos.

#### Scenario: Lista completa
- **WHEN** o catálogo tem só as trilhas CRUD e Fundamentos web e o usuário abre a aba Glossário sem busca
- **THEN** aparecem os 24 termos da trilha CRUD seguidos dos 21 termos de Fundamentos web, e o texto "45 termos"

#### Scenario: Trilha de cada termo
- **WHEN** a lista é exibida
- **THEN** o item "CORS" mostra "O mesmo CRUD em quatro frameworks" e o item "Cookie" mostra "Fundamentos web"

#### Scenario: Selo de status
- **WHEN** o card "CORS" foi marcado como "já sabia" e o card "DTO (Data Transfer Object)" como "não sabia"
- **THEN** na lista, CORS mostra o selo "já sabia" e DTO mostra o selo "revisar"

#### Scenario: Abrir termo pela lista
- **WHEN** o usuário toca em "Docker" na lista
- **THEN** a gaveta abre com a definição de Docker

#### Scenario: Lista longa
- **WHEN** o catálogo completo é exibido na aba Glossário sem busca
- **THEN** a contagem mostra o total de termos, menos itens do que esse total estão montados, e rolar até o fim mostra o último termo
