## MODIFIED Requirements

### Requirement: Resumo do estudo no Perfil
A seção "Seu estudo" da aba Perfil SHALL mostrar três números com os rótulos:
- "dias seguidos": a sequência do requisito "Dias estudados";
- "cards que sei": os cards marcados como "já sabia", somados em todo o catálogo;
- "trilhas iniciadas": as trilhas com pelo menos um card respondido.

#### Scenario: Sem estudo
- **WHEN** o usuário nunca respondeu um card
- **THEN** o resumo mostra 0 dias seguidos, 0 cards que sei e 0 trilhas iniciadas

#### Scenario: Com estudo
- **WHEN** o usuário estudou hoje e ontem, marcou 4 cards da trilha CRUD como "já sabia" e 1 card de Fundamentos web como "não sabia"
- **THEN** o resumo mostra 2 dias seguidos, 4 cards que sei e 2 trilhas iniciadas
