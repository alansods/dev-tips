// Quem é Pro: assinatura com expiração no futuro ou e-mail na lista ADMIN_EMAILS.

/** E-mails da variável ADMIN_EMAILS (separados por vírgula), sem diferenciar maiúsculas. */
export const adminEmails = (list: string) =>
  list
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isAdmin = (email: string | null, list: string) =>
  email !== null && adminEmails(list).includes(email.toLowerCase());

export function isPro(
  user: { email: string | null },
  subscription: { expiresAt: number } | null,
  adminList: string,
  now: number,
): boolean {
  return isAdmin(user.email, adminList) || (subscription !== null && subscription.expiresAt > now);
}
