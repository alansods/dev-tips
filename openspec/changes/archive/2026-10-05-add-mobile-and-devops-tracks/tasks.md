## 1. Áreas, seções e cadastro

- [x] 1.1 Testes falhando: "Áreas de mobile e DevOps", "Seções de DevOps" e "Área desconhecida" com `games` (`taxonomy.test.ts`); "Área não encontrada" com `games`, "Mobile e DevOps e Cloud no fim", "Seções CI/CD e AWS" e "Área DevOps em inglês" (testes de navegação); framework `react-native` em `javascript` no cadastro
- [x] 1.2 `mobile` e `devops` em `AREAS`, `ci-cd` e `aws` em `SECTIONS`, e os nomes em `pt-BR.ts` e `en.ts`
- [x] 1.3 Framework `react-native` em `content/taxonomy.json`, depois de `nest`
- [x] 1.4 Testes do item 1 passando (o teste "Banco de dados por último" passa a conferir a nova ordem da Home)

## 2. Trilha de React Native

- [x] 2.1 Testes falhando em `src/content/__tests__/mobile-tracks.test.ts` (com `describeContentTracks`) e `src/__tests__/mobile-navigation.test.tsx`
- [x] 2.2 Consultar a doc atual de React Native, Expo Router e EAS
- [x] 2.3 Trilha `react-native` (PT-BR e en)
- [x] 2.4 Registrar a trilha e a tradução
- [x] 2.5 Testes de conteúdo, cobertura de tradução e telas passando

## 3. Trilhas de DevOps e Cloud

- [x] 3.1 Testes falhando em `src/content/__tests__/devops-tracks.test.ts` (com `describeContentTracks`) e `src/__tests__/devops-navigation.test.tsx`
- [x] 3.2 Consultar a doc atual de GitHub Actions e dos serviços AWS usados
- [x] 3.3 CI/CD essencial e GitHub Actions (PT-BR e en)
- [x] 3.4 AWS essencial e Deploy na AWS (PT-BR e en)
- [x] 3.5 Registrar as 4 trilhas e as traduções
- [x] 3.6 Testes de conteúdo, cobertura de tradução e telas passando

## 4. Fechamento

- [x] 4.1 README e `openspec/config.yaml`: áreas novas e lista de trilhas
- [x] 4.2 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
