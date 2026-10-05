import { en } from '../en';
import { ptBR } from '../pt-BR';

type Tree = { [key: string]: unknown };

/** Achata o dicionário em `caminho → texto`, chamando funções com argumentos de exemplo. */
function flatten(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, value);
    else if (typeof value === 'function') out.set(path, String(value(...[2, 5, 'X'])));
    else if (value && typeof value === 'object') flatten(value as Tree, path).forEach((v, k) => out.set(k, v));
  }
  return out;
}

describe('Requirement: Interface traduzida', () => {
  const pt = flatten(ptBR);
  const eng = flatten(en);

  it('Dicionários completos', () => {
    expect([...eng.keys()].sort()).toEqual([...pt.keys()].sort());
    for (const [key, text] of [...pt, ...eng]) {
      expect({ key, empty: text.trim() === '' }).toEqual({ key, empty: false });
    }
  });

  it('textos em inglês da spec', () => {
    expect(en.tabs).toEqual({ tracks: 'Tracks', glossary: 'Glossary', progress: 'Progress' });
    expect(en.settings.title).toBe('Settings');
    expect(en.answer.unknown.button).toBe("I didn't know");
    expect(en.answer.known.button).toBe('I knew it');
    expect(en.session.showAnswer).toBe('Show answer');
    expect(en.deckAction).toEqual({ start: 'Study', continue: 'Continue', restart: 'Study again' });
    expect(en.track.reviewKicker).toBe("Today's review");
    expect(en.track.reviewNow).toBe('Review now');
    expect(en.track.nothingToReview).toBe('Nothing to review today.');
    expect(en.summary.reviewMissed).toBe('Review the ones I missed');
    expect(en.summary.backToTrack).toBe('Back to track');
    expect(en.progress.reset).toBe('Reset progress');
    expect(en.progress.confirm).toBe('Reset');
    expect(en.common.cancel).toBe('Cancel');
  });
});
