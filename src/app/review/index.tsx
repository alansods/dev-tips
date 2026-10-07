import { router } from 'expo-router';

import { useCatalog } from '../../content/useCatalog';
import { useT } from '../../i18n';
import { today } from '../../study/clock';
import { dueCardIds } from '../../study/srs';
import { useStudyStore } from '../../study/store';
import { StudySession } from '../../study/StudySession';

function leaveToHome() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/** Revisão de hoje com os cards vencidos de todas as trilhas, aberta pelo Início. */
export default function ReviewAllScreen() {
  const t = useT();
  const catalog = useCatalog();
  return (
    <StudySession
      tracks={catalog}
      title={t.session.reviewTitle}
      entries={() => {
        const { schedule } = useStudyStore.getState();
        const day = today();
        return catalog.flatMap((track) =>
          dueCardIds(track, schedule, day).map((cardId) => ({ trackId: track.id, cardId })),
        );
      }}
      onExit={leaveToHome}
    />
  );
}
