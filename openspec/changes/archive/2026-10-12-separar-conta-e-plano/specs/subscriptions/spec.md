## ADDED Requirements

### Requirement: Tela Plano
O app SHALL ter a tela "Plano", com o título "Plano" e o botão Voltar, que volta para a aba Perfil. A tela SHALL exigir sessão: sem sessão, SHALL voltar para a aba Perfil. A tela SHALL mostrar só o bloco do plano:
- **no plano grátis**: "Plano grátis" e o botão "Conhecer o Pro", que abre o paywall;
- **para assinante**:
  - o selo "PRO", "Pro mensal" e "Ativo";
  - em destaque, o número de perguntas restantes no ciclo, seguido de "perguntas restantes" (ou "pergunta restante" quando resta 1);
  - uma barra de progresso do uso;
  - o uso "<usadas> / 200 usadas" e "Zera em <data>", com a data do fim do ciclo;
  - o quadro "Como a cota funciona", com "200 perguntas por ciclo da assinatura.", "Só conta pergunta respondida." e "Na renovação, o contador volta a zero.";
  - "Renova em <data>" (ou "Termina em <data>" quando a renovação automática está desligada);
  - o botão "Gerenciar assinatura" (abre o gerenciamento de assinaturas do Google Play), na largura do bloco, com texto e contorno na cor de destaque do tema e sem preenchimento;
  - logo abaixo, "Restaurar compras" como link de texto discreto, sem fundo nem contorno;
- **para admin**: o selo "PRO", "Pro (admin)" e "Perguntas sem limite", sem "Gerenciar assinatura".

A tela "Plano" MUST NOT mostrar dados da conta (e-mail, sincronização), "Sair" nem "Apagar conta". Com 80% ou mais da cota usada, a barra e o número de restantes SHALL usar a cor de alerta do tema.

A tela "Plano" SHALL existir no Android e no iOS. No iOS, onde o Pro ainda não é vendido, o assinante MUST NOT ver os botões "Gerenciar assinatura" e "Restaurar compras".

#### Scenario: Plano grátis na tela Plano
- **WHEN** um usuário sem assinatura abre a tela Plano
- **THEN** a tela mostra "Plano grátis" e o botão "Conhecer o Pro"

#### Scenario: Assinante na tela Plano
- **WHEN** um assinante com 30 perguntas usadas e renovação em 12/11/2026 abre a tela Plano
- **THEN** a tela mostra "Pro mensal", "Ativo", "170", "perguntas restantes", "30 / 200 usadas", "Zera em 12/11/2026", "Como a cota funciona", "Renova em 12/11/2026", "Gerenciar assinatura" e "Restaurar compras", e não mostra o e-mail, "Sair" nem "Apagar conta"

#### Scenario: Destaque dos botões do Plano
- **WHEN** um assinante abre a tela Plano no Android
- **THEN** "Gerenciar assinatura" tem texto e contorno na cor de destaque, sem preenchimento, e "Restaurar compras" é um link de texto sem fundo nem contorno

#### Scenario: Gerenciar assinatura no Android
- **WHEN** um assinante toca em "Gerenciar assinatura" na tela Plano, no Android
- **THEN** abre a página de assinaturas do Google Play com a assinatura do Dev Tips, onde ele pode cancelá-la

#### Scenario: Uma pergunta restante na tela Plano
- **WHEN** um assinante com 199 perguntas usadas abre a tela Plano
- **THEN** a tela mostra "1" e "pergunta restante"

#### Scenario: Renovação desligada na tela Plano
- **WHEN** um assinante que cancelou na loja, com acesso até 12/11/2026, abre a tela Plano
- **THEN** a tela mostra "Termina em 12/11/2026"

#### Scenario: Admin na tela Plano
- **WHEN** um admin abre a tela Plano
- **THEN** a tela mostra "Pro (admin)" e "Perguntas sem limite", sem o botão "Gerenciar assinatura"

#### Scenario: Tela Plano no iOS
- **WHEN** um assinante abre a tela Plano no iPhone
- **THEN** a tela mostra "Pro mensal" e "30 / 200 usadas", sem os botões "Gerenciar assinatura" e "Restaurar compras"

#### Scenario: Tela Plano sem sessão
- **WHEN** não há sessão e a tela Plano é aberta
- **THEN** o app volta para a aba Perfil

## MODIFIED Requirements

