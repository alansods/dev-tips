## MODIFIED Requirements

### Requirement: Consultar plano e uso
`GET /me/subscription` (rota protegida) SHALL responder `200` com `{ "plan", "source", "expiresAt", "willRenew", "questions": { "used", "limit" } }`:
- `plan` é `free` ou `pro`;
- `source` é `store`, `admin` ou `null`;
- `expiresAt` é a data de fim do período atual (ISO 8601) ou `null`;
- `willRenew` diz se a renovação automática está ligada;
- `questions.limit` é `200` para assinantes, `null` para admin (sem cota) e `0` no plano grátis.

#### Scenario: Plano grátis
- **WHEN** um usuário sem assinatura chama a rota
- **THEN** a resposta tem `plan` igual a `free`, `source` igual a `null` e `questions` igual a `{ "used": 0, "limit": 0 }`

#### Scenario: Assinante
- **WHEN** um assinante que já usou 30 perguntas no ciclo atual chama a rota
- **THEN** a resposta tem `plan` igual a `pro`, `source` igual a `store`, `willRenew` igual a `true` e `questions` igual a `{ "used": 30, "limit": 200 }`

#### Scenario: Admin
- **WHEN** um admin sem assinatura chama a rota
- **THEN** a resposta tem `plan` igual a `pro`, `source` igual a `admin`, `expiresAt` igual a `null` e `questions.limit` igual a `null`

### Requirement: Cota de perguntas
Cada assinante SHALL ter 200 perguntas por ciclo. O ciclo é o período atual da assinatura, que começa na compra ou na última renovação e termina na expiração. Quando um recurso pago da API recebe uma pergunta:
- de um usuário do plano grátis, SHALL recusá-la com `403` e o código `pro_required`;
- de um assinante que já usou 200 perguntas no ciclo, SHALL recusá-la com `429` e o código `quota_exceeded`;
- em ambos os casos, MUST NOT chamar o modelo de IA.

Uma pergunta SHALL contar na cota só quando for respondida com sucesso. Uma renovação SHALL começar um ciclo novo, com uso zerado. Admins MUST NOT ter limite.

#### Scenario: Plano grátis
- **WHEN** um usuário do plano grátis faz uma pergunta
- **THEN** ela é recusada com `403` e `error.code` igual a `pro_required`, e o modelo de IA não é chamado

#### Scenario: Cota esgotada
- **WHEN** um assinante com 200 perguntas usadas no ciclo faz mais uma pergunta
- **THEN** ela é recusada com `429` e `error.code` igual a `quota_exceeded`, e o modelo de IA não é chamado

#### Scenario: Falha não consome
- **WHEN** um assinante com 30 perguntas usadas faz uma pergunta e a resposta da IA falha
- **THEN** o uso continua em 30

#### Scenario: Renovação zera
- **WHEN** um assinante com 200 perguntas usadas recebe um `RENEWAL`
- **THEN** o uso volta a 0 e ele pode perguntar de novo

#### Scenario: Admin sem limite
- **WHEN** um admin já fez 250 perguntas no mês e faz mais uma
- **THEN** a pergunta é aceita

### Requirement: Paywall
O paywall SHALL abrir em tela cheia, deslizando de baixo para cima, com botão de fechar abaixo da barra de status e do notch (sempre alcançável pelo toque), e mostrar:
- o selo "PRO", o título "Travou num card? Pergunte." e o texto "Com o Pro, você tira dúvidas sobre o card que está estudando, na hora, sem sair da sessão.";
- o plano "Pro mensal" com o preço da loja por mês e, em destaque, a cota "200" "perguntas por mês", com o complemento "sobre qualquer card, em qualquer trilha";
- dentro do cartão do plano, como a cota funciona:
  - "A cota zera a cada renovação da assinatura.";
  - "Só conta pergunta respondida. Se der erro ou faltar conexão, não gasta.";
  - "Acompanhe o seu uso em Perfil.";
- três benefícios:
  - "Explicações de outro jeito quando a resposta do card não bastou";
  - "Novos exemplos de código sobre o mesmo conceito";
  - "Respostas focadas só no conteúdo do card, sem desvio de assunto";
- o botão "Assinar o Pro";
- o aviso "Renova automaticamente. Cancele quando quiser nas configurações do Google Play.";
- os links "Restaurar compras", "Termos" e "Privacidade".

Enquanto o preço da loja não carrega, o botão "Assinar o Pro" SHALL ficar desabilitado. "Termos" e "Privacidade" SHALL abrir os mesmos endereços da seção Sobre.

