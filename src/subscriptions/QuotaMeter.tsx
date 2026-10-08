// Medidor compacto da cota (linha "Dev Tips Pro" do Perfil): uso, barra e
// quantas perguntas restam, na cor de alerta quando a cota está acabando.

import { View } from 'react-native';

import { AppText } from '../components/AppText';
import { ProgressBar } from '../components/ProgressBar';
import { useT } from '../i18n';
import type { QuotaStatus } from './quota';

type Props = { quota: QuotaStatus; renewDate: string | null };

export function QuotaMeter({ quota, renewDate }: Props) {
  const t = useT();
  const alert = quota.level !== 'normal';
  const hint = quota.level === 'out' && renewDate ? t.pro.quotaOut(renewDate) : t.pro.questionsLeft(quota.left);
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AppText size={13} style={{ flex: 1 }}>
          {t.pro.questionsMonth}
        </AppText>
        <AppText font="mono" size={13} tone={quota.level === 'out' ? 'warn' : 'muted'}>
          {t.pro.usage(quota.used, quota.limit)}
        </AppText>
      </View>
      <ProgressBar testID="quota-bar" value={quota.ratio} height={8} tone={alert ? 'warn' : 'accent'} />
      <AppText size={13} font={alert ? 'semibold' : 'regular'} tone={alert ? 'warn' : 'muted'}>
        {hint}
      </AppText>
    </View>
  );
}
