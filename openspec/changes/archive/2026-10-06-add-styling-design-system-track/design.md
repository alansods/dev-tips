## Context

Mesmo formato das trilhas "Estado e dados no React" e "Testes no frontend": framework `react`, áreas Frontend e Mobile, helper `describeContentTracks` e cenários de navegação por ordem relativa. A trilha React Native já cobre StyleSheet e flexbox; esta trilha não repete esse conteúdo.

## Goals / Non-Goals

**Goals:**
- Cobrir, no nível de entrevista, estilização com classes utilitárias na web (Tailwind) e no React Native (NativeWind).
- Cobrir como construir e manter um design system: tokens, tema, componentes com variantes, documentação no Storybook.
- Cobrir o básico de acessibilidade que uma pessoa sênior de frontend precisa defender: papéis e rótulos, contraste, área de toque, leitor de tela e foco, na web e no mobile.

**Non-Goals:**
- Tutorial de instalação de cada ferramenta. Os snippets mostram o uso, não o setup completo.
- Auditoria completa de acessibilidade (todos os critérios WCAG).

## Decisions

### 1. Framework React, nas áreas Frontend e Mobile
Escolhido pelo usuário, igual às trilhas 1 e 2.
*Alternativa descartada:* trilha direta em Fundamentos, que separaria a trilha dos exemplos em React e React Native.

### 2. CSS como `text`
O formato não tem `css`. O snippet de tokens no `@theme` usa `text`, como a trilha Vue faz com componentes `.vue`. Componentes usam `ts`.

### 3. Versões
- Tailwind: o v4 define os tokens no CSS com `@theme`; o v3 usa `tailwind.config.js`. O card de Tailwind cita os dois sem depender de número de versão no snippet.
- NativeWind: a versão estável (v4) ainda roda sobre o Tailwind 3 (`tailwind.config.js` com o preset `nativewind/preset`). O card explica o mecanismo (classes compiladas em estilos nativos) e não o passo a passo de instalação.
- Storybook: CSF3 com `satisfies Meta<typeof Component>`, `args` e `play`.
- React Native: as props `role` e `aria-label` valem junto com `accessibilityRole` e `accessibilityLabel`.

### 4. Plano de cards (24)
Níveis: J = júnior, P = pleno, S = sênior.

| Deck | Cards |
|---|---|
| Tailwind e NativeWind | concept: Utility-first (J) · Tailwind CSS (J) · NativeWind (P) · Classes condicionais (P) — code: Card com NativeWind (P) · Tokens no @theme (P) |
| Design system | concept: Design system (S) · Design tokens (P) · Componente com variantes (P) · Storybook (P) — code: Button com variantes (P) · Stories do Button (P) |
| Acessibilidade | concept: Acessibilidade (J) · Papéis e rótulos (P) · Contraste e área de toque (P) · Leitor de tela e foco (S) — code: Botão de ícone acessível no React Native (P) · Campo com erro acessível na web (P) |
| Perguntas de entrevista | Tailwind ou CSS tradicional? (J) · Tailwind, StyleSheet ou CSS-in-JS no React Native? (P) · Como implementar tema claro e escuro? (P) · Variante nova ou componente novo? (P) · Como montar e manter um design system? (S) · Como garantir acessibilidade num app? (S) |

### 5. Critério de nível
O mesmo das changes anteriores.

## Risks / Trade-offs

- [Tailwind e NativeWind mudam de versão com frequência e as duas versões convivem] → Cards focados no conceito, com a diferença de configuração citada explicitamente.
- [Exatidão técnica não é coberta por teste] → Consulta à doc antes de escrever e revisão no PR.
