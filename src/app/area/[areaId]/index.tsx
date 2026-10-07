import { router, useLocalSearchParams } from 'expo-router';

import { FullScreen, Section } from '../../../components/FullScreen';
import { PathList } from '../../../components/PathList';
import { NavRow, TrackCard } from '../../../components/TrackCard';
import { repoTaxonomy } from '../../../content';
import { languageIcon } from '../../../content/icons';
import { areaPath, areaSections, isArea } from '../../../content/navigation';
import { useCatalog } from '../../../content/useCatalog';
import { useT } from '../../../i18n';

/** Área: trilhas diretas, linguagens com trilhas na área e comparativos. */
export default function AreaScreen() {
  const { areaId } = useLocalSearchParams<{ areaId: string }>();
  const t = useT();
  const catalog = useCatalog();
  const id = String(areaId);
  const area = isArea(id) ? id : undefined;
  const sections = area ? areaSections(catalog, repoTaxonomy, area) : undefined;
  const found =
    !!sections &&
    sections.direct.length + sections.grouped.length + sections.languages.length + sections.comparisons.length > 0;

  return (
    <FullScreen
      kicker={t.nav.areaKicker}
      title={found && area ? t.nav.areas[area] : undefined}
      missing={t.nav.areaNotFound}
    >
      {sections ? (
        <>
          <Section title={t.nav.sections.path}>
            {area ? [<PathList key="path" tracks={areaPath(catalog, area)} />] : []}
          </Section>
          <Section title={t.nav.sections.tracks}>
            {sections.direct.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </Section>
          {sections.grouped.map(({ section, tracks }) => (
            <Section key={section} title={t.nav.sections[section]}>
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </Section>
          ))}
          <Section title={t.nav.sections.languages}>
            {sections.languages.map(({ language, count }) => (
              <NavRow
                key={language.id}
                name={language.name}
                icon={languageIcon(language)}
                count={count}
                onPress={() => router.push(`/area/${area}/${language.id}`)}
              />
            ))}
          </Section>
          <Section title={t.nav.sections.comparisons}>
            {sections.comparisons.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </Section>
        </>
      ) : null}
    </FullScreen>
  );
}
