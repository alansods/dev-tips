## Why

Os conceitos que valem para qualquer linguagem (tipagem, valor e referência, escopo, closure, orientação a objetos, stack e heap, garbage collector, threads) estão espalhados e repetidos nas trilhas de JavaScript, Java e Python. Quem estuda mais de uma linguagem revê o mesmo conteúdo. Ao mesmo tempo, não há uma trilha de fundamentos de programação: "Fundamentos web" só cobre HTTP, REST e navegador.

## What Changes

- A trilha `fundamentos-web` passa a se chamar "Fundamentos de programação e web" e ganha 4 decks de programação (24 concepts) antes dos decks de web, além de 6 perguntas de entrevista de programação (57 cards no total).
- As trilhas JavaScript essencial, Java essencial, Java: coleções, streams e concorrência e Python essencial trocam os cards de conceito geral por cards das particularidades de cada linguagem. Os cards trocados ganham id novo.
- Java essencial e Python essencial passam a ter `fundamentos-web` como pré-requisito (JavaScript essencial já tinha).
- Nova regra: trilha de linguagem não repete termo da trilha de fundamentos.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `web-fundamentals-content`: título, decks, contagens, tradução e a regra de conceitos gerais só em Fundamentos.
- `catalog-navigation`, `content-model`, `git-content`, `glossary`, `home`, `progress`, `reminders`, `spaced-repetition`, `track-icons`: só o nome da trilha nos cenários (e as contagens do glossário).

## Impact

- `content/tracks/fundamentos-web`, `javascript-essencial`, `java-essencial`, `java-colecoes-e-concorrencia` e `python-essencial` (track.json e translations/en.json).
- Testes de conteúdo e de tela que citam o título da trilha.
- Sem mudança de código de tela, API ou formato de dados. O progresso dos cards removidos deixa de aparecer; o resto do progresso continua, porque o id da trilha não muda.
