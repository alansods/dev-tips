## Context

O formato das trilhas, a navegação por área/linguagem/framework, as seções de trilhas diretas e o helper de testes (`describeContentTracks`) já existem. As áreas e as seções são listas fixas no código (`AREAS` e `SECTIONS` em `src/content/schema.ts`), com os nomes em i18n (`nav.areas` e `nav.sections`). As telas leem essas listas, então nenhuma tela muda.

## Goals / Non-Goals

**Goals:**
- Cobrir React Native no nível de entrevista: componentes nativos, estilo e layout, navegação com Expo Router, ciclo de build e publicação com EAS, e performance.
- Cobrir o caminho do código até a produção: o que é um pipeline, como montar um no GitHub Actions, os serviços básicos da AWS e as formas de fazer deploy neles.

**Non-Goals:**
- Ensinar a operar uma conta AWS a fundo (billing, Organizations, compliance). Aparece só o que costuma ser cobrado.
- Exemplos completos e executáveis de infraestrutura. Os snippets são trechos curtos que mostram a ideia.

## Decisions

### 1. Mobile por linguagem e framework
A trilha `react-native` declara `language: "javascript"` e `framework: "react-native"`, e o cadastro ganha o framework `react-native` em `javascript`, depois de `nest`. O caminho fica Mobile › JavaScript › React Native, igual a Frontend › JavaScript › React.
*Alternativa descartada:* deixar a trilha direta na área Mobile. Seria um toque a menos hoje, mas quebra o padrão das outras áreas e não comporta bem trilhas futuras (Flutter/Dart, Swift, Kotlin), que entrariam como novas linguagens.

### 2. DevOps e Cloud com trilhas diretas e seções
As 4 trilhas são diretas na área e usam o campo `section` já existente. `SECTIONS` passa a ser `['relacionais', 'nao-relacionais', 'ci-cd', 'aws']`. As seções de banco só aparecem na área de banco e as de DevOps só na área de DevOps, porque a tela só mostra seções com trilhas. A ordem fixa CI/CD antes de AWS vai do conceito (pipeline) para a plataforma.
*Alternativa descartada:* tratar "AWS" como linguagem e os serviços como frameworks. A navegação ficaria enganosa, pelo mesmo motivo que levou Banco de dados a usar trilhas diretas.

### 3. Ids curtos e nomes no i18n
Ids `mobile`, `devops`, `ci-cd` e `aws`, porque viram rota (`/area/devops`). Os nomes exibidos são "Mobile"/"Mobile", "DevOps e Cloud"/"DevOps & Cloud", "CI/CD" e "AWS" nos dois idiomas.

### 4. Exemplos de área inválida
Os cenários e testes que usavam `mobile` como área desconhecida passam a usar `games`, que continua fora da lista.

### 5. Snippets sem mudar o schema
- React Native: `ts` para componentes (o formato não tem `tsx`), `bash` para comandos e `json` para `app.json`/`eas.json`.
- DevOps: `yaml` para workflows e templates, `json` para políticas IAM, `bash` para AWS CLI, `ts` para AWS CDK e `text` para Dockerfile.

### 6. Versões e exatidão
Antes de escrever os cards, consultar a documentação atual (Context7 e a doc versionada do Expo) para React Native, Expo Router, EAS, GitHub Actions e os serviços AWS. Os cards citam conceitos estáveis (Nova Arquitetura, Hermes, OIDC, Fargate) e evitam números de versão que envelhecem rápido.

### 7. Critério de nível
O mesmo das changes anteriores:
- **Júnior**: o que é e o uso básico.
- **Pleno**: usar bem no dia a dia, as armadilhas comuns e a performance comum.
- **Sênior**: internals, trade-offs de arquitetura, sistemas distribuídos e operação em produção em escala.

### 8. Mesmo formato, gerador e helper de testes
24 cards por trilha, com testes parametrizados (`describeContentTracks`) e conteúdo escrito trilha a trilha no mesmo formato de JSON das trilhas existentes.

## Risks / Trade-offs

- [A área Mobile tem uma trilha só e exige três toques até ela] → Foi uma escolha consciente para manter o padrão. A área cresce sem mudar a estrutura.
- [Detalhes de Expo e AWS mudam rápido] → Os cards focam no conceito e nas boas práticas, não em flags e versões. Revisão no PR.
- [Exatidão técnica não é coberta por teste] → Revisão no PR, com a lista de cards por trilha.
- [O teste "Banco de dados por último" deixa de valer] → Ele vira o teste da nova ordem completa da Home.
