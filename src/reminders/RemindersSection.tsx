import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { useT } from '../i18n';
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
      <AppText font="mono" size={11} tone="muted" style={styles.kicker}>
        {t.reminders.section}
      </AppText>
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
        {enabled &&
          REMINDER_TIMES.map((option) => {
            const selected = option === time;
            return (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityLabel={t.reminders.times[option]}
                accessibilityState={{ checked: selected }}
                onPress={() => setTime(option)}
                style={({ pressed }) => [styles.row, { borderTopWidth: 1, borderColor: colors.line, opacity: pressed ? 0.7 : 1 }]}
              >
                <AppText size={15} style={{ flex: 1 }}>
                  {t.reminders.times[option]}
                </AppText>
                <View style={[styles.dot, { borderColor: selected ? colors.accent : colors.line }]}>
                  {selected ? <View style={[styles.dotInner, { backgroundColor: colors.accent }]} /> : null}
                </View>
              </Pressable>
            );
          })}
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
  kicker: { textTransform: 'uppercase', letterSpacing: 0.8 },
  group: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: spacing.lg, gap: spacing.md },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dotInner: { width: 10, height: 10, borderRadius: 5 },
  denied: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm },
});