No iOS, onde a venda ainda não existe, o paywall SHALL mostrar o mesmo conteúdo com o preço fixo "R$ 14,90/mês" e o botão "Assinar o Pro" habilitado. Tocar em "Assinar o Pro" ou em "Restaurar compras" SHALL mostrar o aviso "A assinatura pelo iPhone ainda não está disponível. Em breve!", sem abrir login nem loja.

#### Scenario: Conteúdo
- **WHEN** o paywall abre e a loja devolve o preço "R$ 14,90"
- **THEN** a tela mostra "Pro mensal", "200", "perguntas por mês", "R$ 14,90/mês" e o botão "Assinar o Pro" habilitado

#### Scenario: Como a cota funciona
- **WHEN** o paywall abre
- **THEN** a tela mostra "A cota zera a cada renovação da assinatura.", "Só conta pergunta respondida. Se der erro ou faltar conexão, não gasta." e "Acompanhe o seu uso em Perfil."

#### Scenario: Preço carregando
- **WHEN** o paywall abre e a loja ainda não respondeu
- **THEN** o botão "Assinar o Pro" fica desabilitado

#### Scenario: Paywall no iOS
- **WHEN** o paywall abre no iPhone
- **THEN** a tela mostra "R$ 14,90/mês" e o botão "Assinar o Pro" habilitado

#### Scenario: Assinar no iOS
- **WHEN** o usuário toca em "Assinar o Pro" no iPhone
- **THEN** aparece "A assinatura pelo iPhone ainda não está disponível. Em breve!" e nenhuma compra é iniciada

#### Scenario: Restaurar no iOS
- **WHEN** o usuário toca em "Restaurar compras" no paywall do iPhone
- **THEN** aparece "A assinatura pelo iPhone ainda não está disponível. Em breve!"

#### Scenario: Fechar
- **WHEN** o usuário toca em fechar
- **THEN** o app volta para a tela de onde o paywall foi aberto

### Requirement: Linha Dev Tips Pro no Perfil
Na seção "Conta" da aba Perfil, logo abaixo do convite para entrar ou da linha do usuário, o app SHALL mostrar a linha "Dev Tips Pro":
- **no plano grátis**: o texto "Tire dúvidas sobre cada card"; tocar nela abre o paywall;
- **para assinante**:
  - "Renova em <data>" ou, com a renovação automática desligada, "Termina em <data>";
  - "Perguntas neste mês" com o uso "<usadas> / 200" e uma barra de progresso;
  - abaixo, "Restam <n> perguntas" (ou "Resta 1 pergunta");
  - tocar nela abre a tela "Conta";
- **para admin**: "Pro (admin)" com o texto "Perguntas sem limite", sem barra; tocar nela abre a tela "Conta".

Quando o assinante já usou 80% ou mais da cota, a barra, a borda da linha e o texto de restantes SHALL usar a cor de alerta do tema. Com a cota esgotada, o texto de restantes SHALL ser substituído por "Cota esgotada. Renova em <data>." e o fundo da linha SHALL usar o tom suave de alerta. O leitor de tela SHALL anunciar o uso no rótulo da linha, por exemplo "37 de 200 perguntas usadas".

O uso mostrado SHALL ser o do último plano guardado no aparelho, atualizado também depois de cada resposta do chat. A linha SHALL aparecer no Android e no iOS, e MUST NOT aparecer na web (onde a seção "Conta" não existe).

#### Scenario: Usuário grátis
- **WHEN** um usuário sem assinatura abre a aba Perfil e toca em "Dev Tips Pro"
- **THEN** a linha mostra "Tire dúvidas sobre cada card", e o paywall abre

#### Scenario: Usuário Pro
- **WHEN** um assinante com 37 perguntas usadas e renovação em 12/11/2026 abre a aba Perfil
- **THEN** a linha "Dev Tips Pro" mostra "Renova em 12/11/2026", "Perguntas neste mês", "37 / 200" e "Restam 163 perguntas", e tocar nela abre a tela "Conta"

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
- **WHEN** um admin abre a aba Perfil
- **THEN** a linha mostra "Pro (admin)" e "Perguntas sem limite", sem barra de progresso

#### Scenario: Uso atualizado pelo chat
- **WHEN** um assinante com 37 perguntas usadas recebe uma resposta do chat com `questions.used` igual a 38 e depois abre a aba Perfil
- **THEN** a linha mostra "38 / 200"

#### Scenario: iOS
- **WHEN** o app roda no iPhone e um usuário sem assinatura abre a aba Perfil
- **THEN** a linha "Dev Tips Pro" aparece com "Tire dúvidas sobre cada card"
