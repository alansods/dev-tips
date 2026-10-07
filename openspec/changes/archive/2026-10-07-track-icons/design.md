## Context

- **Navegação:** a trilha fica no catálogo por `areas`, `language` e `framework` (`placementOf`, em `src/content/taxonomy.ts`). O cadastro `content/taxonomy.json` é validado por `taxonomySchema`, e cada trilha por `trackSchema` (`src/content/schema.ts`).
- **SVG:** o app já usa `react-native-svg` (logo do Google, ícones de traço em `src/components/icons.tsx`).
- **Tema:** o tema dá as cores pelo `useTheme()`. Para calcular contraste, já existe `contrastRatio`, em `src/theme/contrast.ts`.

## Goals / Non-Goals

**Goals:**
- Um único componente desenha qualquer ícone (logo, sigla ou área), em tamanhos fixos.
- O app empacota só os desenhos dos logos usados.
- Um logo citado no conteúdo e ausente do conjunto quebra a suíte de testes.

**Non-Goals:**
- Logos em formato de imagem (PNG/SVG em arquivo) ou baixados da internet.
- Trocar o layout das telas além de encaixar o ícone.

## Decisions

### 1. Arquivo gerado com só os logos usados
`scripts/generate-tech-icons.mjs` lê os slugs citados em `content/taxonomy.json` e nos `content/tracks/*/track.json`. Para cada um, busca `title`, `hex` e `path` no pacote `simple-icons` e grava `src/content/techIcons.generated.ts`. Esse arquivo exporta `TECH_ICONS` (um mapa do slug para os dados) e `TECH_ICON_SLUGS`. O comando é `npm run tech-icons`.

Descartado:
- **Importar `simple-icons` no app.** São cerca de 3 mil ícones. O Metro não descarta código não usado de forma confiável, e o app ficaria vários MB maior.
- **Copiar os SVGs à mão.** Fica sujeito a erro, e fica difícil atualizar a versão da biblioteca.

### 2. Validação pelo próprio schema
`icon` usa `z.enum(TECH_ICON_SLUGS)` no `taxonomySchema` e no `trackSchema`, com a mensagem "logo desconhecido; rode npm run tech-icons". O teste que já valida o conteúdo do repositório passa a pegar um slug novo esquecido.

Descartado: um teste separado só para os slugs. Seria a mesma checagem em outro lugar, e o erro não sairia no relatório de validação de sempre.

### 3. Resolução pura em `src/content/icons.ts`
`trackIcon(track, taxonomy)` devolve `{ kind: 'logo', slug } | { kind: 'text', text } | { kind: 'area', area }`. Há também `languageIcon` e `frameworkIcon`. As telas não decidem nada, só repassam o resultado ao componente.

### 4. Componente `TechIcon`
O componente recebe `icon` e `size` (32, 40 ou 48). Desenha um quadrado com cantos arredondados, com lado igual ao `size`, e o conteúdo centralizado:
- **logo:** `<Svg viewBox="0 0 24 24"><Path d={path} fill={cor}/></Svg>`, ocupando 60% do quadrado, sobre `colors.bg`;
- **sigla:** texto em JetBrains Mono, na cor `colors.ink`, sobre `colors.bg`;
- **área:** o ícone de traço, na cor `colors.accentText`, sobre `colors.accentSoft`.

A cor do logo vem da função pura `logoColor(hex, scheme, colors)`:
- no escuro, se `contrastRatio(hex, colors.bg) < 3`, usa `colors.ink`;
- nos outros casos, usa `hex`.

O componente inteiro fica fora da árvore de acessibilidade: `accessible={false}`, `importantForAccessibility="no-hide-descendants"` e `accessibilityElementsHidden`.

### 5. Ícones das áreas em `icons.tsx`
Entram seis componentes de traço, um por área, com os desenhos aprovados no canvas: camadas, monitor, servidor, banco, celular e nuvem. Ficam no mapa `AREA_ICONS: Record<Area, Component>`.

### 6. Onde encaixa
- **`TrackCard` e `NavRow`:** o ícone de 40 px fica à esquerda do título (`NavRow` passa a receber `icon`).
- **`AreaCard`:** o ícone de 40 px fica à esquerda do nome.
- **Tela da trilha:** o ícone de 48 px fica acima do título.
- **Painel da aba Progresso:** o ícone de 32 px fica antes do título.

## Risks / Trade-offs

- **Uso de marcas registradas:** os logos são marcas dos seus donos. O Simple Icons é CC0, mas as marcas têm regras próprias. → Os logos são usados só para identificar a tecnologia (uso nominativo). Marcas que pediram remoção (Java, AWS) usam a alternativa (OpenJDK) ou a sigla.
- **Arquivo gerado desatualizado:** o arquivo gerado pode ficar sem um slug novo. → O schema falha no `npm test` com a instrução de rodar `npm run tech-icons`.
- **Logos claros pouco visíveis no modo claro:** no tema claro, logos como o do JavaScript (amarelo) têm pouco contraste com o fundo. → Ficam como estão, porque foi assim que o design foi aprovado. O ícone é decorativo, e o título continua ao lado.
