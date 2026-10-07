jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(async () => ({ granted: true })),
  requestPermissionsAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => undefined),
  scheduleNotificationAsync: jest.fn(async () => 'reminder-id'),
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

import * as Notifications from 'expo-notifications';
import { scheduleDailyReminder, cancelReminder } from './notifications';

const nativeSchedule = Notifications.scheduleNotificationAsync as jest.Mock;
const nativeCancel = Notifications.cancelAllScheduledNotificationsAsync as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('replaces reminder copy in order when the language changes during another update', async () => {
  await Promise.all([
    scheduleDailyReminder('Time to review!', 'Review your cards.'),
    scheduleDailyReminder('Đến giờ ôn tập!', 'Ôn tập các thẻ.'),
  ]);
  expect(nativeCancel).toHaveBeenCalledTimes(2);
  expect(nativeSchedule.mock.calls.map(([request]) => request.content.title))
    .toEqual(['Time to review!', 'Đến giờ ôn tập!']);
  expect(nativeSchedule.mock.invocationCallOrder[0]).toBeLessThan(nativeCancel.mock.invocationCallOrder[1]);
});

it('keeps reminders cancelled when cancellation arrives during a language update', async () => {
  let release!: (value: string) => void;
  let notifyStarted!: () => void;
  const started = new Promise<void>((resolve) => { notifyStarted = resolve; });
  nativeSchedule.mockImplementationOnce(() => {
    notifyStarted();
    return new Promise<string>((resolve) => { release = resolve; });
  });
  const scheduled = scheduleDailyReminder('Review', 'Cards');
  await started;
  const cancelled = cancelReminder();
  expect(nativeCancel).toHaveBeenCalledTimes(1);
  release('reminder-id');
  await Promise.all([scheduled, cancelled]);
  expect(nativeCancel).toHaveBeenCalledTimes(2);
});
