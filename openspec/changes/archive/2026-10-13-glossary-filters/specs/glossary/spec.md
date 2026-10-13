## MODIFIED Requirements

### Requirement: Aba Glossário
A aba Glossário SHALL listar todos os termos (cards `concept`) das trilhas do catálogo em ordem alfabética do nome do termo, sem diferenciar maiúsculas, minúsculas e acentos, mostrando o nome do termo, o começo da definição e a quantidade de termos exibidos. Termos com o mesmo nome SHALL seguir a ordem das trilhas. A lista SHALL ter um cabeçalho com a letra inicial (sem acento, em maiúscula) antes do primeiro termo de cada letra. Quando o catálogo tiver mais de uma trilha, cada item SHALL mostrar também o título da trilha a que pertence. Quando o card do termo tiver resposta registrada, o item SHALL mostrar o selo "já sabia" ou "revisar". Tocar num termo SHALL abrir a gaveta de definição, com os termos relacionados daquela trilha. A lista SHALL montar só os termos próximos da área visível, montando os demais conforme o usuário rola; a contagem continua mostrando o total de termos exibidos.

#### Scenario: Lista completa
- **WHEN** o catálogo tem só as trilhas CRUD e Fundamentos web e o usuário abre a aba Glossário sem busca
- **THEN** aparecem os 45 termos em ordem alfabética, começando por "API", "Cabeçalho (header)" e "Cache HTTP" e terminando em "XSS (Cross-Site Scripting)", e o texto "45 termos"

#### Scenario: Cabeçalhos de letra
- **WHEN** a lista completa é exibida
- **THEN** o cabeçalho "C" aparece antes de "Cabeçalho (header)", o cabeçalho "I" antes de "Injeção de dependência", e cada letra aparece uma única vez

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
- **THEN** a contagem mostra o total de termos, menos itens do que esse total estão montados, e rolar até o fim mostra o último termo em ordem alfabética

## ADDED Requirements

### Requirement: Filtros do glossário
Ao lado do campo de busca, a aba Glossário SHALL ter o botão "Filtros", que abre uma gaveta com os grupos, nesta ordem:
1. **Seu estudo**: "Todos", "Revisar" (cards respondidos com "não sabia"), "Já sabia" e "Não vistos" (cards sem resposta); uma opção por vez, "Todos" por padrão;
2. **Área**: as áreas que têm termos, na ordem das áreas; nenhuma ou uma;
3. **Nível**: "Júnior", "Pleno" e "Sênior", pelo nível do card do termo; nenhum ou um;
4. **Trilha**: as trilhas que têm termos, em ordem alfabética do título, cada uma com a quantidade de termos; nenhuma, uma ou várias.

A lista SHALL mostrar só os termos que atendem à busca e a todos os grupos com filtro ativo; com várias trilhas marcadas, vale qualquer uma delas. Com filtros ativos, o botão SHALL mostrar a quantidade deles ("Filtros · 2") e, abaixo da busca, SHALL aparecer um chip por filtro ativo, com o nome da opção; tocar no chip SHALL remover aquele filtro. Na gaveta, "Limpar" SHALL remover todos os filtros, e o botão "Ver N termos", com a quantidade de termos que atendem aos filtros, SHALL fechar a gaveta. A gaveta também SHALL fechar tocando na área escurecida fora dela. A contagem da aba SHALL refletir os termos exibidos, e sem resultados SHALL aparecer "Nenhum termo encontrado.".

#### Scenario: Filtrar por trilha
- **WHEN** o catálogo tem só as trilhas CRUD e Fundamentos web e o usuário marca a trilha "Fundamentos web" na gaveta
- **THEN** a lista mostra só os 21 termos de Fundamentos web, a contagem "21 termos", o botão "Filtros · 1" e o chip "Fundamentos web"

#### Scenario: Filtrar por nível
- **WHEN** o usuário escolhe o nível "Pleno"
- **THEN** a lista mostra os 17 termos de nível pleno, incluindo "CORS" e não "API"

#### Scenario: Filtrar pelo estudo
- **WHEN** o card "CORS" foi marcado como "já sabia", o card "DTO (Data Transfer Object)" como "não sabia" e o usuário escolhe "Revisar"
- **THEN** a lista mostra só "DTO (Data Transfer Object)"

#### Scenario: Não vistos
- **WHEN** o card "CORS" foi marcado como "já sabia" e o usuário escolhe "Não vistos"
- **THEN** a lista mostra 44 termos e não mostra "CORS"

#### Scenario: Filtros combinados com a busca
- **WHEN** o usuário escolhe a área "Fundamentos" e digita "cors" na busca
- **THEN** a lista mostra só "Política de mesma origem"

#### Scenario: Remover filtro pelo chip
- **WHEN** a trilha "Fundamentos web" e o nível "Pleno" estão ativos e o usuário toca no chip "Pleno"
- **THEN** o nível deixa de filtrar, o chip "Pleno" some e o botão mostra "Filtros · 1"

#### Scenario: Limpar filtros
- **WHEN** há filtros ativos e o usuário toca em "Limpar" na gaveta e depois em "Ver 45 termos"
- **THEN** a gaveta fecha, a lista mostra os 45 termos e o botão mostra "Filtros"
