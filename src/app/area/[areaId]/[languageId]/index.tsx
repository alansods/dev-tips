import { router, useLocalSearchParams } from 'expo-router';

import { FullScreen, Section } from '../../../../components/FullScreen';
import { NavRow, TrackCard } from '../../../../components/TrackCard';
import { repoTaxonomy } from '../../../../content';
import { isArea, languageSections } from '../../../../content/navigation';
import { useCatalog } from '../../../../content/useCatalog';
import { useT } from '../../../../i18n';

/** Linguagem dentro de uma área: trilhas da linguagem pura e frameworks. */
export default function LanguageScreen() {
  const { areaId, languageId } = useLocalSearchParams<{ areaId: string; languageId: string }>();
  const t = useT();
  const catalog = useCatalog();
  const id = String(areaId);
  const area = isArea(id) ? id : undefined;
  const language = repoTaxonomy.languages.find((l) => l.id === languageId);
  const sections = area && language ? languageSections(catalog, repoTaxonomy, area, language.id) : undefined;
  const found = !!sections && sections.core.length + sections.frameworks.length > 0;

  return (
    <FullScreen
      kicker={area ? t.nav.areas[area] : t.nav.areaKicker}
      title={found ? language?.name : undefined}
      missing={t.nav.languageNotFound}
    >
      {sections && language ? (
        <>
          <Section title={t.nav.sections.core}>
            {sections.core.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </Section>
          <Section title={t.nav.sections.frameworks}>
            {sections.frameworks.map(({ framework, count }) => (
              <NavRow
                key={framework.id}
                name={framework.name}
                count={count}
                onPress={() => router.push(`/area/${area}/${language.id}/${framework.id}`)}
              />
            ))}
          </Section>
        </>
      ) : null}
    </FullScreen>
  );
}
