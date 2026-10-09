## MODIFIED Requirements

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

Enquanto o preço da loja não carrega, o botão "Assinar o Pro" SHALL ficar desabilitado, sem aviso. No Android, se a loja não devolver o preço (assinatura não configurada, plano não encontrado ou erro da loja), o paywall SHALL mostrar o aviso "A assinatura está indisponível no momento. Tente de novo mais tarde." e o botão "Assinar o Pro" SHALL continuar desabilitado. "Termos" e "Privacidade" SHALL abrir os mesmos endereços da seção Sobre.

No iOS, onde a venda ainda não existe, o paywall SHALL mostrar o mesmo conteúdo com o preço fixo "R$ 14,90/mês" e o botão "Assinar o Pro" habilitado. Tocar em "Assinar o Pro" ou em "Restaurar compras" SHALL mostrar o aviso "A assinatura pelo iPhone ainda não está disponível. Em breve!", sem abrir login nem loja.

#### Scenario: Conteúdo
- **WHEN** o paywall abre e a loja devolve o preço "R$ 14,90"
- **THEN** a tela mostra "Pro mensal", "200", "perguntas por mês", "R$ 14,90/mês" e o botão "Assinar o Pro" habilitado

#### Scenario: Como a cota funciona
- **WHEN** o paywall abre
- **THEN** a tela mostra "A cota zera a cada renovação da assinatura.", "Só conta pergunta respondida. Se der erro ou faltar conexão, não gasta." e "Acompanhe o seu uso em Perfil."

#### Scenario: Preço carregando
- **WHEN** o paywall abre e a loja ainda não respondeu
- **THEN** o botão "Assinar o Pro" fica desabilitado, sem o aviso de assinatura indisponível

#### Scenario: Assinatura indisponível
- **WHEN** o paywall abre no Android e a loja responde sem preço
- **THEN** a tela mostra "A assinatura está indisponível no momento. Tente de novo mais tarde." e o botão "Assinar o Pro" fica desabilitado

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
