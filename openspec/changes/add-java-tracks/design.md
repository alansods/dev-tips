## Context

Mesmo caminho das changes de JavaScript e TypeScript: formato, navegação, cadastro (`java`, `spring`), gerador de conteúdo e helper de testes (`describeContentTracks`) já existem.

## Goals / Non-Goals

**Goals:**
- Cobrir o que entrevistas de backend Java cobram: JVM e memória, orientação a objetos, `equals`/`hashCode`, coleções e streams, concorrência, e o Spring Boot (IoC, JPA, transações, Web, Security).

**Non-Goals:**
- Repetir o CRUD em Spring Boot: ele já está na trilha comparativa. A trilha de Spring Boot foca em como o framework funciona por dentro.

## Decisions

### 1. Mesmo formato, gerador e helper de testes
São 24 cards por trilha, e os testes são parametrizados com `describeContentTracks`. O conteúdo é gerado pelo script de apoio fora do repositório.

### 2. Java moderno (17 e 21)
Os cards usam records, `var`, switch expressions, pattern matching e virtual threads (Java 21) onde fizer sentido, e comentam o equivalente antigo quando ele ainda aparece em entrevista.

### 3. Spring Boot 3
Pacotes `jakarta.*`, injeção por construtor, `application.yml` e `SecurityFilterChain` como bean (sem o antigo `WebSecurityConfigurerAdapter`).

### 4. Critério de nível
O mesmo das changes anteriores:
- **Júnior**: o que é e o uso básico.
- **Pleno**: usar bem e as armadilhas.
- **Sênior**: internals, trade-offs e arquitetura.

## Risks / Trade-offs

- [Exatidão técnica não é coberta por teste] → Revisão no PR, com a lista de cards por trilha.
