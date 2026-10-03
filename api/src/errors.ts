// Erros num lugar só: toda resposta de erro sai como { error: { code, message } }.

import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/** Erro conhecido: vira uma resposta com o status, o código e a mensagem dados. */
export class AppError extends Error {
  constructor(
    public readonly status: ContentfulStatusCode,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export const errorBody = (code: string, message: string) => ({ error: { code, message } });

/** onError do Hono: erros conhecidos com seu status; o resto vira 500 genérico, sem detalhes internos. */
export function handleError(err: Error, c: Context) {
  if (err instanceof AppError) return c.json(errorBody(err.code, err.message), err.status);
  console.error(err); // aparece nos logs da Cloudflare, nunca na resposta
  return c.json(errorBody('internal_error', 'Erro inesperado.'), 500);
}
