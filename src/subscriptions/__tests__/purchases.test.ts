import { Linking, Platform } from 'react-native';
import Purchases from 'react-native-purchases';

import { manageSubscriptions } from '../purchases';

jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: { configure: jest.fn(), showManageSubscriptions: jest.fn(async () => {}) },
  PURCHASES_ERROR_CODE: {},
}));

const PLAY_SUBSCRIPTION = 'https://play.google.com/store/account/subscriptions?sku=pro_monthly&package=dev.devtips.app';

const setOS = (value: string) => Object.defineProperty(Platform, 'OS', { value, configurable: true });
const os = Platform.OS;
let openURL: jest.SpyInstance;

beforeEach(() => {
  openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
});
afterEach(() => {
  setOS(os);
  openURL.mockRestore();
});

describe('Requirement: Conta no app', () => {
  it('Gerenciar assinatura no Android', async () => {
    setOS('android');
    await manageSubscriptions();
    expect(openURL).toHaveBeenCalledWith(PLAY_SUBSCRIPTION);
    expect(Purchases.showManageSubscriptions).not.toHaveBeenCalled();
  });

  it('falha ao abrir o Google Play não quebra o app', async () => {
    setOS('android');
    openURL.mockRejectedValue(new Error('no activity'));
    await expect(manageSubscriptions()).resolves.toBeUndefined();
  });
});
