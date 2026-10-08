## Why

O assinante não consegue ver com clareza a cota de 100 perguntas. No paywall ela aparece numa linha pequena, sem explicar como funciona, e o uso só aparece escondido em Perfil › Conta. Quem assina precisa saber o limite antes de pagar e conseguir acompanhar o próprio uso sem procurar. O design aprovado está no canvas "Cota de perguntas do plano" (https://claude.ai/artifact/VMpdzwv8efsPXjUPKyahEX).

## What Changes

- **Paywall**: o cartão "Pro mensal" destaca "100 perguntas por mês" e explica a cota em três linhas: ela zera a cada renovação, só conta pergunta respondida e o uso fica visível em Perfil.
- **Linha "Dev Tips Pro" no Perfil**:
  - para o assinante, mostra a data de renovação ou de término, "Perguntas neste mês" com "<usadas> / 100", uma barra e quantas perguntas restam;
  - com 80% ou mais de uso, a linha passa para a cor de alerta;
  - com a cota esgotada, mostra "Cota esgotada. Renova em <data>.";
  - o admin vê "Pro (admin)" e "Perguntas sem limite";
  - no plano grátis, a linha continua como hoje ("Tire dúvidas sobre cada card").
- **Bloco "Plano" da tela Conta**: o número de perguntas restantes em destaque, a barra, "<usadas> / 100 usadas" e "Zera em <data>", mais o quadro "Como a cota funciona". Os demais itens do bloco continuam.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `subscriptions`: os requisitos "Paywall" e "Linha Dev Tips Pro no Perfil" passam a mostrar e explicar a cota.
- `auth`: o requisito "Conta no app" muda o conteúdo do bloco "Plano" para o assinante.

## Impact

- App: `src/app/paywall.tsx`, `src/settings/ProRow.tsx`, `src/subscriptions/PlanCard.tsx`, `src/components/ProgressBar.tsx` (ganha a cor de alerta), textos em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`, testes de UI.
- API: nada muda. `GET /me/subscription` já devolve o uso, o limite e as datas.

## Fora de escopo

- Avisos fora das telas de plano, como notificações ou banners no estudo quando a cota está acabando.
- Mudar a cota, o preço ou as regras de contagem.
- Mostrar o preço na tela Conta, que precisaria consultar a loja ali também.
- O aviso de cota esgotada dentro do chat, que já existe e não muda.
