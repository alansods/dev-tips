// Plano do usuário (GET /me/subscription), guardado no aparelho para valer
// também sem conexão. A API é a fonte da verdade; aqui é só a última resposta.

import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authFetch } from '../auth/api';
import { useAccountStore } from '../auth/store';
import { safeJSONStorage } from '../storage/safeStorage';

export const SUBSCRIPTION_STORAGE_KEY = 'dev-tips:subscription';

const planSchema = z.object({
  plan: z.enum(['free', 'pro']),
  source: z.enum(['store', 'admin']).nullable(),
  expiresAt: z.string().nullable(),
  willRenew: z.boolean(),
  questions: z.object({ used: z.number(), limit: z.number().nullable() }),
});

export type SubscriptionPlan = z.infer<typeof planSchema>;

type Data = { plan: SubscriptionPlan | null };
type State = Data & { setPlan: (plan: SubscriptionPlan | null) => void };

export const useSubscriptionStore = create<State>()(
  persist(
    (set) => ({
      plan: null,
      setPlan: (plan) => set({ plan }),
    }),
    {
      name: SUBSCRIPTION_STORAGE_KEY,
      version: 1,
      storage: safeJSONStorage<Data>(),
      partialize: (s): Data => ({ plan: s.plan }),
      merge: (saved, current) => {
        const parsed = z.object({ plan: planSchema.nullable() }).safeParse(saved);
        return parsed.success ? { ...current, ...parsed.data } : { ...current, plan: null };
      },
    },
  ),
);

export const resetSubscriptionStore = () => useSubscriptionStore.setState({ plan: null });

export const isProPlan = (plan: SubscriptionPlan | null) => plan?.plan === 'pro';

/** O usuário (com sessão) é Pro, segundo a última resposta da API? */
export function useIsPro(): boolean {
  const signedIn = useAccountStore((s) => s.user !== null);
  const pro = useSubscriptionStore((s) => isProPlan(s.plan));
  return signedIn && pro;
}

/** Atualiza o plano pela API. Sem conexão ou com erro, mantém o último guardado. */
export async function refreshSubscription(): Promise<void> {
  try {
    useSubscriptionStore.getState().setPlan(planSchema.parse(await authFetch('/me/subscription')));
  } catch {
    // mantém o último plano conhecido
  }
}

/** Pede à API para consultar a loja agora (depois de comprar ou restaurar). Lança em caso de erro. */
export async function syncSubscription(): Promise<SubscriptionPlan> {
  const plan = planSchema.parse(await authFetch('/me/subscription/sync', { method: 'POST' }));
  useSubscriptionStore.getState().setPlan(plan);
  return plan;
}
