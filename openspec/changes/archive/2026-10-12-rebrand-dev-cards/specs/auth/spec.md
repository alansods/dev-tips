## MODIFIED Requirements

### Requirement: Tela de login
A tela de login SHALL mostrar o nome do app "Dev Cards", a ilustração de cards, o título "Aprenda, reforce e relembre", o texto "Conceitos de fullstack em cards curtos, com revisões na hora certa para você não esquecer.", o botão "Entrar ou criar conta com o Google" com a legenda "Primeira vez? Sua conta é criada na hora, sem formulário." logo abaixo, o botão "Continuar sem conta" e os links "Termos de uso" e "Política de privacidade". No primeiro uso do app, a tela SHALL aparecer uma única vez antes da aba Início; depois, só pelo botão "Entrar ou criar conta" da aba Perfil. O mesmo botão do Google SHALL servir para quem já tem conta e para quem entra pela primeira vez: no primeiro acesso, a conta é criada sem nenhum formulário. "Continuar sem conta" SHALL fechar a tela sem criar conta, e o app SHALL funcionar normalmente sem conta.

#### Scenario: Primeiro uso
- **WHEN** o app abre pela primeira vez
- **THEN** a tela de login aparece antes da aba Início

#### Scenario: Nome do app no login
- **WHEN** a tela de login abre
- **THEN** ela mostra o nome "Dev Cards"

#### Scenario: Cadastro explicado
- **WHEN** a tela de login abre
- **THEN** ela mostra o botão "Entrar ou criar conta com o Google" e, logo abaixo, "Primeira vez? Sua conta é criada na hora, sem formulário."

#### Scenario: Continuar sem conta
- **WHEN** o usuário toca em "Continuar sem conta" e depois fecha e abre o app
- **THEN** a aba Início abre, e a tela de login não aparece de novo
