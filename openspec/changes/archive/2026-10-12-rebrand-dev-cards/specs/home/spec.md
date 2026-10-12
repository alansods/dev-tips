## MODIFIED Requirements

### Requirement: Primeiro acesso
Sem nenhuma resposta registrada, o Início SHALL mostrar:
- o título "Bem-vindo ao Dev Cards" e uma frase sobre como o app funciona;
- a pergunta "O que você quer estudar?", com uma opção por área do catálogo, exceto Situações-problema. As opções podem ser marcadas e desmarcadas, e a escolha fica salva como áreas de interesse;
- "Comece por aqui", com a primeira trilha sem pré-requisitos da ordem sugerida da primeira área de interesse (ou de Fundamentos, sem interesse) e o botão "Começar a trilha", que abre a tela da trilha;
- quando houver, a trilha seguinte a ela ("Depois:"), a primeira que tem a trilha de "Comece por aqui" como pré-requisito.

Em inglês, o título SHALL ser "Welcome to Dev Cards".

#### Scenario: Boas-vindas
- **WHEN** é o primeiro acesso
- **THEN** o Início mostra "Bem-vindo ao Dev Cards"

#### Scenario: Sem interesse escolhido
- **WHEN** é o primeiro acesso e nenhuma área foi escolhida
- **THEN** "Comece por aqui" mostra "Fundamentos de programação"

#### Scenario: Interesse em Backend
- **WHEN** é o primeiro acesso e o usuário marca "Backend"
- **THEN** a opção "Backend" fica marcada e "Comece por aqui" mostra a primeira trilha sem pré-requisitos da ordem sugerida de Backend

#### Scenario: Sem opção de simulações
- **WHEN** é o primeiro acesso
- **THEN** a pergunta "O que você quer estudar?" não tem a opção "Situações-problema"
