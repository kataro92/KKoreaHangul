jest.mock('react-native', () => ({ Platform: { OS: 'android' } }), { virtual: true });
jest.mock('expo-modules-core', () => ({ requireOptionalNativeModule: jest.fn() }));
import { requireOptionalNativeModule } from 'expo-modules-core';
import { claimSupportThanks, loadSupportProducts, purchaseSupport, subscribeSupport } from './billing';
const native = requireOptionalNativeModule as jest.Mock;
const receipt = { productId: 'hangmi_pate', transactionId: 'play:' + 'a'.repeat(64), counts: { kibble: 0, pate: 1, toy: 0 } };
beforeEach(() => jest.clearAllMocks());

test('missing native store does not create fake purchase options', async () => {
  native.mockReturnValue(null);
  expect(await loadSupportProducts()).toEqual([]);
  expect(await purchaseSupport('hangmi_pate')).toEqual({ status: 'unavailable', receipt: null });
});
test.each(['pending', 'cancelled', 'processing'])('%s does not deliver thanks or a receipt', async status => {
  native.mockReturnValue({ purchase: jest.fn().mockResolvedValue({ ...receipt, status }) });
  expect(await purchaseSupport('hangmi_pate')).toEqual({ status, receipt: null });
});
test('unknown outcome or invalid success tells the user to wait, not pay twice', async () => {
  native.mockReturnValue({ purchase: jest.fn().mockRejectedValue(new Error('Bridge interrupted')) });
  expect((await purchaseSupport('hangmi_pate')).status).toBe('processing');
  native.mockReturnValue({ purchase: jest.fn().mockResolvedValue({ status: 'purchased' }) });
  expect((await purchaseSupport('hangmi_pate')).status).toBe('processing');
});
test('purchase Promise plus duplicate event only celebrates once', async () => {
  let callback!: (value: unknown) => void;
  const remove = jest.fn();
  native.mockReturnValue({
    purchase: jest.fn().mockResolvedValue({ ...receipt, status: 'purchased' }),
    addListener: jest.fn((_name, listener) => { callback = listener; return { remove }; }),
  });
  const celebrations: string[] = [];
  const receive = (value: typeof receipt) => { if (claimSupportThanks(value.transactionId)) celebrations.push(value.transactionId); };
  const unsubscribe = subscribeSupport(receive);
  const result = await purchaseSupport('hangmi_pate');
  receive(result.receipt!);
  callback(receipt);
  callback({ ...receipt, productId: 'premium' });
  expect(celebrations).toEqual([receipt.transactionId]);
  unsubscribe();
  expect(remove).toHaveBeenCalledTimes(1);
});
