## Context

- O login com o Google já cria a conta no primeiro acesso (spec `auth`, "Primeiro acesso"). Esta change só muda textos e acrescenta uma legenda.
- No paywall, o preço da loja vem de `monthlyPrice()` (`src/subscriptions/purchases.ts`). A função devolve `null` em três casos: sem chave do RevenueCat, sem offering/pacote mensal ou erro da loja. Hoje a tela guarda o preço num estado que começa em `null`, então "carregando" e "indisponível" ficam iguais.

## Goals / Non-Goals

**Goals:**
- Separar "carregando" de "indisponível" no paywall, sem mexer em `purchases.ts`.
- Deixar o botão do Google legível com o texto mais longo, inclusive em telas estreitas.

**Non-Goals:**
- Distinguir na tela os três motivos da indisponibilidade. Para o usuário, todos significam a mesma coisa.

## Decisions

1. **Estado do preço com três valores.** Em `paywall.tsx`, o estado passa a ser `string | null | undefined`: `undefined` enquanto carrega, `null` quando a loja não devolveu preço, e o texto do preço quando deu certo. O aviso só aparece com `null` no Android.
   - Alternativa descartada: um `useState<boolean>` separado para "carregou". Funcionaria, mas seriam dois estados que precisam ficar em sincronia; o `undefined` resolve com um só.
2. **O aviso usa o bloco `alert` que o paywall já tem** (o mesmo do erro de compra), com o tom de erro. Uma mensagem de compra ou restauração, quando existir, tem prioridade e aparece no lugar dele.
   - Alternativa descartada: trocar o texto do botão por "Indisponível". Um botão desabilitado com outro rótulo explica menos que uma frase, e o leitor de tela não anuncia a mudança.
3. **Legenda na tela de login** como um `AppText` pequeno e `muted`, centralizado logo abaixo do `GoogleButton`, seguindo o estilo do texto de consentimento que já existe.
4. **Texto do botão do Google pode quebrar linha.** "Entrar ou criar conta com o Google" tem 34 caracteres. Em telas de 360 dp ele pode não caber numa linha, então o rótulo do `GoogleButton` ganha `flexShrink: 1` e `textAlign: 'center'`. O botão já tem `minHeight` em vez de altura fixa.
   - Alternativa descartada: diminuir a fonte. Atrapalharia a leitura em todos os aparelhos para resolver só os estreitos.

## Risks / Trade-offs

- [Testes que procuram "Continuar com o Google" e "Entrar"] → atualizar esses testes junto com os textos; nada além dos testes depende desses nomes.
- [O aviso aparece também quando a loja oscila por falta de conexão] → aceitável: a frase diz "Tente de novo mais tarde", e reabrir o paywall busca o preço de novo.
