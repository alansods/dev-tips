## MODIFIED Requirements

### Requirement: Aba Glossário
A aba Glossário SHALL listar todos os termos (cards `concept`) das trilhas do catálogo, na ordem das trilhas e do conteúdo, mostrando o nome do termo, o começo da definição e a quantidade de termos exibidos. Quando o catálogo tiver mais de uma trilha, cada item SHALL mostrar também o título da trilha a que pertence. Quando o card do termo tiver resposta registrada, o item SHALL mostrar o selo "já sabia" ou "revisar". Tocar num termo SHALL abrir a gaveta de definição, com os termos relacionados daquela trilha.

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

### Requirement: Busca no glossário
A aba Glossário SHALL ter um campo de busca, com rótulo acessível "Buscar termo", que filtra a lista por nome do termo, definição ou outros nomes (`aliases`), sem diferenciar maiúsculas, minúsculas e acentos. Com a busca vazia, todos os termos aparecem. Sem resultados, SHALL aparecer "Nenhum termo encontrado." A contagem SHALL refletir os termos exibidos.

#### Scenario: Buscar pelo nome
- **WHEN** o catálogo tem só as trilhas CRUD e Fundamentos web e o usuário digita "cors"
- **THEN** a lista mostra CORS e "Política de mesma origem" (cuja definição cita CORS), e a contagem "2 termos"

#### Scenario: Buscar sem acento
- **WHEN** o usuário digita "injecao"
- **THEN** a lista mostra "Injeção de dependência"

#### Scenario: Buscar pela definição
- **WHEN** o usuário digita "caixinhas"
- **THEN** a lista mostra "Docker", cuja definição contém essa palavra

#### Scenario: Sem resultados
- **WHEN** o usuário digita "kubernetes"
- **THEN** aparece "Nenhum termo encontrado." e a contagem "0 termos"
