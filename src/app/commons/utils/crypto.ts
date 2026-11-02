import CryptoJS from "crypto-js";

const DEFAULT_SECRET =
  process.env.CORE_API_SECRET_KEY || "Beercrew@Sec2026EnterpriseKey!";

/**
 * Encrypt arbitrary object or string with AES-256
 */
export function encryptPayload(data: unknown, secretKey = DEFAULT_SECRET): string {
  try {
    const rawString = typeof data === "string" ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(rawString, secretKey).toString();
  } catch (error) {
    console.error("[CryptoUtils] Encrypt error:", error);
    return "";
  }
}

/**
 * Decrypt AES ciphertext back to original parsed data or string
 */
export function decryptPayload<T = unknown>(
  cipherText: string,
  secretKey = DEFAULT_SECRET
): T | null {
  try {
    if (!cipherText) return null;
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return null;

    try {
      return JSON.parse(decryptedString) as T;
    } catch {
      return decryptedString as unknown as T;
    }
  } catch (error) {
    console.error("[CryptoUtils] Decrypt error:", error);
    return null;
  }
}