### Requirement: Restaurar compras
"Restaurar compras" (no paywall e na tela Plano) SHALL exigir sessão, abrindo o login se não houver. Com sessão, o app SHALL restaurar as compras na loja e sincronizar com a API:
- se o usuário ficar Pro, SHALL mostrar "Assinatura restaurada." (e, no paywall, fechá-lo);
- se não houver assinatura ativa, SHALL mostrar "Nenhuma assinatura ativa encontrada.";
- em caso de erro, SHALL mostrar "Não foi possível restaurar agora. Tente de novo."

#### Scenario: Assinatura encontrada
- **WHEN** o usuário restaura as compras e a sincronização devolve `plan` igual a `pro`
- **THEN** aparece "Assinatura restaurada." e o paywall fecha

#### Scenario: Nada para restaurar
- **WHEN** o usuário restaura as compras e a sincronização devolve `plan` igual a `free`
- **THEN** aparece "Nenhuma assinatura ativa encontrada."

### Requirement: Linha Dev Tips Pro no Perfil
Na seção "Conta" da aba Perfil, logo abaixo do convite para entrar ou da linha do usuário, o app SHALL mostrar a linha "Dev Tips Pro":
- **no plano grátis**: o texto "Tire dúvidas sobre cada card"; tocar nela abre o paywall;
- **para assinante**:
  - "Renova em <data>" ou, com a renovação automática desligada, "Termina em <data>";
  - "Perguntas neste mês" com o uso "<usadas> / 200" e uma barra de progresso;
  - abaixo, "Restam <n> perguntas" (ou "Resta 1 pergunta");
  - tocar nela abre a tela "Plano";
- **para admin**: "Pro (admin)" com o texto "Perguntas sem limite", sem barra; tocar nela abre a tela "Plano".

Quando o assinante já usou 80% ou mais da cota, a barra, a borda da linha e o texto de restantes SHALL usar a cor de alerta do tema. Com a cota esgotada, o texto de restantes SHALL ser substituído por "Cota esgotada. Renova em <data>." e o fundo da linha SHALL usar o tom suave de alerta. O leitor de tela SHALL anunciar o uso no rótulo da linha, por exemplo "37 de 200 perguntas usadas".

O uso mostrado SHALL ser o do último plano guardado no aparelho, atualizado também depois de cada resposta do chat. A linha SHALL aparecer no Android e no iOS, e MUST NOT aparecer na web (onde a seção "Conta" não existe).

#### Scenario: Usuário grátis
- **WHEN** um usuário sem assinatura abre a aba Perfil e toca em "Dev Tips Pro"
- **THEN** a linha mostra "Tire dúvidas sobre cada card", e o paywall abre

#### Scenario: Usuário Pro
- **WHEN** um assinante com 37 perguntas usadas e renovação em 12/11/2026 abre a aba Perfil
- **THEN** a linha "Dev Tips Pro" mostra "Renova em 12/11/2026", "Perguntas neste mês", "37 / 200" e "Restam 163 perguntas", e tocar nela abre a tela "Plano"

#### Scenario: Quase no fim
- **WHEN** um assinante com 172 perguntas usadas abre a aba Perfil
- **THEN** a linha mostra "172 / 200" e "Restam 28 perguntas" na cor de alerta

#### Scenario: Última pergunta
- **WHEN** um assinante com 199 perguntas usadas abre a aba Perfil
- **THEN** a linha mostra "Resta 1 pergunta"

#### Scenario: Cota esgotada
- **WHEN** um assinante com 200 perguntas usadas e renovação em 12/11/2026 abre a aba Perfil
- **THEN** a linha mostra "200 / 200" e "Cota esgotada. Renova em 12/11/2026."

#### Scenario: Renovação desligada no Perfil
- **WHEN** um assinante que cancelou na loja, com acesso até 12/11/2026, abre a aba Perfil
- **THEN** a linha mostra "Termina em 12/11/2026"

#### Scenario: Admin no Perfil
- **WHEN** um admin abre a aba Perfil e toca em "Dev Tips Pro"
- **THEN** a linha mostra "Pro (admin)" e "Perguntas sem limite", sem barra de progresso, e a tela "Plano" abre

#### Scenario: Uso atualizado pelo chat
- **WHEN** um assinante com 37 perguntas usadas recebe uma resposta do chat com `questions.used` igual a 38 e depois abre a aba Perfil
- **THEN** a linha mostra "38 / 200"

#### Scenario: iOS
- **WHEN** o app roda no iPhone e um usuário sem assinatura abre a aba Perfil
- **THEN** a linha "Dev Tips Pro" aparece com "Tire dúvidas sobre cada card"
