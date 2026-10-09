import { Screen } from '../../components/Screen';
import {
  ContinueSection,
  FirstAccess,
  Greeting,
  WhatsNewSection,
  ReviewSection,
  SuggestionsSection,
} from '../../home/HomeSections';
import { useStudyStore } from '../../study/store';

/** Aba Início: revisão do dia, continuar, sugestões e novas trilhas; boas-vindas no primeiro acesso. */
export default function HomeScreen() {
  const firstAccess = useStudyStore((s) => Object.keys(s.progress).length === 0);
  return (
    <Screen>
      {firstAccess ? (
        <FirstAccess />
      ) : (
        <>
          <Greeting />
          <ReviewSection />
          <ContinueSection />
          <SuggestionsSection />
          <WhatsNewSection />
        </>
      )}
    </Screen>
  );
}
