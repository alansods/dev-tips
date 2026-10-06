// Textos do chat "Perguntar": a instrução de sistema enviada ao modelo e a
// recusa fixa para perguntas fora do card (fixa = previsível e testável).

export type Language = 'pt-BR' | 'en';

const LANGUAGE_NAME: Record<Language, string> = { 'pt-BR': 'Brazilian Portuguese', en: 'English' };

export function systemPrompt(card: { type: string; title: string; text: string }, language: Language): string {
  return [
    'You are a study assistant inside a flashcard app about fullstack development.',
    'Answer ONLY questions about the flashcard below. Use its content as your source; you may add short',
    'explanations or examples that help understand that same content.',
    'If the question is not about this flashcard, set "inScope" to false and keep "answer" short.',
    `Always answer in ${LANGUAGE_NAME[language]}. Be concise (at most a few short paragraphs).`,
    'Put code in fenced blocks with three backticks.',
    'Return JSON with "inScope" (boolean) and "answer" (string).',
    '',
    `Flashcard type: ${card.type}`,
    `Flashcard title: ${card.title}`,
    'Flashcard content:',
    card.text,
  ].join('\n');
}

export function outOfScopeAnswer(title: string, language: Language): string {
  return language === 'en'
    ? `I can only help with the content of this card: ${title}. Want me to explain any part of it?`
    : `Só consigo ajudar com o conteúdo deste card: ${title}. Quer que eu explique algum ponto dele?`;
}
