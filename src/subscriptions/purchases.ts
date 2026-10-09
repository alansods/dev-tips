// Único arquivo que conhece a SDK do RevenueCat. As telas e os testes usam só
// estas funções. Nesta versão a venda é só no Android (Google Play): no iOS e
// na web todas viram "não disponível".

import { Linking, Platform } from 'react-native';
import Purchases, { PURCHASES_ERROR_CODE, type PurchasesPackage } from 'react-native-purchases';

/** Chave pública do RevenueCat para Android (não é segredo: vai dentro do app). */
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

/** A venda do Pro existe nesta plataforma? */
export const billingAvailable = () => Platform.OS === 'android' && ANDROID_KEY !== '';

let configured = false;
function ensureConfigured(): boolean {
  if (!billingAvailable()) return false;
  if (!configured) {
    Purchases.configure({ apiKey: ANDROID_KEY });
    configured = true;
  }
  return true;
}

/** Liga as compras ao usuário da API (o webhook chega com este id). */
export async function purchasesLogIn(userId: string): Promise<void> {
  if (!ensureConfigured()) return;
  await Purchases.logIn(userId).catch(() => {});
}

export async function purchasesLogOut(): Promise<void> {
  if (!configured) return;
  await Purchases.logOut().catch(() => {}); // falha se já era anônimo: tudo bem
}

async function monthlyPackage(): Promise<PurchasesPackage | null> {
  if (!ensureConfigured()) return null;
  const offerings = await Purchases.getOfferings();
  return offerings.current?.monthly ?? null;
}

/** Preço do plano mensal já formatado pela loja (ex.: "R$ 14,90"); `null` se indisponível. */
export async function monthlyPrice(): Promise<string | null> {
  try {
    return (await monthlyPackage())?.product.priceString ?? null;
  } catch {
    return null;
  }
}

const isOffline = (e: unknown) => {
  const code = (e as { code?: string } | null)?.code;
  return code === PURCHASES_ERROR_CODE.NETWORK_ERROR || code === PURCHASES_ERROR_CODE.OFFLINE_CONNECTION_ERROR;
};

export type PurchaseOutcome = 'purchased' | 'cancelled' | 'offline' | 'error';

export async function purchaseMonthly(): Promise<PurchaseOutcome> {
  try {
    const pkg = await monthlyPackage();
    if (!pkg) return 'error';
    await Purchases.purchasePackage(pkg);
    return 'purchased';
  } catch (e) {
    if ((e as { userCancelled?: boolean } | null)?.userCancelled) return 'cancelled';
    return isOffline(e) ? 'offline' : 'error';
  }
}

export type RestoreOutcome = 'restored' | 'offline' | 'error';

export async function restorePurchases(): Promise<RestoreOutcome> {
  if (!ensureConfigured()) return 'error';
  try {
    await Purchases.restorePurchases();
    return 'restored';
  } catch (e) {
    return isOffline(e) ? 'offline' : 'error';
  }
}

/** Id da assinatura no Play Console e pacote do app (o mesmo de app.json). */
const PRO_PRODUCT_ID = 'pro_monthly';
const ANDROID_PACKAGE = 'dev.devtips.app';

/**
 * Abre a assinatura do Dev Tips no Google Play, onde o usuário pode cancelar.
 * `Purchases.showManageSubscriptions()` só existe no iOS: no Android ela lança erro.
 */
export async function manageSubscriptions(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const url = `https://play.google.com/store/account/subscriptions?sku=${PRO_PRODUCT_ID}&package=${ANDROID_PACKAGE}`;
  await Linking.openURL(url).catch(() => {});
}
