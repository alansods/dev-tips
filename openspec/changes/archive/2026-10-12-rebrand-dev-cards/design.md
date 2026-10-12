## Context

Os ícones e a splash em `assets/` não são desenhados à mão: saem de `scripts/generate-icons.js`, um rasterizador em Node puro (sem dependências) que pinta retângulos arredondados com supersampling e grava PNGs determinísticos. O teste `scripts/__tests__/icons.test.ts` roda o gerador e compara os pixels com os PNGs versionados. Hoje o gerador só sabe pintar retângulos arredondados **alinhados aos eixos**.

O novo desenho (validado no canvas de design) tem cards **inclinados** (+11° e −4°) e o símbolo `</>` feito de **traços** com ponta arredondada. Os nomes do app ficam nos arquivos de i18n e no `app.json`.

## Goals / Non-Goals

**Goals:**
- O gerador continua sendo a única fonte dos PNGs do app, agora com o desenho novo, e segue determinístico.
- O gerador também grava o ícone de 512×512 da loja, para que ele nunca fique diferente do ícone do app.

**Non-Goals:**
- Gerar por script o gráfico de recursos e as capturas de tela. São imagens de marketing com texto e fontes, exportadas uma vez do canvas e versionadas em `store/play/`.
- Trocar qualquer identificador técnico (ver proposal.md, Fora de escopo).

## Decisions

### 1. Ensinar o gerador a desenhar o ícone novo, em vez de copiar PNGs
O gerador ganha duas primitivas: **retângulo arredondado rotacionado** (o ponto testado é girado de volta em torno do pivô antes do teste que já existe) e **traço** (um segmento com espessura e ponta redonda, ou seja, uma "cápsula": o ponto está dentro se a distância até o segmento for no máximo metade da espessura).

- *Alternativa descartada: copiar os PNGs exportados do canvas pelo Chrome.* Isso quebraria o requisito "Ícones reproduzíveis" e o teste de pixels, e uma mudança futura de cor viraria trabalho manual.
- *Alternativa descartada: trocar o gerador por uma biblioteca de SVG (sharp ou resvg).* Seria uma dependência nativa nova só para o build de ícones. As duas primitivas cabem em poucas linhas.

### 2. Geometria no mesmo sistema de coordenadas do canvas
As formas são descritas numa caixa de 100×100, com os mesmos números do SVG aprovado: card de trás `x 28–72, y 24–78`, raio 7, cor `#7F96FF`, girado 11° em torno de (50, 51); card da frente com as mesmas medidas, branco, girado −4°; traços do `</>` com espessura 3,8 em `#2D4BE0`, girados junto com o card da frente. O gerador divide por 100 para chegar às coordenadas unitárias que já usa. Assim, o desenho do código é o mesmo do canvas.

### 3. Escala por arquivo
O campo `area` (fração do lado ocupada pelo desenho) continua existindo:
- `icon.png`, `favicon.png` e o ícone da loja: `area` 1, com fundo `#2D4BE0`, porque a caixa de 100 já tem a margem do desenho;
- frente e monocromático do adaptativo: `area` 0,64, para o card inteiro ficar dentro da área segura circular (61% do lado);
- `splash-icon.png`: transparente, `area` 0,8 como hoje.

Os tamanhos atuais continuam iguais (frente e fundo 512, monocromático 432), para não mexer no que o Expo já consome.

### 4. Monocromático
O card da frente fica branco opaco, o de trás branco com 50% de opacidade, e os traços do `</>` **apagam** o card, ficando transparentes. O mecanismo `erase` já existe e passa a valer também para traços. O Android usa só o canal alfa dessa camada.

### 5. Saída para a loja
`generateIcons(outDir)` continua gravando os arquivos do app. Uma segunda lista, gravada em `store/play/`, gera `play-icon-512.png` com o mesmo desenho. A pasta `store/icon/`, exportada do canvas, é removida: os arquivos de ícone do app vivem em `assets/`, gerados pelo script.

### 6. Textos
Só valores de i18n mudam (`auth.appName`, `pro.rowTitle`, `home.welcomeKicker` e o `title` dos lembretes, em pt-BR e en). As chaves continuam as mesmas, então nenhum componente muda.

## Risks / Trade-offs

- [O antialiasing do gerador difere do Chrome nas bordas] → O supersampling 3×3 que já existe dá bordas suaves. A comparação visual é feita uma vez, abrindo os PNGs gerados ao lado dos exportados do canvas.
- [O launcher pode guardar o ícone antigo em cache depois da atualização] → Some ao reiniciar o launcher ou reinstalar o app. Não há o que fazer no código.
- [A tela "Fazer login com Google" continua dizendo "Dev Tips" até alguém trocar o nome no Google Cloud] → Item manual na checklist. Se o app tiver passado pela verificação de marca do Google, a troca pode pedir uma nova verificação.
- [O nome "Dev Cards" já ser usado por outro app ou ser marca registrada] → Pesquisar na Play Store e no INPI antes de publicar. Fica na checklist manual.

## Migration Plan

1. Fazer o merge e gerar um build novo (`eas build --local`, perfil production) e enviá-lo à faixa de teste interno.
2. Fazer as trocas manuais: no Play Console, o nome do app, o ícone 512, o gráfico de recursos, as capturas de tela e o nome de exibição da assinatura; no Google Cloud, a tela de consentimento do OAuth.
3. Para voltar atrás, basta reverter o commit: nenhum identificador nem dado salvo muda.
