## Context

O schema é uma união discriminada com 5 tipos. O `CardFace` tem um switch exaustivo que quebra o typecheck se faltar um tipo. As regras de `relatedTerms` em `integrity.ts` valem para qualquer card. O `theme.json` do CRUD é protegido por testes de contagem e de fidelidade (que pulam `supplement`). Requisitos nos deltas desta change.

## Goals / Non-Goals

**Goals:** um tipo novo com o mínimo de mudança nas peças existentes, e respostas corretas e curtas, no tom do material (PT-BR simples, com ligação ao código do tema).

**Non-Goals:** perguntas em outros tipos de card.

## Decisions

### 1. Tipo próprio `question`
`questionCardSchema = { ...cardBase, type: 'question', question, answer, snippet?: snippetSchema }`.
- *Alternativa:* reaproveitar `concept`. Descartada porque o glossário é derivado dos `concept`, então as perguntas poluiriam o glossário e a busca.
- *Alternativa:* um campo `interviewQuestion` em todos os tipos. Descartada porque espalha a mudança por todos os componentes, e as perguntas não pertencem a um card específico.

### 2. Apresentação
- **Frente:** a pergunta como título e o convite "Responda em voz alta antes de virar.", que treina a resposta falada, como numa entrevista.
- **Verso:** a pergunta (menor), a resposta e o `CodeBlock`, quando houver snippet.
- O rótulo do tipo no chip é "Entrevista".

### 3. Conteúdo
Escrito à mão direto no `theme.json`, mantendo a formatação do arquivo (indentação de 2 espaços). Cada resposta cita, quando faz sentido, o passo do tema que ilustra o conceito (ex.: PUT no Passo 10, `$1` no Passo 9, `ddl-auto`/`synchronize` no Passo 3). Os nomes de ferramentas por framework seguem as stacks do tema: JPA/Spring, TypeORM/Nest, SQLAlchemy/FastAPI e pg/Express.

### 4. Testes afetados
- O teste de contagem do tema e o cenário "Com progresso" (73 cards) mudam junto com a spec.
- Testes que calculam o total dinamicamente não mudam.

## Risks / Trade-offs

- [Resposta técnica imprecisa] → Revisei cada resposta contra o comportamento padrão das ferramentas citadas. São respostas modelo curtas, não documentação exaustiva.
- [O deck novo mudar a porcentagem de quem já tem progresso salvo] → É esperado: o total do tema cresceu. O progresso salvo continua válido, porque os ids existentes não mudam.
