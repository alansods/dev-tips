// Gaveta do chat "Perguntar" (telas 3 a 6 e 9 do design), no mesmo padrão
// da gaveta do glossário: Modal transparente com painel inferior.

import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { IconButton } from '../components/IconButton';
import { AskIcon, CloseIcon, SendIcon } from '../components/icons';
import { useLanguage, useT } from '../i18n';
import { useSubscriptionStore } from '../subscriptions/store';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { MessageText } from './MessageText';
import type { ChatMessage, ChatStatus } from './useCardChat';

export const MAX_QUESTION = 500;

type Props = {
  visible: boolean;
  /** Tipo do card já traduzido (ex.: "Glossário") e título. */
  cardLabel: string;
  cardTitle: string;
  messages: ChatMessage[];
  status: ChatStatus;
  onSend: (text: string) => void;
  onRetry: () => void;
  onClose: () => void;
};

export function ChatSheet({ visible, cardLabel, cardTitle, messages, status, onSend, onRetry, onClose }: Props) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguage();
  const expiresAt = useSubscriptionStore((s) => s.plan?.expiresAt ?? null);
  const [draft, setDraft] = useState('');
  const sending = status === 'sending';
  const canSend = draft.trim().length > 0 && !sending;

  const send = (text: string) => {
    if (sending) return;
    onSend(text);
    setDraft('');
  };

  const lastIsOutOfScope = messages.at(-1)?.inScope === false;
  const suggestions = (
    <View style={{ gap: spacing.sm }}>
      {t.assistant.suggestions.map((s) => (
        <Pressable
          key={s}
          accessibilityRole="button"
          accessibilityLabel={s}
          accessibilityState={{ disabled: sending }}
          disabled={sending}
          onPress={() => send(s)}
          style={({ pressed }) => [
            styles.suggestion,
            { borderColor: colors.line, backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <AppText size={14} style={{ flex: 1 }}>
            {s}
          </AppText>
          <AppText tone="muted">→</AppText>
        </Pressable>
      ))}
    </View>
  );

  const date = expiresAt
    ? new Date(expiresAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { timeZone: 'UTC' })
    : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.common.close}
          importantForAccessibility="no"
          accessibilityElementsHidden
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,8,12,0.55)' }]}
        />
        <SafeAreaView
          edges={['bottom']}
          testID="chat-sheet"
          accessibilityViewIsModal
          style={[styles.panel, { backgroundColor: colors.surface }]}
        >
          <View style={[styles.handle, { backgroundColor: colors.line }]} />
          <View style={styles.head}>
            <AppText font="semibold" size={18} accessibilityRole="header" style={{ flex: 1 }}>
              {t.assistant.title}
            </AppText>
            <IconButton label={t.common.close} onPress={onClose}>
              <CloseIcon color={colors.muted} />
            </IconButton>
          </View>
          <View style={[styles.chipRow, { borderColor: colors.line }]}>
            <View style={[styles.chip, { backgroundColor: colors.accentSoft }]}>
              <View style={[styles.chipType, { backgroundColor: colors.surface }]}>
                <AppText font="mono" size={10} tone="accentText" style={styles.upper}>
                  {cardLabel}
                </AppText>
              </View>
              <AppText font="medium" size={13} tone="accentText" numberOfLines={1} style={{ flexShrink: 1 }}>
                {cardTitle}
              </AppText>
            </View>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {messages.length === 0 ? (
              <View style={{ gap: spacing.lg }}>
                <View style={{ gap: 6 }}>
                  <View style={[styles.emptyIcon, { backgroundColor: colors.accentSoft }]}>
                    <AskIcon color={colors.accentText} size={22} />
                  </View>
                  <AppText font="semibold" size={17}>
                    {t.assistant.emptyTitle}
                  </AppText>
                  <AppText size={14} tone="muted" style={{ lineHeight: 21 }}>
                    {t.assistant.emptyBody}
                  </AppText>
                </View>
                {suggestions}
                <AppText size={12} tone="muted">
                  {t.assistant.resetNote}
                </AppText>
              </View>
            ) : (
              messages.map((m, i) =>
                m.role === 'user' ? (
                  <View key={i} style={[styles.bubble, styles.user, { backgroundColor: colors.accentSoft }]}>
                    <AppText size={15} style={{ lineHeight: 21 }}>
                      {m.text}
                    </AppText>
                  </View>
                ) : (
                  <View key={i} style={[styles.bubble, styles.bot, { backgroundColor: colors.surface2 }]}>
                    {m.inScope === false ? (
                      <AppText font="medium" size={12} tone="muted">
                        {t.assistant.outOfScope}
                      </AppText>
                    ) : null}
                    <MessageText text={m.text} />
                  </View>
                ),
              )
            )}
            {lastIsOutOfScope && !sending ? suggestions : null}
            {sending ? (
              <View
                accessibilityRole="progressbar"
                style={[styles.bubble, styles.bot, styles.typing, { backgroundColor: colors.surface2 }]}
              >
                <View style={styles.dots}>
                  {[1, 0.65, 0.35].map((o) => (
                    <View key={o} style={[styles.dot, { backgroundColor: colors.muted, opacity: o }]} />
                  ))}
                </View>
                <AppText size={13} tone="muted">
                  {t.assistant.typing}
                </AppText>
              </View>
            ) : null}
            {status === 'offline' || status === 'error' ? (
              <View accessibilityRole="alert" style={[styles.alert, { backgroundColor: colors.warnSoft }]}>
                <AppText size={14}>{status === 'offline' ? t.assistant.offline : t.assistant.error}</AppText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.assistant.retry}
                  onPress={onRetry}
                  style={({ pressed }) => [styles.retry, { borderColor: colors.warn, opacity: pressed ? 0.7 : 1 }]}
                >
                  <AppText font="semibold" size={14} tone="warn">
                    {t.assistant.retry}
                  </AppText>
                </Pressable>
              </View>
            ) : null}
          </ScrollView>

          {status === 'quota' ? (
            <View accessibilityRole="alert" style={[styles.footer, styles.quota, { borderColor: colors.line }]}>
              <AppText font="semibold" size={15}>
                {t.assistant.quotaTitle}
              </AppText>
              <AppText size={14} tone="muted" style={{ textAlign: 'center' }}>
                {t.assistant.quotaBody}
              </AppText>
              <AppText font="mono" size={12} tone="muted">
                {date ? t.assistant.quotaRenews(date) : t.assistant.quotaUsage}
              </AppText>
            </View>
          ) : (
            <View style={[styles.footer, { borderColor: colors.line }]}>
              <View style={styles.inputRow}>
                <TextInput
                  accessibilityLabel={t.assistant.inputLabel}
                  placeholder={t.assistant.placeholder}
                  placeholderTextColor={colors.muted}
                  value={draft}
                  onChangeText={setDraft}
                  maxLength={MAX_QUESTION}
                  multiline
                  style={[
                    styles.input,
                    { backgroundColor: colors.surface2, borderColor: colors.line, color: colors.ink },
                  ]}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.assistant.send}
                  accessibilityState={{ disabled: !canSend }}
                  disabled={!canSend}
                  onPress={() => send(draft)}
                  style={[styles.send, { backgroundColor: canSend ? colors.accent : colors.line }]}
                >
                  <SendIcon color={canSend ? colors.onAccent : colors.muted} />
                </Pressable>
              </View>
              <AppText size={11} tone="muted" style={{ textAlign: 'center' }}>
                {t.assistant.disclaimer}
              </AppText>
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  panel: { height: '85%', borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  handle: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, marginTop: spacing.sm },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingLeft: 20, paddingRight: spacing.sm },
  chipRow: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: spacing.md, borderBottomWidth: 1 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: spacing.md,
    borderRadius: 999,
  },
  chipType: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: 999 },
  upper: { textTransform: 'uppercase', letterSpacing: 0.6 },
  body: { padding: spacing.lg, gap: spacing.lg },
  emptyIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  bubble: { maxWidth: '88%', paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  user: { alignSelf: 'flex-end', borderRadius: radius.lg, borderBottomRightRadius: 4 },
  bot: { alignSelf: 'flex-start', borderRadius: radius.lg, borderBottomLeftRadius: 4 },
  typing: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  alert: { gap: spacing.md, padding: 14, borderRadius: radius.lg },
  retry: {
    alignSelf: 'flex-start',
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
  },
  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
  },
  quota: { alignItems: 'center', paddingVertical: spacing.lg },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: spacing.lg,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: radius.lg,
    borderWidth: 1,
    fontSize: 15,
  },
  send: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
