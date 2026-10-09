## MODIFIED Requirements

### Requirement: Tela de login
A tela de login SHALL mostrar o nome do app "Dev Tips", a ilustração de cards, o título "Aprenda, reforce e relembre", o texto "Conceitos de fullstack em cards curtos, com revisões na hora certa para você não esquecer.", o botão "Entrar ou criar conta com o Google" com a legenda "Primeira vez? Sua conta é criada na hora, sem formulário." logo abaixo, o botão "Continuar sem conta" e os links "Termos de uso" e "Política de privacidade". No primeiro uso do app, a tela SHALL aparecer uma única vez antes da aba Início; depois, só pelo botão "Entrar ou criar conta" da aba Perfil. O mesmo botão do Google SHALL servir para quem já tem conta e para quem entra pela primeira vez: no primeiro acesso, a conta é criada sem nenhum formulário. "Continuar sem conta" SHALL fechar a tela sem criar conta, e o app SHALL funcionar normalmente sem conta.

#### Scenario: Primeiro uso
- **WHEN** o app abre pela primeira vez
- **THEN** a tela de login aparece antes da aba Início

#### Scenario: Cadastro explicado
- **WHEN** a tela de login abre
- **THEN** ela mostra o botão "Entrar ou criar conta com o Google" e, logo abaixo, "Primeira vez? Sua conta é criada na hora, sem formulário."

#### Scenario: Continuar sem conta
- **WHEN** o usuário toca em "Continuar sem conta" e depois fecha e abre o app
- **THEN** a aba Início abre, e a tela de login não aparece de novo

### Requirement: Entrar pelo app
Tocar em "Entrar ou criar conta com o Google" SHALL abrir o login do Google e, com sucesso, enviar o ID token à API, guardar a sessão e voltar para a tela de onde o login foi aberto (a aba Trilhas no primeiro uso). Durante o envio, o botão SHALL mostrar "Entrando…" com um indicador, e "Continuar sem conta" SHALL ficar desabilitado. Se o usuário cancelar o login do Google, a tela SHALL voltar ao estado normal sem mensagem. Sem conexão, SHALL mostrar "Sem conexão. Tente de novo quando estiver online."; com erro da API, "Não foi possível entrar agora. Tente de novo."

#### Scenario: Login com sucesso
- **WHEN** o usuário entra com o Google a partir da aba Perfil
- **THEN** o app volta para a aba Perfil, e a seção Conta mostra o nome e o e-mail

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

### Requirement: Conta no app
A seção "Conta" da aba Perfil SHALL mostrar:
- sem sessão: o convite "Salve seu progresso na nuvem" com o botão "Entrar ou criar conta", que abre a tela de login;
- com sessão: uma linha com foto, nome e e-mail, que abre a tela "Conta".

A tela "Conta" SHALL mostrar, nesta ordem:
- foto, nome, e-mail e "Conectado com Google";
- o bloco "Plano";
- o botão "Sair";
- separado no final, "Apagar conta".

O bloco "Plano" SHALL mostrar:
- **no plano grátis**: "Plano grátis" e o botão "Conhecer o Pro", que abre o paywall;
- **para assinante**:
  - o selo "PRO", "Pro mensal" e "Ativo";
  - em destaque, o número de perguntas restantes no ciclo, seguido de "perguntas restantes" (ou "pergunta restante" quando resta 1);
  - uma barra de progresso do uso;
  - o uso "<usadas> / 200 usadas" e "Zera em <data>", com a data do fim do ciclo;
  - o quadro "Como a cota funciona", com "200 perguntas por ciclo da assinatura.", "Só conta pergunta respondida." e "Na renovação, o contador volta a zero.";
  - "Renova em <data>" (ou "Termina em <data>" quando a renovação automática está desligada);
  - os botões "Gerenciar assinatura" (abre o gerenciamento de assinaturas do Google Play) e "Restaurar compras";
- **para admin**: o selo "PRO", "Pro (admin)" e "Perguntas sem limite", sem "Gerenciar assinatura".

Com 80% ou mais da cota usada, a barra e o número de restantes SHALL usar a cor de alerta do tema.

O bloco "Plano" SHALL aparecer no Android e no iOS. No iOS, onde o Pro ainda não é vendido, o assinante MUST NOT ver os botões "Gerenciar assinatura" e "Restaurar compras".

"Sair" SHALL pedir confirmação ("Sair da conta?", com "Cancelar" e "Sair") e, confirmado, encerrar a sessão na API e no aparelho. "Apagar conta" SHALL pedir confirmação explicando:
- que os dados na nuvem serão apagados para sempre;
- que o progresso no aparelho continua;
- que uma assinatura ativa precisa ser cancelada no Google Play.

A confirmação de "Apagar conta" SHALL ter os botões "Cancelar" e "Apagar minha conta". Nos dois casos (sair e apagar), o progresso no aparelho MUST NOT ser apagado. Sem conexão, sair SHALL encerrar a sessão no aparelho mesmo assim; apagar a conta SHALL mostrar o erro de conexão e manter a conta.

#### Scenario: Convite para entrar
- **WHEN** não há sessão e o usuário abre a aba Perfil
- **THEN** a seção Conta mostra "Salve seu progresso na nuvem" e o botão "Entrar ou criar conta"

#### Scenario: Sair
- **WHEN** o usuário confirma "Sair"
- **THEN** a seção Conta volta a mostrar o convite para entrar, e o progresso no aparelho continua igual

#### Scenario: Apagar conta
- **WHEN** o usuário confirma "Apagar minha conta"
- **THEN** a conta é apagada na API, a sessão é encerrada e o progresso no aparelho continua igual

#### Scenario: Cancelar a exclusão
- **WHEN** o usuário toca em "Cancelar" na confirmação de apagar
- **THEN** nada é apagado e a tela Conta continua

#### Scenario: Plano grátis na Conta
- **WHEN** um usuário sem assinatura abre a tela Conta
- **THEN** o bloco Plano mostra "Plano grátis" e o botão "Conhecer o Pro"

#### Scenario: Assinante na Conta
- **WHEN** um assinante com 30 perguntas usadas e renovação em 12/11/2026 abre a tela Conta
- **THEN** o bloco Plano mostra "Pro mensal", "Ativo", "170", "perguntas restantes", "30 / 200 usadas", "Zera em 12/11/2026", "Como a cota funciona", "Renova em 12/11/2026", "Gerenciar assinatura" e "Restaurar compras"

#### Scenario: Uma pergunta restante na Conta
- **WHEN** um assinante com 199 perguntas usadas abre a tela Conta
- **THEN** o bloco Plano mostra "1" e "pergunta restante"

#### Scenario: Renovação desligada
- **WHEN** um assinante que cancelou na loja, com acesso até 12/11/2026, abre a tela Conta
- **THEN** o bloco Plano mostra "Termina em 12/11/2026"

#### Scenario: Admin na Conta
- **WHEN** um admin abre a tela Conta
- **THEN** o bloco Plano mostra "Pro (admin)" e "Perguntas sem limite", sem o botão "Gerenciar assinatura"

#### Scenario: Conta no iOS
- **WHEN** um assinante abre a tela Conta no iPhone
- **THEN** o bloco Plano mostra "Pro mensal" e "30 / 200 usadas", sem os botões "Gerenciar assinatura" e "Restaurar compras"
