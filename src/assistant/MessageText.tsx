// Texto de uma mensagem do chat: trechos entre três crases viram bloco de
// código (fonte mono, fundo escuro); o resto é texto normal.

import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';

type Part = { kind: 'text' | 'code'; value: string };

/** Separa o texto pelas cercas de código (```lang ... ```). */
export function splitCode(text: string): Part[] {
  const parts: Part[] = [];
  const fence = /```[\w-]*\n?([\s\S]*?)```/g;
  let last = 0;
  for (const match of text.matchAll(fence)) {
    const before = text.slice(last, match.index).trim();
    if (before) parts.push({ kind: 'text', value: before });
    parts.push({ kind: 'code', value: match[1].replace(/\n$/, '') });
    last = match.index + match[0].length;
  }
  const rest = text.slice(last).trim();
  if (rest) parts.push({ kind: 'text', value: rest });
  return parts;
}

export function MessageText({ text }: { text: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      {splitCode(text).map((part, i) =>
        part.kind === 'code' ? (
          <View key={i} testID="code-block" style={[styles.code, { backgroundColor: colors.code }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <AppText font="mono" size={12} style={{ color: colors.codeInk, lineHeight: 18 }}>
                {part.value}
              </AppText>
            </ScrollView>
          </View>
        ) : (
          <AppText key={i} size={15} style={{ lineHeight: 22 }}>
            {part.value}
          </AppText>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  code: { padding: spacing.md, borderRadius: radius.md },
});
