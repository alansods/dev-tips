# auth Specification

## Purpose
Permite entrar no Dev Tips com Google, de forma opcional, manter a sessão no aparelho e sair ou apagar a conta, tanto na API quanto no app.
## Requirements
### Requirement: Login com Google na API
`POST /auth/google` com `{ "idToken" }` SHALL validar o ID token do Google: assinatura pelas chaves públicas do Google, emissor do Google, público igual a um dos client IDs configurados e token não expirado. Com o token válido, a API SHALL criar o usuário no primeiro acesso (identificado pelo provedor e pelo `sub` do token) ou reutilizar o existente, e responder `200` com `{ "accessToken", "refreshToken", "user": { "id", "name", "email", "photoUrl" } }`. Com o token inválido, SHALL responder `401` com o código `invalid_token`.

#### Scenario: Primeiro acesso
- **WHEN** um ID token válido de um usuário novo é enviado
- **THEN** a resposta é `200` com a sessão e os dados do usuário, e o usuário passa a existir

#### Scenario: Acesso seguinte
- **WHEN** o mesmo usuário entra de novo com outro ID token válido
- **THEN** a resposta traz o mesmo `user.id` e nenhum usuário novo é criado

#### Scenario: Token de outro app
- **WHEN** o ID token tem um público que não está entre os client IDs configurados
- **THEN** a resposta é `401` com `error.code` igual a `invalid_token`

#### Scenario: Token expirado
- **WHEN** o ID token está expirado
- **THEN** a resposta é `401` com `error.code` igual a `invalid_token`

### Requirement: Rotas protegidas
Rotas que exigem conta SHALL aceitar só requisições com `Authorization: Bearer <accessToken>` válido. O token de acesso SHALL expirar em 15 minutos. Sem token, com token inválido ou expirado, a resposta SHALL ser `401` com o código `unauthorized`.

#### Scenario: Sem token
- **WHEN** o cliente chama `GET /me` sem o cabeçalho `Authorization`
- **THEN** a resposta é `401` com `error.code` igual a `unauthorized`

#### Scenario: Token expirado
- **WHEN** o cliente chama `GET /me` com um token de acesso emitido há 16 minutos
- **THEN** a resposta é `401` com `error.code` igual a `unauthorized`

### Requirement: Renovação da sessão
`POST /auth/refresh` com `{ "refreshToken" }` SHALL trocar um token de renovação válido por um novo par de tokens. O token de renovação SHALL valer 30 dias e ser de uso único: depois de usado, ele MUST NOT funcionar de novo. Se um token já usado for reapresentado, a API SHALL encerrar todas as sessões daquele usuário (sinal de token roubado) e responder `401`.

#### Scenario: Renovar
- **WHEN** o cliente envia um token de renovação válido
- **THEN** a resposta é `200` com um novo `accessToken` e um novo `refreshToken`

#### Scenario: Reuso de token
- **WHEN** o cliente reenvia um token de renovação que já foi trocado
- **THEN** a resposta é `401`, e os outros tokens de renovação daquele usuário também deixam de funcionar

#### Scenario: Token de renovação vencido
- **WHEN** o token de renovação foi emitido há 31 dias
- **THEN** a resposta é `401`

### Requirement: Dados e exclusão da conta na API
`GET /me` SHALL responder com os dados do usuário da sessão. `POST /auth/logout` com `{ "refreshToken" }` SHALL invalidar esse token e responder `204`. `DELETE /me` SHALL apagar o usuário e todos os dados ligados a ele, invalidar todas as sessões e responder `204`.

#### Scenario: Dados do usuário
- **WHEN** o cliente chama `GET /me` com uma sessão válida
- **THEN** a resposta é `200` com `id`, `name`, `email` e `photoUrl`

#### Scenario: Sair
- **WHEN** o cliente chama `POST /auth/logout` e depois tenta renovar com o mesmo token
- **THEN** o logout responde `204` e a renovação responde `401`

#### Scenario: Apagar conta
- **WHEN** o cliente chama `DELETE /me` e depois entra de novo com o mesmo Google
- **THEN** a exclusão responde `204`, e o novo login cria um usuário novo, sem dados anteriores

