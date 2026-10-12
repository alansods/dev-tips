## MODIFIED Requirements

### Requirement: Simulações do catálogo
O catálogo SHALL ter exatamente estas 7 simulações (`kind: "simulation"`), registradas depois de todas as trilhas, nesta ordem, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Cards | addedAt |
|---|---|---|---|
| `sim-dashboard-lento` | Dashboard lento: de 8 s para menos de 2 | 5 | 2026-10-09 |
| `sim-pedidos-duplicados` | Pedido e pagamento em dobro | 4 | 2026-10-09 |
| `sim-projetos-e-permissoes` | Projetos, membros e permissões | 4 | 2026-10-09 |
| `sim-arquivos-em-segundo-plano` | Processamento de arquivos em segundo plano | 4 | 2026-10-09 |
| `sim-funcionalidade-com-ia` | Resumos de PDF com IA | 4 | 2026-10-09 |
| `sim-api-de-notificacoes` | API de notificações | 4 | 2026-10-09 |
| `sim-cep-com-fallback` | CEP com três APIs | 5 | 2026-10-12 |

São 30 cards. O deck de cada simulação SHALL ter id `conversa` e título "Conversa". Cada simulação SHALL declarar o `addedAt` da tabela.

#### Scenario: Simulações na ordem
- **WHEN** o catálogo é carregado
- **THEN** as 7 últimas entradas são as simulações da tabela, nessa ordem, e nenhuma outra entrada é simulação

#### Scenario: Quantidade de cards
- **WHEN** as simulações são lidas
- **THEN** cada uma tem um deck `conversa` com a quantidade de cards da tabela, 30 no total

### Requirement: Qualidade das simulações
Todo card das simulações SHALL:
- ter `origin: "original"`;
- ter nível `pleno` ou `senior`;
- ter pelo menos um entre `why` e `watchOut`;
- usar só snippets nas linguagens `sql`, `text` ou `ts`; fluxos e tabelas viram snippets `text`.

As simulações SHALL ter exatamente 7 cards `senior`: `timeout-no-provedor`, `evoluir-a-arquitetura`, `banco-e-fila`, `provar-o-valor`, `notificacoes-duplicadas`, `cancelar-e-timeout` e `mover-para-o-backend`. As respostas-modelo SHALL ficar em primeira pessoa, como uma fala na entrevista.

#### Scenario: Origem e níveis
- **WHEN** os cards das simulações são lidos
- **THEN** todos têm `origin: "original"`, nível `pleno` ou `senior`, e os `senior` são exatamente os 7 listados

#### Scenario: Verso com explicação
- **WHEN** os cards das simulações são lidos
- **THEN** cada um tem `why` ou `watchOut`

#### Scenario: Linguagens dos snippets
- **WHEN** os snippets das simulações são lidos
- **THEN** todos usam `sql`, `text` ou `ts`

## ADDED Requirements

### Requirement: Simulação de CEP com três APIs
A simulação `sim-cep-com-fallback` SHALL apresentar um checkout que preenche o endereço pelo CEP com uma API pública que às vezes cai ou fica lenta, havendo outras duas APIs de CEP disponíveis. A stack SHALL citar React Native, Node.js e as APIs ViaCEP, BrasilAPI e AwesomeAPI. O deck `conversa` SHALL ter, nesta ordem, os cards:

| id | nível | assunto da pergunta |
|---|---|---|
| `tres-apis-de-cep` | pleno | usar as três APIs para o endereço não depender de uma só |
| `race-ou-any` | pleno | por que `Promise.race` não resolve o problema e `Promise.any` sim |
| `cep-inexistente` | pleno | uma API responde 200 com `{"erro": true}` para um CEP que não existe |
| `cancelar-e-timeout` | senior | uma das APIs fica pendurada por 30 s e as requisições perdedoras continuam abertas |
| `mover-para-o-backend` | senior | com tráfego alto, as APIs passam a responder 429 |

A resposta de `tres-apis-de-cep` SHALL ter um snippet `ts` que consulta as três APIs, converte as respostas para um formato único e usa `Promise.any`.

#### Scenario: Cards na ordem
- **WHEN** a simulação `sim-cep-com-fallback` é carregada
- **THEN** o deck `conversa` tem os 5 cards da tabela, nessa ordem e com esses níveis

#### Scenario: Pergunta com a nova condição
- **WHEN** o card `cep-inexistente` é lido
- **THEN** a pergunta cita a resposta 200 com `"erro": true`

#### Scenario: Snippet de fallback
- **WHEN** o card `tres-apis-de-cep` é lido
- **THEN** ele tem um snippet `ts` que contém `Promise.any`

#### Scenario: Simulação em inglês
- **WHEN** o app está em inglês e o usuário abre a área Situações-problema
- **THEN** a última simulação aparece como "CEP lookup with three APIs"
