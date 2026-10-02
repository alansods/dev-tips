## Why

O app tem a estrutura e o conteúdo, mas ainda não deixa estudar: tocar no tema não faz nada. Esta change entrega o núcleo do produto, o fluxo do design aprovado: Temas → tema → deck → flashcards → resumo. Ela junta as changes antes planejadas como `theme-catalog` e `study-session`, para que o app fique usável numa única entrega.

## What Changes

- **Card de tema na Home:** passa a ser tocável e mostra o progresso (barra e "sei/total").
- **Tela do tema** (tela cheia, fora das abas): título, descrição, frameworks, totais e a lista de decks. Cada deck mostra:
  - número de cards;
  - barra de progresso;
  - botão **Estudar**, **Continuar** ou **Estudar de novo**.
- **Sessão de estudo** (tela cheia):
  - cabeçalho com botão de sair, nome do deck, contador e barra de progresso;
  - card com **frente** (pergunta) e **verso** (resposta), específico para cada tipo: endpoint, passo, comparação, conceito e código;
  - **virar** o card tocando nele ou em "Mostrar resposta". Depois, **Não sei** ou **Sei** registra a resposta e avança;
  - nos passos, **abas de framework** (Express, Spring Boot, NestJS, FastAPI) trocam o código. A escolha vale para os próximos passos;
  - código em fonte mono, sem quebra de linha e com rolagem horizontal, mostrando o nome do arquivo e a nota;
  - selo **Complemento** nos cards `supplement`.
- **Resumo da sessão:**
  - contagem de "sei" e "não sei";
  - lista "para revisar";
  - **Revisar os que errei**, que abre uma nova sessão só com os cards errados;
  - **Voltar ao tema**.
- **Progresso em memória:** a última resposta de cada card vale enquanto o app está aberto e alimenta a Home e a tela do tema. A persistência entre aberturas vem na change `progress`.

## Capabilities

### New Capabilities
- `study-flow`: navegação do tema até o estudo, apresentação de cada tipo de card, mecânica de flashcard, resumo e progresso da sessão.

### Modified Capabilities
- `app-shell`: o requisito "Home mínima" muda. A Home passa a mostrar o progresso de cada tema, e tocar no tema abre a tela do tema.

## Impact

- **Novas rotas** no Stack raiz: `src/app/theme/[themeId].tsx` e `src/app/study/[themeId]/[deckId].tsx`.
- **Novo estado:** store de progresso e sessão com Zustand (`src/study/`).
- **Novos componentes:** cards por tipo, bloco de código, abas de framework e barra de progresso (`src/components/`).
- **Nova dependência:** `zustand`.

## Fora de escopo

- Termos relacionados clicáveis e a gaveta do glossário (`glossary-links`). Os chips de termos ainda não aparecem nos cards.
- Persistência do progresso, aba Progresso e zerar progresso (`progress`).
- Temas "Em breve" na Home. Hoje só existe um tema no catálogo.
- Destaque de sintaxe colorido no código, quiz e repetição espaçada.
