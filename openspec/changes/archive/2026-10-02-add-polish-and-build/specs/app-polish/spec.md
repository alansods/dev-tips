## Purpose

Define o acabamento do app: a animação de virar o card, a identidade visual (ícone e splash), os alvos de toque mínimos e a configuração para gerar builds instaláveis.

## ADDED Requirements

### Requirement: Animação de virar o card
Ao mostrar o verso de um card, a sessão SHALL animar a troca, com a frente girando até sumir e o verso aparecendo, em até 300 ms. Quando o sistema estiver com "reduzir movimento" ativado, a troca SHALL ser imediata, sem animação. A animação MUST NOT atrasar nem bloquear os botões "Não sei" e "Sei", que aparecem assim que o verso é pedido.

#### Scenario: Duração da animação
- **WHEN** o usuário pede o verso com "reduzir movimento" desativado
- **THEN** a animação de virar dura entre 150 e 300 ms

#### Scenario: Reduzir movimento
- **WHEN** o usuário pede o verso com "reduzir movimento" ativado
- **THEN** o verso aparece sem animação (duração 0)

#### Scenario: Botões disponíveis durante a animação
- **WHEN** o usuário toca em "Mostrar resposta"
- **THEN** os botões "Não sei" e "Sei" ficam disponíveis imediatamente

### Requirement: Identidade visual
O app SHALL usar ícone e splash próprios, gerados a partir do mesmo desenho (cards empilhados com o acento do design), com estes requisitos:
- `assets/icon.png`: 1024×1024, sem transparência;
- ícone adaptativo do Android: frente com fundo transparente e desenho dentro da área segura, fundo sólido na cor `#0C1015` e versão monocromática;
- splash: desenho centralizado sobre o fundo `#0C1015`;
- `assets/favicon.png`: 48×48.

O nome exibido do app SHALL ser "Dev Tips".

#### Scenario: Ícone principal
- **WHEN** `assets/icon.png` é lido
- **THEN** é um PNG de 1024×1024 sem canal de transparência

#### Scenario: Configuração do app
- **WHEN** o `app.json` é lido
- **THEN** o nome é "Dev Tips", o fundo do ícone adaptativo é `#0C1015` e o plugin da splash usa a imagem do app com fundo `#0C1015`

#### Scenario: Ícones reproduzíveis
- **WHEN** o gerador de ícones roda duas vezes
- **THEN** os PNGs gerados são idênticos byte a byte

### Requirement: Alvos de toque mínimos
Todo elemento tocável SHALL ter área de toque de pelo menos 44×44 pt, somando o tamanho visual e a área extra de toque (`hitSlop`).

#### Scenario: Chips de termos relacionados
- **WHEN** um chip de termo relacionado é exibido
- **THEN** sua altura mínima somada ao `hitSlop` vertical é de pelo menos 44 pt

### Requirement: Configuração de build
O repositório SHALL ter um `eas.json` com os perfis `development` (development build, distribuição interna), `preview` (distribuição interna, APK no Android) e `production`. O `app.json` SHALL definir o identificador do app no iOS (`bundleIdentifier`) e no Android (`package`).

#### Scenario: Perfis de build
- **WHEN** o `eas.json` é lido
- **THEN** ele tem os perfis `development`, `preview` e `production`, e o `preview` gera APK no Android

#### Scenario: Identificadores do app
- **WHEN** o `app.json` é lido
- **THEN** `ios.bundleIdentifier` e `android.package` estão definidos com o mesmo identificador
