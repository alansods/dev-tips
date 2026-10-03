// Linha com o estado da sincronização (ícone de ok quando sincronizado).

import { View } from 'react-native';

import { AppText } from '../components/AppText';
import { CheckIcon } from '../components/icons';
import { useTheme } from '../theme/ThemeProvider';
import { useSyncStatus } from './useSyncStatus';

export function SyncStatusLine({ size = 12 }: { size?: number }) {
  const { colors } = useTheme();
  const view = useSyncStatus();
  const tone = view.tone === 'ok' ? 'accentText' : view.tone === 'error' || view.tone === 'waiting' ? 'warn' : 'muted';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {view.tone === 'ok' ? <CheckIcon color={colors.accentText} size={size + 2} /> : null}
      <AppText size={size} font={size > 13 ? 'semibold' : 'regular'} tone={tone}>
        {view.text}
      </AppText>
    </View>
  );
}
