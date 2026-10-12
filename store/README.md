# Imagens do app e da loja

Imagens da página do app na Play Store. A fonte editável do gráfico de recursos e das capturas de tela é o canvas de design: https://claude.ai/artifact/9zkVFbuFaAnD58b4Bnyenz

## Ícones do app

Ficam em `assets/` e saem de `scripts/generate-icons.js` (`node scripts/generate-icons.js`), que também grava `play/play-icon-512.png`. Não edite esses PNGs à mão: mude o gerador e rode de novo.

## `play/` → enviados no Play Console (Presença na loja › Página principal)

| Arquivo                                 | Tamanho   | Campo                        |
| --------------------------------------- | --------- | ---------------------------- |
| `play-icon-512.png`                     | 512×512   | Ícone do app                 |
| `feature-graphic.png`                   | 1024×500  | Recurso gráfico              |
| `screenshot-1.png` … `screenshot-6.png` | 1080×1920 | Capturas de tela do telefone |
