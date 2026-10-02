import { AppText } from './AppText';
import { Screen } from './Screen';

/** Tela provisória para abas cuja change ainda não foi implementada. O título fica no cabeçalho da aba. */
export function PlaceholderScreen({ upcoming }: { upcoming: string }) {
  return (
    <Screen>
      <AppText tone="muted">Esta tela ainda está em construção.</AppText>
      <AppText tone="muted">Em breve: {upcoming}</AppText>
    </Screen>
  );
}
