## MODIFIED Requirements

### Requirement: Conta no app
A seção "Conta" da aba Perfil SHALL mostrar:
- sem sessão: o convite "Salve seu progresso na nuvem" com o botão "Entrar ou criar conta", que abre a tela de login;
- com sessão: uma linha com foto, nome e e-mail, que abre a tela "Conta".

A tela "Conta" SHALL mostrar só informações e ações da conta, nesta ordem:
- foto, nome, e-mail e "Conectado com Google";
- a sincronização;
- o botão "Sair", na largura toda da tela, com texto e contorno na cor de ação destrutiva do tema e sem preenchimento;
- no fim da tela, "Apagar conta" como link de texto na cor de ação destrutiva, sem fundo nem contorno, seguido de "Apaga sua conta e todo o seu progresso, na nuvem e neste aparelho.".

A tela "Conta" MUST NOT mostrar o plano nem o uso da cota: isso fica na tela "Plano". A cor de ação destrutiva SHALL ser diferente da cor de alerta.

"Sair" SHALL pedir confirmação ("Sair da conta?", com "Cancelar" e "Sair") e, confirmado, encerrar a sessão na API e no aparelho. Ao sair, o progresso no aparelho MUST NOT ser apagado. Sem conexão, sair SHALL encerrar a sessão no aparelho mesmo assim.

"Apagar conta" SHALL pedir confirmação explicando:
- que a conta e os dados na nuvem serão apagados para sempre;
- que o progresso neste aparelho também será apagado;
- que uma assinatura ativa precisa ser cancelada no Google Play.

A confirmação de "Apagar conta" SHALL ter os botões "Cancelar" e "Apagar minha conta", este preenchido com a cor de ação destrutiva. Confirmado, o app SHALL apagar a conta na API e, só depois de a API confirmar, apagar no aparelho todos os dados do usuário: progresso dos cards, revisões, sequência de dias, "continue de onde parou", aba de framework preferida, mudanças ainda não sincronizadas, sessão, plano guardado, interesses e lembretes (incluindo as notificações já agendadas). Tema e idioma MUST ser mantidos. Depois disso, o app SHALL voltar ao estado de primeiro uso, mostrando a tela de login. Sem conexão ou com erro da API, apagar a conta SHALL mostrar o erro e MUST NOT apagar nada, nem na nuvem nem no aparelho.

#### Scenario: Convite para entrar
- **WHEN** não há sessão e o usuário abre a aba Perfil
- **THEN** a seção Conta mostra "Salve seu progresso na nuvem" e o botão "Entrar ou criar conta"

#### Scenario: Conta sem o plano
- **WHEN** um assinante com 30 perguntas usadas abre a tela Conta
- **THEN** a tela mostra o nome, o e-mail, "Conectado com Google", a sincronização, "Sair" e "Apagar conta", e não mostra "Plano", "Pro mensal", "30 / 200 usadas" nem "Gerenciar assinatura"

#### Scenario: Destaque dos botões da Conta
- **WHEN** o usuário abre a tela Conta
- **THEN** "Sair" tem texto e contorno na cor de ação destrutiva, sem preenchimento; "Apagar conta" é um link de texto na cor de ação destrutiva, sem fundo, seguido de "Apaga sua conta e todo o seu progresso, na nuvem e neste aparelho."

#### Scenario: Confirmação de apagar
- **WHEN** o usuário toca em "Apagar conta"
- **THEN** a confirmação avisa que o progresso neste aparelho também será apagado, e o botão "Apagar minha conta" é preenchido com a cor de ação destrutiva

#### Scenario: Sair
- **WHEN** o usuário confirma "Sair"
- **THEN** a seção Conta volta a mostrar o convite para entrar, e o progresso no aparelho continua igual

#### Scenario: Apagar conta
- **WHEN** um usuário com progresso, revisões, interesses e lembretes ligados, tema escuro e idioma inglês confirma "Apagar minha conta"
- **THEN** a conta é apagada na API, o progresso, as revisões, os interesses e os lembretes são apagados no aparelho, as notificações agendadas são canceladas, o tema escuro e o inglês continuam, e a tela de login aparece como no primeiro uso

#### Scenario: Apagar conta sem conexão
- **WHEN** o usuário confirma "Apagar minha conta" sem conexão
- **THEN** aparece o erro de conexão, a conta continua, e o progresso no aparelho continua igual

#### Scenario: Cancelar a exclusão
- **WHEN** o usuário toca em "Cancelar" na confirmação de apagar
- **THEN** nada é apagado e a tela Conta continua
