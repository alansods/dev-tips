import { StyleSheet, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

type Props = {
  /** Fração "já sabia", de 0 a 1. */
  value: number;
  /** Fração "não sabia", desenhada logo depois (opcional). */
  unknownValue?: number;
  height?: number;
  testID?: string;
};

const pct = (v: number) => `${Math.max(0, Math.min(1, v)) * 100}%` as const;

export function ProgressBar({ value, unknownValue = 0, height = 6, testID }: Props) {
  const { colors } = useTheme();
  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: colors.track }]}
    >
      <View style={{ width: pct(value), backgroundColor: colors.accent }} />
      {unknownValue > 0 && <View style={{ width: pct(unknownValue), backgroundColor: colors.warn }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', overflow: 'hidden', alignSelf: 'stretch' },
});
