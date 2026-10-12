## RENAMED Requirements

- FROM: `### Requirement: Linha Dev Tips Pro no Perfil`
- TO: `### Requirement: Linha Dev Cards Pro no Perfil`

## MODIFIED Requirements

### Requirement: Linha Dev Cards Pro no Perfil
Na seção "Conta" da aba Perfil, logo abaixo do convite para entrar ou da linha do usuário, o app SHALL mostrar a linha "Dev Cards Pro":
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
- **WHEN** um usuário sem assinatura abre a aba Perfil e toca em "Dev Cards Pro"
- **THEN** a linha mostra "Tire dúvidas sobre cada card", e o paywall abre

#### Scenario: Usuário Pro
- **WHEN** um assinante com 37 perguntas usadas e renovação em 12/11/2026 abre a aba Perfil
- **THEN** a linha "Dev Cards Pro" mostra "Renova em 12/11/2026", "Perguntas neste mês", "37 / 200" e "Restam 163 perguntas", e tocar nela abre a tela "Plano"

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
- **WHEN** um admin abre a aba Perfil e toca em "Dev Cards Pro"
- **THEN** a linha mostra "Pro (admin)" e "Perguntas sem limite", sem barra de progresso, e a tela "Plano" abre

#### Scenario: Uso atualizado pelo chat
- **WHEN** um assinante com 37 perguntas usadas recebe uma resposta do chat com `questions.used` igual a 38 e depois abre a aba Perfil
- **THEN** a linha mostra "38 / 200"

#### Scenario: iOS
- **WHEN** o app roda no iPhone e um usuário sem assinatura abre a aba Perfil
- **THEN** a linha "Dev Cards Pro" aparece com "Tire dúvidas sobre cada card"

### Requirement: Plano no app
Com sessão, o app SHALL consultar `GET /me/subscription`:
- ao abrir;
- depois do login;
- depois de comprar ou restaurar;
- ao voltar para o primeiro plano.

O app SHALL guardar no aparelho a última resposta, para usar sem conexão. Ao sair da conta ou apagá-la, o app SHALL voltar a tratar o usuário como plano grátis e desligar a conta da loja do usuário anterior. Sem sessão, o app SHALL tratar o usuário como plano grátis.

#### Scenario: Sem conexão
- **WHEN** um assinante abre o app sem conexão
- **THEN** o app usa o último plano guardado e trata o usuário como Pro

#### Scenario: Sair da conta
- **WHEN** um assinante sai da conta
- **THEN** a linha "Dev Cards Pro" na aba Perfil volta a mostrar "Tire dúvidas sobre cada card"
