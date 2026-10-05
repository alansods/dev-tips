## MODIFIED Requirements

### Requirement: Tela de login
A tela de login SHALL mostrar o nome do app "Dev Tips", a ilustração de cards, o título "Aprenda, reforce e relembre", o texto "Conceitos de fullstack em cards curtos, com revisões na hora certa para você não esquecer.", os botões "Continuar com o Google" e "Continuar sem conta", e os links "Termos de uso" e "Política de privacidade". No primeiro uso do app, a tela SHALL aparecer uma única vez antes da aba Trilhas; depois, só pelo botão "Entrar" de Ajustes. "Continuar sem conta" SHALL fechar a tela sem criar conta, e o app SHALL funcionar normalmente sem conta.

#### Scenario: Primeiro uso
- **WHEN** o app abre pela primeira vez
- **THEN** a tela de login aparece antes da aba Trilhas

#### Scenario: Continuar sem conta
- **WHEN** o usuário toca em "Continuar sem conta" e depois fecha e abre o app
- **THEN** a aba Trilhas abre, e a tela de login não aparece de novo

### Requirement: Entrar pelo app
Tocar em "Continuar com o Google" SHALL abrir o login do Google e, com sucesso, enviar o ID token à API, guardar a sessão e voltar para a tela de onde o login foi aberto (a aba Trilhas no primeiro uso). Durante o envio, o botão SHALL mostrar "Entrando…" com um indicador, e "Continuar sem conta" SHALL ficar desabilitado. Se o usuário cancelar o login do Google, a tela SHALL voltar ao estado normal sem mensagem. Sem conexão, SHALL mostrar "Sem conexão. Tente de novo quando estiver online."; com erro da API, "Não foi possível entrar agora. Tente de novo."

#### Scenario: Login com sucesso
- **WHEN** o usuário entra com o Google a partir de Ajustes
- **THEN** o app volta para Ajustes, e a seção Conta mostra o nome e o e-mail

#### Scenario: Carregando
- **WHEN** o ID token foi obtido e a API ainda não respondeu
- **THEN** o botão mostra "Entrando…" e "Continuar sem conta" está desabilitado

#### Scenario: Cancelado
- **WHEN** o usuário cancela o login do Google
- **THEN** a tela volta ao normal, sem mensagem de erro

#### Scenario: Sem conexão
- **WHEN** não há conexão ao tentar entrar
- **THEN** aparece "Sem conexão. Tente de novo quando estiver online."

#### Scenario: Erro da API
- **WHEN** a API responde com erro `500`
- **THEN** aparece "Não foi possível entrar agora. Tente de novo."
