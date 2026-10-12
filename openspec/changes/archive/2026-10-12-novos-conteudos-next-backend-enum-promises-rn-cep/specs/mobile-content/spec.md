## MODIFIED Requirements

### Requirement: Decks da trilha de React Native
A trilha SHALL ter exatamente 5 decks, nesta ordem: quatro decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 30 cards. Os decks de conteúdo SHALL ser:

| id | Título |
|---|---|
| `componentes-e-estilo` | Componentes e estilo |
| `navegacao-e-expo` | Navegação e Expo |
| `performance-e-publicacao` | Performance e publicação |
| `rotas-privadas` | Autenticação e rotas privadas |

O deck `rotas-privadas` SHALL cobrir:
- rotas protegidas do Expo Router (`Stack.Protected` com `guard`): o redirecionamento para a rota âncora e a limpeza do histórico quando o guard fica falso;
- grupos de rotas para separar telas públicas e privadas;
- um contexto de sessão que carrega o token guardado no SecureStore ao abrir o app, com a splash visível enquanto a sessão carrega;
- por que esconder telas no cliente não substitui a validação do token pela API, incluindo encerrar a sessão quando a API responde 401.

Os snippets dos cards `code` SHALL usar a linguagem `ts` (inclusive componentes com JSX), `bash` para comandos de terminal ou `json` para arquivos de configuração.

#### Scenario: Contagem por deck
- **WHEN** a trilha de React Native é carregada
- **THEN** ela tem os 5 decks na ordem da tabela e o deck de entrevista por último, com 6 cards cada e 30 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Rotas protegidas com Expo Router
- **WHEN** os cards `code` do deck `rotas-privadas` são lidos
- **THEN** pelo menos um snippet de `_layout.tsx` contém `Stack.Protected` e `guard`, e pelo menos um snippet usa `expo-secure-store`
