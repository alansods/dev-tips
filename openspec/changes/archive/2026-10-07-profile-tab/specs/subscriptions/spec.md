## RENAMED Requirements

- FROM: `### Requirement: Linha Dev Tips Pro em Ajustes`
- TO: `### Requirement: Linha Dev Tips Pro no Perfil`

## MODIFIED Requirements

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
- **THEN** a linha "Dev Tips Pro" na aba Perfil volta a mostrar "Tire dúvidas sobre cada card"

### Requirement: Linha Dev Tips Pro no Perfil
Na seção "Conta" da aba Perfil, logo abaixo do convite para entrar ou da linha do usuário, o app SHALL mostrar a linha "Dev Tips Pro":
- no plano grátis, com o texto "Tire dúvidas sobre cada card"; tocar nela abre o paywall;
- para usuários Pro, com o texto "Ativo"; tocar nela abre a tela "Conta".

A linha SHALL aparecer no Android e no iOS, e MUST NOT aparecer na web (onde a seção "Conta" não existe).

#### Scenario: Usuário grátis
- **WHEN** um usuário sem assinatura toca em "Dev Tips Pro" na aba Perfil
- **THEN** o paywall abre

#### Scenario: Usuário Pro
- **WHEN** um assinante abre a aba Perfil
- **THEN** a linha "Dev Tips Pro" mostra "Ativo", e tocar nela abre a tela "Conta"

#### Scenario: iOS
- **WHEN** o app roda no iPhone e um usuário sem assinatura abre a aba Perfil
- **THEN** a linha "Dev Tips Pro" aparece com "Tire dúvidas sobre cada card"
