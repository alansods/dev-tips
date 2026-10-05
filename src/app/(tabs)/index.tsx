import { router } from 'expo-router';

import { Screen } from '../../components/Screen';
import { AreaCard } from '../../components/TrackCard';
import { areasWithTracks } from '../../content/navigation';
import { useCatalog } from '../../content/useCatalog';
import { useT } from '../../i18n';

/** Aba Trilhas: as áreas que têm trilhas, com o progresso somado de cada uma. */
export default function HomeScreen() {
  const t = useT();
  const areas = areasWithTracks(useCatalog());
  return (
    <Screen>
      {areas.map(({ area, tracks }) => (
        <AreaCard key={area} name={t.nav.areas[area]} tracks={tracks} onPress={() => router.push(`/area/${area}`)} />
      ))}
    </Screen>
  );
}
