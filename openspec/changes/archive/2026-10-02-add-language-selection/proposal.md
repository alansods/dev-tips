## Why

Hoje o app é só em PT-BR, mas o público natural de um app de preparação para entrevistas de desenvolvimento inclui quem estuda e é entrevistado em inglês, e muitos termos técnicos já são usados em inglês no dia a dia. Permitir escolher entre inglês e PT-BR amplia o público e deixa praticar o vocabulário da entrevista no idioma em que ela vai acontecer.

## What Changes

- Nova tela **Ajustes**, aberta por um ícone de engrenagem no cabeçalho das abas, ao lado do botão de tema claro/escuro.
- Seletor de idioma em Ajustes: **Português (Brasil)** e **English**. A troca vale na hora, sem reiniciar o app.
- No primeiro uso, o idioma segue o do aparelho: inglês se o idioma principal do aparelho for inglês e PT-BR nos outros casos. Depois que o usuário escolhe, a escolha é salva e prevalece.
- Toda a interface é traduzida: abas, títulos, botões, resumo, progresso, glossário, mensagens, rótulos acessíveis e o texto das notificações de lembrete.
- O conteúdo dos temas passa a aceitar tradução: cada tema pode ter um arquivo de tradução para inglês com os textos de tema, decks e cards. O que não estiver traduzido aparece em PT-BR, sem quebrar o app.
- Código dos snippets, ids, métodos HTTP, caminhos e nomes de frameworks não são traduzidos.
- A busca do glossário procura no idioma exibido.
- Decisão de produto revista: o MVP deixa de ser "somente PT-BR" (atualizar o `context` em `openspec/config.yaml`).

## Capabilities

### New Capabilities

- `localization`: escolha de idioma (PT-BR/inglês), idioma inicial pelo aparelho, persistência, tradução da interface e fallback do conteúdo para PT-BR.

### Modified Capabilities

- `app-shell`: novo requisito para a tela Ajustes e o acesso pelo cabeçalho.
- `content-model`: novo requisito para o arquivo de tradução de um tema e a validação dele.

## Impact

- Nova dependência `expo-localization`, para ler o idioma do aparelho.
- Código novo em `src/i18n/` (dicionários, hook de tradução, store do idioma) e uma nova rota `src/app/settings.tsx`.
- Todos os componentes com texto fixo passam a usar o dicionário: `src/study/copy.ts`, `StudySession.tsx`, as abas, `TermSheet.tsx`, `glossary/search.ts` e outros.
- `src/content/`: schema e validação do arquivo de tradução, e a montagem do tema no idioma escolhido (`catalog.ts`).
- Testes de tela continuam em PT-BR por padrão, mais testes novos em inglês.
- Relação com outras changes: `rename-answer-labels` define os rótulos em PT-BR ("Já sabia"/"Não sabia"; em inglês "I knew it"/"I didn't know"). `add-study-reminders` deve ser aplicada **depois** desta, com a seção Lembretes na tela Ajustes e os textos traduzidos.

## Fora de escopo

- Traduzir os temas existentes (CRUD e Fundamentos web): é trabalho editorial numa change de conteúdo própria. Esta change entrega o mecanismo e um teste com uma tradução parcial de exemplo.
- Outros idiomas além de PT-BR e inglês; idiomas da direita para a esquerda.
- Tradução automática ou por servidor.
- Formatação de datas e números por idioma, já que hoje o app não exibe datas.
