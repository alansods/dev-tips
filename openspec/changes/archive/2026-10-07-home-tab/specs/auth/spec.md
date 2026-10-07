## MODIFIED Requirements

### Requirement: Tela de login
A tela de login SHALL mostrar o nome do app "Dev Tips", a ilustração de cards, o título "Aprenda, reforce e relembre", o texto "Conceitos de fullstack em cards curtos, com revisões na hora certa para você não esquecer.", os botões "Continuar com o Google" e "Continuar sem conta", e os links "Termos de uso" e "Política de privacidade". No primeiro uso do app, a tela SHALL aparecer uma única vez antes da aba Início; depois, só pelo botão "Entrar" da aba Perfil. "Continuar sem conta" SHALL fechar a tela sem criar conta, e o app SHALL funcionar normalmente sem conta.

#### Scenario: Primeiro uso
- **WHEN** o app abre pela primeira vez
- **THEN** a tela de login aparece antes da aba Início

#### Scenario: Continuar sem conta
- **WHEN** o usuário toca em "Continuar sem conta" e depois fecha e abre o app
- **THEN** a aba Início abre, e a tela de login não aparece de novo
