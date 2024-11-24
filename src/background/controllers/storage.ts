import { LocalStorage, SyncStorage } from "../../chrome-api/storage";

export const appStorage = new LocalStorage<Record<string, string>>();
export const appSettingsStorage = new SyncStorage({
  showToastNotifications: true,
});
// define static methods here
export class StorageHandler {}
