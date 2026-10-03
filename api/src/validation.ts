// Validação do corpo JSON com Zod; corpo inválido vira 400 invalid_body.

import { zValidator } from '@hono/zod-validator';
import type { ZodType } from 'zod';

import { AppError } from './errors';

export const jsonBody = <T extends ZodType>(schema: T) =>
  zValidator('json', schema, (result) => {
    if (!result.success) throw new AppError(400, 'invalid_body', 'Corpo da requisição inválido.');
  });
