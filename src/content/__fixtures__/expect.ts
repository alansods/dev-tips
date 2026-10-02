import { validateTheme, type ContentError, type Theme } from '../index';

/** Valida e devolve os erros; falha o teste se o tema for aceito. */
export function errorsOf(input: unknown): ContentError[] {
  const result = validateTheme(input);
  if (result.ok) throw new Error('esperava que a validação rejeitasse o tema, mas ela aceitou');
  return result.errors;
}

/** Valida e devolve o tema; falha o teste mostrando os erros se for rejeitado. */
export function themeOf(input: unknown): Theme {
  const result = validateTheme(input);
  if (!result.ok) {
    throw new Error('esperava tema válido, mas houve erros:\n' + result.errors.map((e) => `${e.path}: ${e.message}`).join('\n'));
  }
  return result.theme;
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
