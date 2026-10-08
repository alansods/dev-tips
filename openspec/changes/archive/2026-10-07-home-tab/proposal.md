## Why

O app abre direto numa lista de áreas, e o usuário precisa descobrir sozinho o que revisar e onde parou. O design aprovado em 2026-10-07 cria a aba **Início**: a revisão do dia, o deck para continuar, o próximo passo depois da trilha atual, as trilhas novas e boas-vindas no primeiro acesso.

## What Changes

- **Abas:** passam a ser Início · Trilhas · Glossário · Perfil, e o app abre no Início. A lista de áreas vai para a rota `/tracks`.
- **Início com estudo:**
  - saudação pelo horário e pelo primeiro nome, com o selo de dias seguidos;
  - revisão de hoje, com o botão "Começar revisão" ou o estado "em dia" com a semana;
  - "Continue de onde parou" e "Também em andamento";
  - "Próximo passo depois de…", a partir dos pré-requisitos;
  - "Novas trilhas", com o selo "Nova".
- **Primeiro acesso:** boas-vindas, "O que você quer estudar?" (áreas de interesse) e "Comece por aqui".
- **Revisão de todas as trilhas:** uma sessão única com os cards vencidos de todas as trilhas.
- **Áreas de interesse:** salvas no aparelho e editáveis na nova seção do Perfil.
- **Última resposta:** a trilha e o card da última resposta ficam salvos no aparelho, para o "Continue de onde parou".
- **Data de inclusão:** as trilhas ganham `addedAt`. As 41 atuais recebem a data do commit em que entraram.
- **Navegação:** o login no primeiro uso e o toque na notificação sem revisão levam ao Início.

## Capabilities

### New Capabilities

- `home`: a aba Início e as suas seções, o primeiro acesso, as áreas de interesse e a última resposta.

### Modified Capabilities

- `app-shell`: "Navegação por abas" (4 abas, o app abre no Início) e "Aba Perfil" (seção "Áreas de interesse").
- `auth`: "Tela de login" (antes do Início).
- `reminders`: "Abrir pela notificação" (sem revisão, abre o Início).
- `spaced-repetition`: novo requisito "Revisão de todas as trilhas".
- `content-model`: novo requisito "Data de inclusão da trilha".

## Impact

- Rotas:
  - `(tabs)/index.tsx` passa a ser o Início;
  - nova `(tabs)/tracks.tsx` com as áreas;
  - nova `src/app/review/index.tsx`.
- Sessão: `StudySession` passa a aceitar cards de várias trilhas. As rotas de deck e de revisão por trilha se adaptam.
- Lógica:
  - `src/home/sections.ts`, novo, com as funções puras das seções;
  - store de estudo: `lastAnswer`;
  - store de preferências: `interests`.
- Componentes:
  - telas e componentes do Início em `src/home/`;
  - `InterestsSection` no Perfil;
  - `HomeIcon`.
- Conteúdo: `addedAt` nas trilhas.
- Testes: os que abriam `/` esperando a lista de áreas passam a abrir `/tracks`.
- Sem mudança na API. A última resposta e os interesses não sincronizam.

## Fora de escopo

- Busca e filtros na aba Trilhas, que vêm na change `tracks-search`.
- Notificação que abre a revisão de todas as trilhas. O toque continua abrindo a trilha com mais revisão.
- Estimativa de tempo por tipo de card.