### Requirement: Tela de login
A tela de login SHALL mostrar o nome do app "Dev Tips", a ilustração de cards, o título "Aprenda, reforce e relembre", o texto "Conceitos de fullstack em cards curtos, com revisões na hora certa para você não esquecer.", os botões "Continuar com o Google" e "Continuar sem conta", e os links "Termos de uso" e "Política de privacidade". No primeiro uso do app, a tela SHALL aparecer uma única vez antes da aba Início; depois, só pelo botão "Entrar" da aba Perfil. "Continuar sem conta" SHALL fechar a tela sem criar conta, e o app SHALL funcionar normalmente sem conta.

#### Scenario: Primeiro uso
- **WHEN** o app abre pela primeira vez
- **THEN** a tela de login aparece antes da aba Início

#### Scenario: Continuar sem conta
- **WHEN** o usuário toca em "Continuar sem conta" e depois fecha e abre o app
- **THEN** a aba Início abre, e a tela de login não aparece de novo

### Requirement: Entrar pelo app
Tocar em "Continuar com o Google" SHALL abrir o login do Google e, com sucesso, enviar o ID token à API, guardar a sessão e voltar para a tela de onde o login foi aberto (a aba Trilhas no primeiro uso). Durante o envio, o botão SHALL mostrar "Entrando…" com um indicador, e "Continuar sem conta" SHALL ficar desabilitado. Se o usuário cancelar o login do Google, a tela SHALL voltar ao estado normal sem mensagem. Sem conexão, SHALL mostrar "Sem conexão. Tente de novo quando estiver online."; com erro da API, "Não foi possível entrar agora. Tente de novo."

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
- sem sessão: o convite "Salve seu progresso na nuvem" com o botão "Entrar", que abre a tela de login;
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
  - o uso "<usadas> / 100 usadas" e "Zera em <data>", com a data do fim do ciclo;
  - o quadro "Como a cota funciona", com "100 perguntas por ciclo da assinatura.", "Só conta pergunta respondida." e "Na renovação, o contador volta a zero.";
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
- **THEN** a seção Conta mostra "Salve seu progresso na nuvem" e o botão "Entrar"

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
- **THEN** o bloco Plano mostra "Pro mensal", "Ativo", "70", "perguntas restantes", "30 / 100 usadas", "Zera em 12/11/2026", "Como a cota funciona", "Renova em 12/11/2026", "Gerenciar assinatura" e "Restaurar compras"

#### Scenario: Uma pergunta restante na Conta
- **WHEN** um assinante com 99 perguntas usadas abre a tela Conta
- **THEN** o bloco Plano mostra "1" e "pergunta restante"

#### Scenario: Renovação desligada
- **WHEN** um assinante que cancelou na loja, com acesso até 12/11/2026, abre a tela Conta
- **THEN** o bloco Plano mostra "Termina em 12/11/2026"

#### Scenario: Admin na Conta
- **WHEN** um admin abre a tela Conta
- **THEN** o bloco Plano mostra "Pro (admin)" e "Perguntas sem limite", sem o botão "Gerenciar assinatura"

#### Scenario: Conta no iOS
- **WHEN** um assinante abre a tela Conta no iPhone
- **THEN** o bloco Plano mostra "Pro mensal" e "30 / 100 usadas", sem os botões "Gerenciar assinatura" e "Restaurar compras"

### Requirement: Sessão no aparelho
A sessão SHALL ser guardada no armazenamento seguro do aparelho e restaurada ao abrir o app. Quando o token de acesso expirar, o app SHALL renová-lo automaticamente e repetir a requisição. Se a renovação falhar com `401`, o app SHALL encerrar a sessão no aparelho sem mostrar erro, mantendo o progresso local.

#### Scenario: Sessão mantida ao reabrir
- **WHEN** o usuário entrou, fechou o app e abriu de novo
- **THEN** a seção Conta mostra o usuário conectado

#### Scenario: Renovação automática
- **WHEN** o token de acesso expirou e o app chama a API
- **THEN** o app renova a sessão e a chamada original funciona

#### Scenario: Sessão encerrada no servidor
- **WHEN** a renovação responde `401`
- **THEN** o app passa a mostrar o convite para entrar, sem mensagem de erro, e o progresso local continua

