// Seção "Áreas de interesse" do Perfil: as mesmas opções do primeiro acesso.
import { View } from 'react-native';

import { InterestChips } from '../home/InterestChips';
import { useT } from '../i18n';
import { spacing } from '../theme/tokens';
import { SectionTitle } from './SectionTitle';

export function InterestsSection() {
  const t = useT();
  return (
    <View style={{ gap: spacing.sm }}>
      <SectionTitle>{t.settings.interests}</SectionTitle>
      <InterestChips />
    </View>
  );
}
