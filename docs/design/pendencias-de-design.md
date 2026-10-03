# Pendências de design

Tudo o que falta desenhar para o login (Google e Apple), a conta e os estados gerais do app, com recomendações para cada tela. Inclui as telas que já foram implementadas sem design (Ajustes e Lembretes).

## Diretrizes gerais

- **Visual atual:** fundo frio, acento azul (`#2D4BE0` no claro, `#8296FF` no escuro), laranja para "revisar", fontes IBM Plex Sans e JetBrains Mono.
- **Claro e escuro:** cada tela nos dois temas.
- **Dois idiomas:** os textos em inglês têm tamanhos diferentes dos em português. Teste os botões nas duas versões (por exemplo, "Não sabia" e "I didn't know").
- **Tela estreita:** validar em 320 pt de largura (iPhone SE).
- **Toque:** áreas de toque de no mínimo 44 pt.

## Prioridade

1. Telas 3 a 10 (login e conta): bloqueiam a change `add-auth`.
2. Telas 1, 2, 15 e 16 (Ajustes completo e política de privacidade).
3. Telas 11 a 14 (estados gerais).
4. Opcionais (17 a 19).

## 1. Telas já implementadas, sem design

| #   | Tela                | O que tem hoje                                                                                                                   | Recomendação                                                                                                        |
| --- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | **Ajustes**         | Cabeçalho com "Voltar", seção Idioma (2 opções de rádio) e seção Lembretes                                                       | Desenhar a tela inteira com as seções que vão entrar: **Conta** (no topo), Idioma, Lembretes e **Sobre** (no final) |
| 2   | **Seção Lembretes** | Interruptor "Lembrete diário", 3 horários (só aparecem com ele ligado) e o aviso de permissão negada com o botão "Abrir ajustes" | 3 estados: desligado, ligado com o horário escolhido e permissão negada (o aviso pode usar o laranja de alerta)     |

## 2. Conta e login (Google e Apple)

| #   | Tela ou estado                     | Recomendação                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3   | **Login / boas-vindas**            | Logo e uma frase curta sobre o benefício ("Salve seu progresso e estude em qualquer aparelho"). Botões **"Continuar com Google"** e **"Continuar com Apple"** (este só no iOS) e o link **"Continuar sem conta"**, com o mesmo destaque, já que o login é opcional. Usar os botões oficiais: as diretrizes de marca do Google e da Apple exigem logo, cores e texto padronizados. Link para a política de privacidade no rodapé |
| 4   | **Conta em Ajustes, desconectado** | Card com uma chamada ("Salve seu progresso na nuvem") e o botão "Entrar", que abre a tela 3                                                                                                                                                                                                                                                                                                                                     |
| 5   | **Conta em Ajustes, conectado**    | Linha com foto, nome e e-mail; ao tocar, abre a tela 6                                                                                                                                                                                                                                                                                                                                                                          |
| 6   | **Tela Conta**                     | Foto, nome, e-mail, estado da sincronização ("Sincronizado agora há pouco", "Sincronizando…" ou "Aguardando conexão"), botão **"Sair"** e, no final e separado, **"Apagar conta"** em cor destrutiva                                                                                                                                                                                                                            |
| 7   | **Confirmar "Sair"**               | Confirmação simples, explicando que o progresso continua no aparelho                                                                                                                                                                                                                                                                                                                                                            |
| 8   | **Confirmar "Apagar conta"**       | **Exigida pelas lojas.** Dizer que os dados na nuvem são apagados para sempre e o progresso no aparelho continua. Botão destrutivo com texto explícito ("Apagar minha conta") e "Cancelar" em destaque. Pode ser na própria tela, como a confirmação de "Zerar progresso"                                                                                                                                                       |
| 9   | **Carregando o login**             | Indicador no próprio botão (spinner e botão desabilitado), sem tela de carregamento cheia                                                                                                                                                                                                                                                                                                                                       |
| 10  | **Erros de login**                 | **Cancelado pelo usuário:** volta em silêncio. **Sem internet:** "Sem conexão. Tente de novo quando estiver online." **Erro do servidor:** "Não foi possível entrar agora. Tente de novo." Aviso na própria tela, não uma tela de erro                                                                                                                                                                                          |

## 3. Estados gerais do app

| #   | Tela ou estado                  | Recomendação                                                                                                                                           |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 11  | **Erro inesperado**             | Ilustração ou ícone simples, "Algo deu errado", botão **"Tentar de novo"** e link "Voltar ao início". Sem detalhes técnicos                            |
| 12  | **Página não encontrada (404)** | Por exemplo, uma notificação antiga que aponta para um tema removido. "Não encontramos esta página" e o botão "Ir para Temas"                          |
| 13  | **Aviso de sem conexão**        | Aviso discreto no topo ou no rodapé ("Offline: seu progresso será enviado depois"), que some ao reconectar. Não bloquear o uso: o app funciona offline |
| 14  | **Primeira sincronização**      | Depois do primeiro login, uma mensagem curta ("Seu progresso foi salvo na conta")                                                                      |

## 4. Sobre e legal

A política de privacidade é **obrigatória**: o Google pede o link dela para liberar o login, e a App Store e o Google Play exigem o link para publicar, inclusive acessível dentro do app.

| #   | Tela                         | Recomendação                                                                                                                                                                                                                                                  |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 15  | **Seção Sobre (em Ajustes)** | No final de Ajustes: versão do app, link para a **Política de privacidade** e, opcionalmente, **Termos de uso** e "Enviar feedback"                                                                                                                           |
| 16  | **Política de privacidade**  | Página web simples, não uma tela do app. Dizer quais dados são guardados (e-mail, nome, progresso de estudo), para quê e como apagar a conta. O link aparece na seção Sobre (15) e no rodapé da tela de login (3), e é cadastrado no Google Cloud e nas lojas |

## 5. Opcionais

| #   | Tela                            | Recomendação                                                                                                                               |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 17  | **Splash screen**               | Já existe (ícone sobre o fundo `#0C1015`). Redesenhar só para mudar a identidade                                                           |
| 18  | **Ícone do app**                | Já existe, gerado por `scripts/generate-icons.js`. Mesmo critério da splash                                                                |
| 19  | **Boas-vindas no primeiro uso** | 2 ou 3 telas explicando o app (temas → cards → revisão), terminando na tela de login (3) com "Continuar sem conta". Pode ficar para depois |

## Fora da lista, de propósito

- **Cadastro e "Esqueci a senha":** o login é só com Google e Apple.
- **"Meu perfil":** nada é editável (nome, e-mail e foto vêm do Google ou da Apple), as ações da conta ficam na tela Conta (6) e as estatísticas ficam na aba Progresso. Um perfil próprio só faria sentido com recursos sociais (ranking, compartilhamento) ou estatísticas que não cabem em Progresso.
- **Uma tela "Configurações" separada:** é a própria tela Ajustes (1).
