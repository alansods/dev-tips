// Datas como dia do calendário local no formato YYYY-MM-DD. Comparar dias é
// comparar strings (a ordem lexicográfica é a cronológica).

const pad = (n: number) => String(n).padStart(2, '0');

/** Dia de hoje no fuso do aparelho. */
export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Soma dias a um dia YYYY-MM-DD (calculado em UTC para não sofrer com horário de verão). */
export function addDays(day: string, days: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Instante atual (separado para os testes poderem fixar a hora). */
export function now(): Date {
  return new Date();
}
