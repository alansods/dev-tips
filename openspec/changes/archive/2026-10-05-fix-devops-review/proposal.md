## Why

A revisão da change `add-mobile-and-devops-tracks` encontrou dois detalhes:

1. O cenário "Banco de dados por último" da Home ficou com um nome que engana, porque Banco de dados não é mais a última área. O cenário "Mobile e DevOps e Cloud no fim" já cobre a ordem completa.
2. O card "Por que fixar actions pelo SHA" recomenda SHA, mas os exemplos da trilha GitHub Actions usam tags, sem explicar a diferença.

## What Changes

- O cenário "Banco de dados por último" sai da capability `catalog-navigation`.
- A resposta do card `fixar-por-sha` (trilha GitHub Actions, PT-BR e inglês) ganha uma frase: os exemplos da trilha usam tags para facilitar a leitura, e em produção o ideal é o SHA.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `catalog-navigation`: remove o cenário redundante "Banco de dados por último" do requisito "Home por áreas".

## Impact

- `openspec/specs/catalog-navigation/spec.md` (ao arquivar).
- `content/tracks/github-actions/track.json` e `translations/en.json`, só o texto de um card.
- Sem mudança de código, de testes ou de dados salvos.

## Fora de escopo

- Trocar as tags dos snippets por SHA.
- Outras revisões de conteúdo das trilhas novas.
