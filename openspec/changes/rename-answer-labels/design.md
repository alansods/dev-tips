## Context

Os rótulos "Sei"/"Não sei" estão escritos direto nos componentes (`StudySession.tsx`, `progress.tsx`, `glossary.tsx`), e os testes de tela os buscam por texto e por rótulo acessível. O estado salvo usa `'known' | 'unknown'`, que não aparece para o usuário.

## Goals / Non-Goals

**Goals:**
- Trocar todos os textos visíveis de resposta pelos novos rótulos de forma consistente.
- Manter o formato dos dados salvos.

**Non-Goals:**
- Criar um sistema de i18n ou um arquivo central para todos os textos do app.

## Decisions

- **Renomear só a camada de apresentação.** `AnswerResult` continua `'known' | 'unknown'`. Alternativa descartada: renomear para `'knew' | 'didNotKnow'`, o que exigiria migrar o AsyncStorage sem ganho para o usuário.
- **Centralizar os rótulos em `src/study/copy.ts`** com uma constante `ANSWER_LABEL = { known: 'Já sabia', unknown: 'Não sabia' }` e as formas minúsculas para contagens e selos. `copy.ts` já guarda os textos fixos da sessão, e assim a sessão, a aba Progresso e o glossário usam a mesma fonte.
- **Rótulos acessíveis seguem o texto visível** (`"3 já sabia"`, `"2 não sabia"`), para que os leitores de tela anunciem o mesmo que aparece na tela.

## Risks / Trade-offs

- [Botão "Não sabia" é mais largo que "Não sei"] → os dois botões já dividem a linha com `flex`. Conferir em uma tela estreita (cerca de 320 pt) que o texto não quebra; se quebrar, reduzir o padding horizontal.
- [Selo "já sabia" é mais largo na lista do glossário] → conferir visualmente; o selo já tem largura automática.
