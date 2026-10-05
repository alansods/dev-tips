import { validateTrack, type ContentError, type Track } from '../index';

/** Valida e devolve os erros; falha o teste se a trilha for aceita. */
export function errorsOf(input: unknown): ContentError[] {
  const result = validateTrack(input);
  if (result.ok) throw new Error('esperava que a validação rejeitasse a trilha, mas ela aceitou');
  return result.errors;
}

/** Valida e devolve a trilha; falha o teste mostrando os erros se for rejeitada. */
export function trackOf(input: unknown): Track {
  const result = validateTrack(input);
  if (!result.ok) {
    throw new Error('esperava trilha válida, mas houve erros:\n' + result.errors.map((e) => `${e.path}: ${e.message}`).join('\n'));
  }
  return result.track;
}

/** Afirma que existe um erro exatamente no `path` (e, opcionalmente, com um trecho da mensagem). */
export function expectErrorAt(input: unknown, path: string, messagePart?: string): void {
  const errors = errorsOf(input);
  const match = errors.find((e) => e.path === path && (!messagePart || e.message.includes(messagePart)));
  if (!match) {
    throw new Error(
      `esperava erro em "${path}"${messagePart ? ` contendo "${messagePart}"` : ''}, mas os erros foram:\n` +
        errors.map((e) => `${e.path}: ${e.message}`).join('\n'),
    );
  }
}
