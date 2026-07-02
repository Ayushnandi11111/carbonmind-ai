// Generates (or reuses) a random per-device ID stored in localStorage.
// This is how we identify "this device's user" without any login system.
const DEVICE_ID_KEY = "carbon-device-id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(DEVICE_ID_KEY);

  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(DEVICE_ID_KEY, id);
  }

  return id;
}
