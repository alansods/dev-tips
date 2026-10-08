## MODIFIED Requirements

### Requirement: Revisão de todas as trilhas
O botão "Começar revisão" do Início SHALL abrir, em tela cheia, a sessão "Revisão de hoje" com exatamente os cards para revisar hoje de todas as trilhas. A sessão SHALL usar a mesma mecânica da sessão de estudo:
- virar o card;
- responder "Já sabia" ou "Não sabia";
- abas de framework da trilha de cada card;
- resumo e "Revisar os que errei".

Cada resposta SHALL atualizar o progresso e o agendamento da trilha do card. Sair da sessão SHALL voltar para o Início.

#### Scenario: Cards de várias trilhas
- **WHEN** 2 cards da trilha CRUD e 1 de Fundamentos de programação e web estão para revisar hoje e o usuário toca em "Começar revisão"
- **THEN** a sessão "Revisão de hoje" abre com o contador "1 / 3"

#### Scenario: Resposta na trilha certa
- **WHEN** na revisão de todas as trilhas o usuário marca como "já sabia" um card de Fundamentos de programação e web
- **THEN** o card fica como "já sabia" na trilha Fundamentos de programação e web e sai da revisão de hoje

#### Scenario: Nada para revisar
- **WHEN** a revisão de todas as trilhas é aberta sem cards para revisar
- **THEN** a sessão mostra o resumo vazio, sem cards
