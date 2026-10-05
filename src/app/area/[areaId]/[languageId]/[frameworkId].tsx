import { useLocalSearchParams } from 'expo-router';

import { FullScreen, Section } from '../../../../components/FullScreen';
import { TrackCard } from '../../../../components/TrackCard';
import { repoTaxonomy } from '../../../../content';
import { frameworkTracks, isArea } from '../../../../content/navigation';
import { useCatalog } from '../../../../content/useCatalog';
import { useT } from '../../../../i18n';

/** Framework dentro de Área › Linguagem: as trilhas dele. */
export default function FrameworkScreen() {
  const { areaId, languageId, frameworkId } = useLocalSearchParams<{
    areaId: string;
    languageId: string;
    frameworkId: string;
  }>();
  const t = useT();
  const catalog = useCatalog();
  const id = String(areaId);
  const area = isArea(id) ? id : undefined;
  const language = repoTaxonomy.languages.find((l) => l.id === languageId);
  const framework = repoTaxonomy.frameworks.find((f) => f.id === frameworkId && f.language === languageId);
  const tracks = area && language && framework ? frameworkTracks(catalog, area, language.id, framework.id) : [];

  return (
    <FullScreen
      kicker={area && language ? `${t.nav.areas[area]} › ${language.name}` : t.nav.areaKicker}
      title={tracks.length > 0 ? framework?.name : undefined}
      missing={t.nav.frameworkNotFound}
    >
      <Section title={t.nav.sections.tracks}>
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </Section>
    </FullScreen>
  );
}
