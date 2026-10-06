# Ideias futuras

Ideias que ainda não viraram change do OpenSpec. Cada uma, quando for priorizada, segue o fluxo normal: proposta → spec → testes → código.

## 1. Temas e cards criados pelo usuário, completados por IA

### O problema

Durante o estudo, no trabalho ou numa entrevista, a pessoa lembra de um conceito que ainda não existe no app ("o que era mesmo idempotência?", "preciso revisar índices compostos") e quer guardá-lo para não esquecer. Hoje o conteúdo é fixo: ela não tem onde anotar.

### A ideia

A pessoa escreve só a ideia, em poucas palavras, e a IA completa o resto no formato do app. O card criado entra na repetição espaçada como qualquer outro.

**Fluxo:**

1. Botão "Criar card" (ou "Criar tema"), disponível na aba Temas e dentro de um tema criado pelo usuário.
2. A pessoa digita a ideia, por exemplo "diferença entre PUT e PATCH" ou "tema: Docker para iniciantes".
3. A IA gera os detalhes:
   - **card:** escolhe o tipo (conceito, pergunta de entrevista, código…) e preenche frente, verso, exemplo de código e termos relacionados;
   - **tema:** propõe título, descrição, decks e os primeiros cards.
4. A pessoa revisa, edita o que quiser e salva. Nada é salvo sem passar por ela.
5. O card passa a aparecer nas sessões e na revisão de hoje, com as mesmas regras de "já sabia" e "não sabia".

### Onde aparece

- Uma seção própria na aba Temas: **"Criados por você"**, separada dos temas oficiais.
- Por padrão, os temas criados são **privados**: só quem criou vê.

### Compartilhar e avaliar

- Quem criou pode **compartilhar** um tema, por link ou numa área pública "Da comunidade", e pode deixar de compartilhar quando quiser.
- Outras pessoas podem adicionar o tema compartilhado à própria lista e **avaliá-lo** (por exemplo, de 1 a 5 estrelas, ou "útil / não útil").
- A avaliação ajuda a ordenar a área "Da comunidade" e a destacar os melhores temas.

### Do que depende

- **Login e sincronização** (changes `add-auth` e `add-cloud-sync`): o conteúdo do usuário precisa ficar na conta, e não só no aparelho.
- **API:** novas tabelas para temas, decks e cards do usuário, visibilidade (privado ou compartilhado) e avaliações.
- **Modelo de conteúdo:** os cards gerados passam pelo mesmo schema da capability `content-model`, o que garante que o app consegue exibi-los.

### Como a IA poderia funcionar

- A chamada ao modelo de IA fica **na API** (o Worker), nunca no app: a chave do provedor de IA não pode ir para dentro do aplicativo.
- O modelo recebe a ideia e a instrução de responder no formato JSON do schema de cards. A API valida a resposta com o mesmo schema antes de devolvê-la ao app.
- Um modelo pequeno e barato costuma bastar para esse tipo de geração. O custo é por uso, então vale um limite de gerações por usuário e por dia.

### Perguntas em aberto

- **Moderação:** conteúdo compartilhado precisa de algum filtro (denúncia, revisão, filtro automático) para não virar spam ou conteúdo impróprio.
- **Qualidade:** a IA pode errar um conceito técnico. Vale marcar os cards como "gerado por IA" e permitir que quem usa aponte erros.
- **Custos:** definir o limite grátis de gerações e se haverá um plano pago no futuro.
- **Direitos e privacidade:** a política de privacidade precisa mencionar que o texto digitado é enviado a um provedor de IA.
- **Idioma:** gerar no idioma do app (PT-BR ou inglês) e, opcionalmente, nos dois.

## 2. Trilha personalizada para uma vaga

### O problema

Quem se prepara para uma vaga não sabe quais conceitos dos requisitos ainda não domina, nem por onde começar. A descrição da vaga lista ferramentas e práticas (por exemplo React, Expo, Zustand, Jest, CI/CD), mas o app só oferece as trilhas do catálogo, organizadas por assunto e não pela vaga.

### A ideia

A pessoa cola a descrição e os requisitos da vaga, e a IA monta uma trilha de estudo personalizada para ela, com cards para aprender e revisar os conceitos que a vaga pede.

**Fluxo:**

1. Botão "Preparar para uma vaga", na aba Trilhas.
2. A pessoa cola o texto da vaga (descrição, responsabilidades e requisitos).
3. A IA extrai os requisitos e cruza com o catálogo:
   - o que já existe vira atalho para os decks oficiais (por exemplo, "Testes no frontend › Testing Library");
   - o que falta vira uma trilha privada, com um deck por requisito e um deck de perguntas de entrevista no nível da vaga (júnior, pleno ou sênior).
4. A pessoa revisa, tira ou adiciona requisitos e salva. Nada é salvo sem passar por ela.
5. Os cards entram na repetição espaçada como qualquer outro.

**Extra:** um painel de prontidão para a vaga, com a porcentagem de cada requisito já estudado ou dominado, e a data da entrevista para o app sugerir quanto revisar por dia.

### Onde aparece

- Na seção "Criados por você" (ideia 1), com o nome da vaga e da empresa.
- Privada por padrão. Depois da entrevista, a pessoa pode arquivar a trilha e manter os cards que quiser.

### Do que depende

- **Ideia 1:** a mesma base de trilhas e cards do usuário gerados por IA na API e validados pelo schema da capability `content-model`.
- **Login e sincronização:** a trilha fica na conta.
- **Plano Pro:** cada geração custa uma chamada ao modelo de IA; a funcionalidade pode ficar no plano pago ou ter um limite grátis por mês.

### Perguntas em aberto

- **Privacidade:** o texto da vaga é enviado a um provedor de IA; a política de privacidade precisa dizer isso.
- **Qualidade:** a IA pode interpretar errado um requisito ou gerar um card com erro técnico. Marcar os cards como "gerado por IA" e deixar a pessoa corrigir.
- **Custos:** limite de gerações por vaga e por mês, e reaproveitar os decks oficiais sempre que existirem, para gerar menos.
- **Vaga desatualizada:** o que fazer com a trilha depois da entrevista (arquivar, manter só os cards errados, apagar).

## 3. Outras ideias já levantadas

- **Login com Apple:** a App Store exige "Sign in with Apple" em apps com login social. Precisa da conta paga de desenvolvedor Apple; entra numa change própria antes de publicar no iOS. A tabela `users` já tem a coluna `provider` pensando nisso.

- **Novo nome para o app:** opções discutidas: DevDeck, DevCards, Recall, Commit, Stack Cards e Revisa.dev. Antes de decidir, conferir a disponibilidade nas lojas, no domínio e no registro de marca. A troca mexe no `app.json`, no ícone, nos textos e nas specs.
- **Perfil, ranking e compartilhamento de progresso:** só fazem sentido com recursos sociais, que podem nascer junto com a área "Da comunidade" acima.
- **Estatísticas pessoais:** sequência de dias estudados e total de cards revisados.
- **Boas-vindas no primeiro uso:** 2 ou 3 telas explicando temas, cards e revisão (opcional no design).
- **API em NestJS:** alternativa documentada em [backend/alternativa-nestjs-render-monorepo.md](backend/alternativa-nestjs-render-monorepo.md), para quando o projeto precisar de um servidor Node tradicional.
