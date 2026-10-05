## Context

Mesmo caminho das changes anteriores: formato, navegação, cadastro (`python`, `fastapi`, `django`), gerador de conteúdo e helper de testes já existem.

## Goals / Non-Goals

**Goals:**
- Cobrir o que entrevistas de backend Python cobram: mutabilidade e estruturas de dados, funções, decorators, generators, ambiente (venv, GIL, async), e os dois frameworks web principais.

**Non-Goals:**
- Repetir o CRUD em FastAPI, que já está na trilha comparativa. A trilha de FastAPI foca em Pydantic, dependências, async e segurança.

## Decisions

### 1. Mesmo formato, gerador e helper de testes
São 24 cards por trilha, com testes parametrizados (`describeContentTracks`) e conteúdo gerado pelo script de apoio.

### 2. Python 3.12 com type hints
Os exemplos usam type hints, f-strings, dataclasses e a sintaxe atual (`list[int]`, `X | None`).

### 3. Versões dos frameworks
FastAPI com Pydantic v2 (`model_config`, `model_dump`) e `Annotated` nas dependências. Django 5 com Django REST Framework.

### 4. Critério de nível
O mesmo das changes anteriores:
- **Júnior**: o que é e o uso básico.
- **Pleno**: usar bem e as armadilhas.
- **Sênior**: internals, trade-offs e arquitetura.

## Risks / Trade-offs

- [Exatidão técnica não é coberta por teste] → Revisão no PR, com a lista de cards por trilha.
