## Context

Mesmo formato da trilha "Estado e dados no React" (change `add-react-state-data-track`): framework `react`, áreas Frontend e Mobile, helper `describeContentTracks` para os testes de conteúdo e a navegação já filtrando por área. O próprio projeto usa Jest com o preset `jest-expo` e React Native Testing Library, então os exemplos seguem o que o app já faz.

## Goals / Non-Goals

**Goals:**
- Cobrir, no nível de entrevista, como testar componentes e hooks React e React Native: Jest, Testing Library, mocks e testes de integração com a API simulada.
- Mostrar o critério de "testar como o usuário usa" e o que vale cobrir.

**Non-Goals:**
- Testes end-to-end e ferramentas de E2E, que só aparecem na comparação da pirâmide.
- Configuração completa de Jest (transform, moduleNameMapper). Os snippets mostram o teste, não o setup.

## Decisions

### 1. Framework React, nas áreas Frontend e Mobile
Escolhido pelo usuário, igual à trilha 1. Os exemplos são componentes e hooks React e React Native.
*Alternativa descartada:* JavaScript puro (sem framework), que criaria a seção "Linguagem pura" na área Mobile só com esta trilha e a separaria do resto do conteúdo de React.

### 2. Cenários de navegação por ordem relativa
Os cenários de React no Frontend e no Mobile passam a conferir só a posição da trilha em relação à anterior ("depois de"), e não a lista completa. Assim, cada nova trilha da série no framework React não obriga a reescrever os cenários das anteriores; só as contagens de `javascript-content` e `mobile-content` mudam.

### 3. Snippets compatíveis com as versões atuais
O React Native Testing Library v14 tornou `render` e `renderHook` assíncronos; o projeto usa a v13, em que eles são síncronos. Os snippets usam `await render(...)`, que funciona nas duas. MSW na versão 2 (`http`, `HttpResponse`, `setupServer` de `msw/node`). `userEvent.setup()` com `await` em cada interação.

### 4. Plano de cards (24)
Níveis: J = júnior, P = pleno, S = sênior.

| Deck | Cards |
|---|---|
| Jest | concept: Jest (J) · Matchers (J) · Mocks (P) · Fake timers (P) — code: Mock de módulo com jest.mock (P) · Fake timers num debounce (P) |
| Testing Library | concept: Testing Library (J) · Prioridade das queries (P) · get, query e find (P) · userEvent e fireEvent (P) — code: Formulário com userEvent (P) · Tela React Native com findBy (P) |
| Testes de integração | concept: Pirâmide e troféu de testes (P) · Mock de API com MSW (P) · renderHook (P) · O que testar (S) — code: Handler MSW e erro da API (S) · Hook com React Query no renderHook (S) |
| Perguntas de entrevista | Unitário, integração ou E2E? (J) · Por que getByRole e não testID? (P) · Como testar código assíncrono? (P) · Snapshot vale a pena? (P) · Mockar o módulo ou a rede? (S) · Como lidar com testes instáveis no frontend? (S) |

### 5. Critério de nível
O mesmo das changes anteriores. **Júnior**: o que é e o uso básico. **Pleno**: usar bem no dia a dia e as armadilhas comuns. **Sênior**: trade-offs de estratégia de testes, confiabilidade e manutenção em escala.

## Risks / Trade-offs

- [APIs de teste mudam entre versões (RNTL v13 → v14)] → Snippets escritos para funcionar nas duas e cards focados no conceito.
- [Exatidão técnica não é coberta por teste] → Consulta à doc antes de escrever e revisão no PR.
