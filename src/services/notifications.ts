/**
 * Nhắc ôn tập hằng ngày bằng expo-notifications.
 *
 * Dùng require có bảo vệ: nếu gói chưa được cài (chạy `npx expo install expo-notifications`)
 * hoặc nền tảng không hỗ trợ (vd web), các hàm sẽ no-op thay vì làm sập app.
 */

let Notifications: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Notifications = require('expo-notifications');
} catch {
  Notifications = null;
}

export const REMINDER_HOUR = 20; // 20:00 mỗi ngày
export const REMINDER_MINUTE = 0;

/** expo-notifications đã sẵn sàng chưa? */
export function isNotificationsAvailable(): boolean {
  return Notifications != null;
}

/** Xin quyền gửi thông báo. Trả về true nếu được cấp. */
export async function requestPermission(): Promise<boolean> {
  if (!Notifications) return false;
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted || settings.ios?.status === 3 /* provisional */) return true;
    const req = await Notifications.requestPermissionsAsync();
    return !!req.granted;
  } catch {
    return false;
  }
}

/**
 * Lên lịch nhắc ôn hằng ngày (huỷ lịch cũ trước để tránh trùng).
 * @param title tiêu đề thông báo
 * @param body nội dung thông báo
 */
export async function scheduleDailyReminder(title: string, body: string): Promise<boolean> {
  if (!Notifications) return false;
  try {
    const ok = await requestPermission();
    if (!ok) return false;
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      // SDK 52+: trigger bắt buộc có `type` — thiếu sẽ throw TypeError.
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: REMINDER_HOUR,
        minute: REMINDER_MINUTE,
      },
    });
    return true;
  } catch {
    return false;
  }
}

/** Huỷ mọi lịch nhắc. */
export async function cancelReminder(): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}
