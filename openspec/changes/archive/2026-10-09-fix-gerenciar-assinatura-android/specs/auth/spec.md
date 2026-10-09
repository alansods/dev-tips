## MODIFIED Requirements

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

#### Scenario: Gerenciar assinatura no Android
- **WHEN** um assinante toca em "Gerenciar assinatura" na tela Conta, no Android
- **THEN** abre a página de assinaturas do Google Play com a assinatura do Dev Tips, onde ele pode cancelá-la

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
