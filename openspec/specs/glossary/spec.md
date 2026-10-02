# glossary Specification

## Purpose

Liga os cards aos termos do glossário e torna o glossário consultável: chips de termos relacionados, gaveta com a definição, aba Glossário com busca.

## Requirements

### Requirement: Termos relacionados no verso
O verso de todo card que tenha `relatedTerms` SHALL mostrar a seção "Termos relacionados", com um chip por termo, na ordem do conteúdo. Cada chip mostra o nome do termo e é um botão. Cards sem `relatedTerms` MUST NOT mostrar a seção. A frente dos cards MUST NOT mostrar os termos relacionados.

#### Scenario: Chips no verso do passo
- **WHEN** o verso do Passo 13 (Liberar o frontend) é exibido
- **THEN** aparecem os chips "CORS" e "Middleware", nessa ordem

#### Scenario: Frente sem chips
- **WHEN** a frente do Passo 13 é exibida
- **THEN** nenhum chip de termo relacionado aparece

#### Scenario: Card sem termos relacionados
- **WHEN** o verso de um card de comparação (sem `relatedTerms`) é exibido
- **THEN** a seção "Termos relacionados" não aparece

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
- **THEN** a gaveta some e o verso do Passo 13 continua visível, com os botões "Não sei" e "Sei"

### Requirement: Aba Glossário
A aba Glossário SHALL listar todos os termos (cards `concept`) dos temas do catálogo, na ordem do conteúdo, mostrando o nome do termo, o começo da definição e a quantidade de termos exibidos. Quando o card do termo tiver resposta registrada, o item SHALL mostrar o selo "sei" ou "revisar". Tocar num termo SHALL abrir a gaveta de definição.

#### Scenario: Lista completa
- **WHEN** o usuário abre a aba Glossário sem busca
- **THEN** aparecem os 24 termos do tema CRUD e o texto "24 termos"

#### Scenario: Selo de status
- **WHEN** o card "CORS" foi marcado como "sei" e o card "DTO (Data Transfer Object)" como "não sei"
- **THEN** na lista, CORS mostra o selo "sei" e DTO mostra o selo "revisar"

#### Scenario: Abrir termo pela lista
- **WHEN** o usuário toca em "Docker" na lista
- **THEN** a gaveta abre com a definição de Docker

### Requirement: Busca no glossário
A aba Glossário SHALL ter um campo de busca, com rótulo acessível "Buscar termo", que filtra a lista por nome do termo, definição ou outros nomes (`aliases`), sem diferenciar maiúsculas, minúsculas e acentos. Com a busca vazia, todos os termos aparecem. Sem resultados, SHALL aparecer "Nenhum termo encontrado." A contagem SHALL refletir os termos exibidos.

#### Scenario: Buscar pelo nome
- **WHEN** o usuário digita "cors"
- **THEN** a lista mostra CORS e a contagem "1 termo"

#### Scenario: Buscar sem acento
- **WHEN** o usuário digita "injecao"
- **THEN** a lista mostra "Injeção de dependência"

#### Scenario: Buscar pela definição
- **WHEN** o usuário digita "caixinhas"
- **THEN** a lista mostra "Docker", cuja definição contém essa palavra

#### Scenario: Sem resultados
- **WHEN** o usuário digita "kubernetes"
- **THEN** aparece "Nenhum termo encontrado." e a contagem "0 termos"
