## MODIFIED Requirements

### Requirement: Identidade visual
O app SHALL usar ícone e splash próprios, gerados a partir do mesmo desenho (um card branco com o símbolo de código `</>` em azul `#2D4BE0`, levemente inclinado, sobre um segundo card azul-claro inclinado para o outro lado), com estes requisitos:
- `assets/icon.png`: 1024×1024, sem transparência, com fundo `#2D4BE0`;
- ícone adaptativo do Android: frente com fundo transparente e desenho dentro da área segura, fundo sólido na cor `#2D4BE0` e versão monocromática;
- splash: desenho centralizado sobre o fundo `#0C1015`;
- `assets/favicon.png`: 48×48;
- ícone da página da loja: `store/play/play-icon-512.png`, 512×512, sem transparência, com fundo `#2D4BE0`.

O nome exibido do app SHALL ser "Dev Cards".

#### Scenario: Ícone principal
- **WHEN** `assets/icon.png` é lido
- **THEN** é um PNG de 1024×1024 sem canal de transparência, e o pixel do canto superior esquerdo é `#2D4BE0`

#### Scenario: Desenho do card
- **WHEN** `assets/icon.png` é lido
- **THEN** o pixel do centro do card da frente é branco e o fundo fora dos cards é `#2D4BE0`

#### Scenario: Ícone da loja
- **WHEN** `store/play/play-icon-512.png` é lido
- **THEN** é um PNG de 512×512 sem canal de transparência, com o mesmo desenho do ícone principal

#### Scenario: Configuração do app
- **WHEN** o `app.json` é lido
- **THEN** o nome é "Dev Cards", o fundo do ícone adaptativo é `#2D4BE0` e o plugin da splash usa a imagem do app com fundo `#0C1015`

#### Scenario: Ícones reproduzíveis
- **WHEN** o gerador de ícones roda duas vezes
- **THEN** os PNGs gerados são idênticos byte a byte
