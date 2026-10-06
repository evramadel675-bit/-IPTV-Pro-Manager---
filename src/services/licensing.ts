/**
 * IPTV Pro Manager - Device Licensing & Activation Engine
 * Secret Key: "Evram_IPTV_Secure_2026"
 * Developed by: Eng. Evram Adel
 */

export const SECRET_KEY = "Evram_IPTV_Secure_2026";
export const DEVELOPER_PHONE = "201271603214"; // Eng. Evram Adel (01271603214)
export const LIFETIME_EXPIRY = "2099-12-31";

const STORAGE_DEVICE_ID = "iptv_client_device_id";
const STORAGE_LICENSE = "iptv_client_license";

export interface LicenseInfo {
  isActivated: boolean;
  deviceId: string;
  expiryDate: string; // YYYY-MM-DD
  daysRemaining: number;
  isLifetime: boolean;
  licenseKey?: string;
}

// Check if an expiry date string represents lifetime permanent access
export function isLifetimeExpiry(expiryDate: string): boolean {
  if (!expiryDate) return false;
  const clean = expiryDate.trim().toUpperCase();
  if (clean === LIFETIME_EXPIRY || clean === "LIFETIME" || clean.startsWith("2099")) {
    return true;
  }
  const year = parseInt(clean.split("-")[0], 10);
  return !isNaN(year) && year >= 2099;
}

// Simple deterministic hash for checksum
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate or retrieve persistent Device ID
export function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem(STORAGE_DEVICE_ID);
    if (!id) {
      // Generate clean uppercase hardware-style ID: EV-XXXX-XXXX-XXXX
      const randPart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randPart3 = Date.now().toString(36).substring(3, 7).toUpperCase();
      id = `EVRAM-${randPart1}-${randPart2}-${randPart3}`;
      localStorage.setItem(STORAGE_DEVICE_ID, id);
    }
    return id;
  } catch (e) {
    return "EVRAM-DEV-8842-9901";
  }
}

// Cipher function using secret key
function xorEncrypt(text: string, key: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Cipher decrypt function using secret key
function xorDecrypt(base64: string, key: string): string | null {
  try {
    let str = base64.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) {
      str += "=";
    }
    const decoded = atob(str);
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (e) {
    return null;
  }
}

/**
 * Generate Activation Key for a given Device ID and Expiry Date
 * Used by Eng. Evram Adel to create valid client licenses
 */
export function generateActivationKey(
  deviceId: string,
  expiryDate: string,
  secret: string = SECRET_KEY
): string {
  const cleanId = deviceId.trim().toUpperCase();
  const cleanExpiry = expiryDate.trim();
  const check = hashString(`${cleanId}|${cleanExpiry}|${secret}`).toString(16);
  const payload = `${cleanId}|${cleanExpiry}|${check}`;
  const encrypted = xorEncrypt(payload, secret);
  return `KEY-${encrypted}`;
}

/**
 * Verify Activation Key against local Device ID and Expiry Date
 */
export function verifyActivationKey(
  rawKey: string,
  currentDeviceId: string,
  secret: string = SECRET_KEY
): { valid: boolean; expiryDate?: string; error?: string; isLifetime?: boolean } {
  if (!rawKey || !rawKey.trim()) {
    return { valid: false, error: "يرجى إدخال كود التفعيل" };
  }

  const cleanKey = rawKey.trim();
  const token = cleanKey.startsWith("KEY-") ? cleanKey.substring(4) : cleanKey;

  const decrypted = xorDecrypt(token, secret);
  if (!decrypted) {
    return { valid: false, error: "كود التفعيل غير صالح أو تم التعديل عليه" };
  }

  const parts = decrypted.split("|");
  if (parts.length < 3) {
    return { valid: false, error: "صيغة الكود غير صحيحة" };
  }

  const [keyDeviceId, expiryDate, check] = parts;

  // 1. Verify Device ID matches this specific device
  if (keyDeviceId.toUpperCase() !== currentDeviceId.trim().toUpperCase()) {
    return {
      valid: false,
      error: "كود التفعيل هذا مخصص لجهاز آخر ولا يتطابق مع رقم جهازك الحالي!",
    };
  }

  // 2. Verify Cryptographic Integrity
  const expectedCheck = hashString(`${keyDeviceId}|${expiryDate}|${secret}`).toString(16);
  if (check !== expectedCheck) {
    return { valid: false, error: "رمز التحقق غير صالح أو غير معتمد" };
  }

  // 3. Verify Expiry Date has not passed today (Bypassed if Lifetime activation)
  const isLifetime = isLifetimeExpiry(expiryDate);

  if (!isLifetime) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const exp = new Date(expiryDate);
    exp.setHours(0, 0, 0, 0);

    if (isNaN(exp.getTime())) {
      return { valid: false, error: "تاريخ انتهاء الكود غير صالح" };
    }

    if (exp.getTime() < now.getTime()) {
      return {
        valid: false,
        expiryDate,
        isLifetime: false,
        error: `انتهت صلاحية هذا الكود بتاريخ (${expiryDate}). يرجى التواصل مع المهندس إفرام عادل لتجديد التفعيل.`,
      };
    }
  }

  return { valid: true, expiryDate, isLifetime };
}

/**
 * Check current activation state from localStorage (Permanently Free Lifetime Access)
 */
export function checkCurrentLicense(): LicenseInfo {
  const deviceId = getOrCreateDeviceId();
  return {
    isActivated: true,
    deviceId,
    expiryDate: LIFETIME_EXPIRY,
    daysRemaining: 99999,
    isLifetime: true,
  };
}

/**
 * Save valid license to localStorage
 */
export function saveLicense(licenseKey: string, expiryDate: string): void {
  try {
    localStorage.setItem(
      STORAGE_LICENSE,
      JSON.stringify({
        licenseKey,
        expiryDate,
        activatedAt: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.error("Failed to save license", e);
  }
}

/**
 * Deactivate / Clear license
 */
export function clearLicense(): void {
  try {
    localStorage.removeItem(STORAGE_LICENSE);
  } catch (e) {}
}
