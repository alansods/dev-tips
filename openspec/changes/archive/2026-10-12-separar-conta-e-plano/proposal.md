## Why

Na aba Perfil, a linha da conta e a linha "Dev Tips Pro" (para quem é Pro) abrem a mesma tela "Conta", que junta dados da conta, plano, sincronização, Sair e Apagar conta. Quem toca em uma opção vê informação da outra. Além disso, "Apagar conta" usa o mesmo tom laranja do alerta de cota, e uma ação destrutiva e irreversível não se distingue de um simples aviso.

## What Changes

- A tela "Conta" passa a mostrar só a conta: foto, nome, e-mail, "Conectado com Google", sincronização, "Sair" e "Apagar conta". O bloco "Plano" sai dela.
- Nova tela "Plano", com o bloco "Plano" (grátis, assinante ou admin), igual ao que hoje aparece na Conta.
- A linha "Dev Tips Pro" do Perfil, para assinante e admin, passa a abrir a tela "Plano". No plano grátis continua abrindo o paywall.
- "Restaurar compras" fica disponível na tela "Plano" (antes, na Conta).
- Nova cor de ação destrutiva no tema (vermelho), diferente da cor de alerta. Na Conta, "Sair" vira botão com contorno vermelho, e "Apagar conta" vira um link de texto vermelho discreto no fim da tela. A confirmação "Apagar minha conta" é vermelha preenchida.
- **Apagar conta passa a apagar tudo**: além da nuvem, apaga no aparelho o progresso, as revisões, os interesses, os lembretes e a fila de sincronização, e volta ao primeiro uso. Tema e idioma continuam. Antes, o progresso no aparelho era mantido. Quem apaga a conta espera sumir do app, e assim "Sair" (mantém o progresso) e "Apagar" (apaga tudo) ficam bem diferentes.
- No Plano, "Gerenciar assinatura" fica em destaque (contorno azul), e "Restaurar compras" vira um link discreto.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `auth`: o requisito "Conta no app" perde o bloco "Plano", ganha a sincronização na ordem da tela e o novo destaque dos botões, e "Apagar conta" passa a apagar também os dados no aparelho.
- `subscriptions`: novo requisito "Tela Plano", com o bloco que saiu da Conta e os botões com peso diferente. "Linha Dev Tips Pro no Perfil" passa a abrir a tela "Plano", e "Restaurar compras" passa a valer na tela "Plano".

## Impact

- App: apagar a conta passa a limpar os stores locais (estudo, sincronização, configurações sem tema e idioma, lembretes e notificações); nova rota de tela para o Plano, a tela Conta, a linha Dev Tips Pro, o bloco Plano, o botão compartilhado (nova variante destrutiva) e os tokens de cor (claro e escuro).
- Testes de interface de assinatura e de conta.
- Sem impacto na API, no conteúdo ou em dependências.

## Fora de escopo

- "Zerar progresso" (tela de progresso) continua com a cor de alerta. Pode migrar para a cor destrutiva numa change própria.
- Mudanças no paywall, na cota ou nos textos do bloco Plano.
- Versão web (a seção Conta e o plano não existem na web).
