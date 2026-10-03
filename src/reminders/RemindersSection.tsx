import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { useT } from '../i18n';
import { SectionTitle } from '../settings/SectionTitle';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { ensurePermission, openSystemSettings } from './notifications';
import { REMINDER_TIMES } from './plan';
import { useRemindersStore } from './store';

/** Seção "Lembretes" da tela Ajustes. Não aparece na web. */
export function RemindersSection() {
  const { colors } = useTheme();
  const t = useT();
  const { enabled, time, permissionDenied, setEnabled, setTime, setPermissionDenied } = useRemindersStore();

  if (Platform.OS === 'web') return null;

  const onToggle = async (on: boolean) => {
    if (!on) {
      setEnabled(false);
      return;
    }
    if (await ensurePermission()) setEnabled(true);
    else setPermissionDenied(true);
  };

  return (
    <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
      <SectionTitle>{t.reminders.section}</SectionTitle>
      <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <View style={styles.row}>
          <AppText size={15} style={{ flex: 1 }}>
            {t.reminders.toggle}
          </AppText>
          <Switch
            accessibilityLabel={t.reminders.toggle}
            value={enabled}
            onValueChange={(on) => void onToggle(on)}
            trackColor={{ true: colors.accent, false: colors.track }}
          />
        </View>
        {enabled && (
          <View accessibilityRole="radiogroup" style={styles.times}>
            {REMINDER_TIMES.map((option) => {
              const selected = option === time;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  accessibilityLabel={t.reminders.times[option]}
                  accessibilityState={{ checked: selected }}
                  onPress={() => setTime(option)}
                  style={({ pressed }) => [
                    styles.time,
                    selected
                      ? { borderColor: colors.accent, borderWidth: 1.5, backgroundColor: colors.accentSoft }
                      : { borderColor: colors.line, backgroundColor: colors.surface },
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <AppText size={13} font={selected ? 'semibold' : 'regular'} tone={selected ? 'accentText' : 'ink'}>
                    {t.reminders.timeNames[option]}
                  </AppText>
                  <AppText font="mono" size={12} tone={selected ? 'accentText' : 'muted'}>
                    {option}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
      {permissionDenied && !enabled ? (
        <View style={[styles.denied, { backgroundColor: colors.warnSoft, borderColor: colors.warn }]}>
          <AppText size={14}>{t.reminders.denied}</AppText>
          <View style={{ flexDirection: 'row' }}>
            <Button title={t.reminders.openSettings} variant="secondary" onPress={openSystemSettings} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: spacing.lg, gap: spacing.md },
  times: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  time: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  denied: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm },
});
