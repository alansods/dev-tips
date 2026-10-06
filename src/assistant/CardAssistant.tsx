// Botão "Perguntar" + gaveta do chat para o card atual. Fica na barra de
// ações da sessão; a conversa recomeça sozinha quando o card muda.

import { router } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Card } from '../content';
import { useLanguage, useT } from '../i18n';
import { cardTitle } from '../study/rules';
import { refreshSubscription, useIsPro } from '../subscriptions/store';
import { AskButton } from './AskButton';
import { ChatSheet } from './ChatSheet';
import { useCardChat } from './useCardChat';

export function CardAssistant({ card }: { card: Card }) {
  const t = useT();
  const language = useLanguage();
  const pro = useIsPro();
  const [open, setOpen] = useState(false);

  const onProRequired = useCallback(() => {
    setOpen(false);
    void refreshSubscription();
    router.push('/paywall');
  }, []);
  const chat = useCardChat(card, language, { onProRequired });

  const label = card.type === 'step' ? t.card.stepNumber(card.number) : t.card.types[card.type];
  return (
    <>
      <AskButton pro={pro} onPress={() => (pro ? setOpen(true) : router.push('/paywall'))} />
      <ChatSheet
        visible={open}
        cardLabel={label}
        cardTitle={cardTitle(card)}
        messages={chat.messages}
        status={chat.status}
        onSend={(text) => void chat.send(text)}
        onRetry={() => void chat.retry()}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
