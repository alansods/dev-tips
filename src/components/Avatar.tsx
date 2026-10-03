import { Image, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

/** Foto da conta, ou a inicial do nome quando não há foto. */
export function Avatar({ name, photoUrl, size = 44 }: { name: string | null; photoUrl: string | null; size?: number }) {
  const { colors } = useTheme();
  const box = { width: size, height: size, borderRadius: size / 2 };
  if (photoUrl) return <Image source={{ uri: photoUrl }} style={box} accessibilityIgnoresInvertColors />;
  return (
    <View style={[box, { backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }]}>
      <AppText font="semibold" size={size * 0.4} tone="accentText">
        {(name ?? '?').trim().charAt(0).toUpperCase() || '?'}
      </AppText>
    </View>
  );
}
