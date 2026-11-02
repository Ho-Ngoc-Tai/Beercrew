import http from "http";
import https from "https";
import { AxiosCommon } from "../Axios";
import { encryptPayload, decryptPayload } from "@commons/utils/crypto";
import { cookies, headers } from "next/headers";
import { CORE_AUTH_REFRESH_ENDPOINT } from "@routes/core.api";

// Reusable KeepAlive Agents
const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,
  keepAliveMsecs: 30000,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  keepAliveMsecs: 30000,
});

// Mutex Token Refresh State
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function parseJwtExp(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export class ServerService extends AxiosCommon {
  private static instance: ServerService;

  private constructor() {
    const baseURL =
      process.env.NEXT_PUBLIC_CORE_API_URL || "http://localhost:2025";
    const timeout = Number(process.env.CORE_API_TIMEOUT) || 15000;

    super(baseURL, timeout);

    // Apply keepAlive agents
    this.instance.defaults.httpAgent = httpAgent;
    this.instance.defaults.httpsAgent = httpsAgent;

    this.setupInterceptors();
  }

  public static getInstance(): ServerService {
    if (!ServerService.instance) {
      ServerService.instance = new ServerService();
    }
    return ServerService.instance;
  }

  private setupInterceptors(): void {
    // Request Interceptor: Forward headers, preemptive refresh, and AES encrypt
    this.instance.interceptors.request.use(async (config) => {
      try {
        const cookieStore = await cookies();
        const headerStore = await headers();

        const tokenName = process.env.COOKIE_TOKEN_NAME || "vtt";
        const refreshTokenName = process.env.COOKIE_REFRESH_TOKEN_NAME || "vttr";

        let token = cookieStore.get(tokenName)?.value;
        const refreshToken = cookieStore.get(refreshTokenName)?.value;

        // Preemptive Token Refresh Check
        if (token && refreshToken) {
          const exp = parseJwtExp(token);
          const nowInSec = Math.floor(Date.now() / 1000);

          // If token expires in less than 60s, trigger mutex refresh
          if (exp && exp - nowInSec < 60) {
            const refreshed = await this.refreshTokenMutex(refreshToken);
            if (refreshed) {
              token = refreshed;
            }
          }
        }

        // Attach Auth Token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Forward Client Telemetry Headers
        const clientIp =
          headerStore.get("cf-connecting-ip") ||
          headerStore.get("x-forwarded-for") ||
          headerStore.get("x-real-ip");
        if (clientIp) {
          config.headers["X-Forwarded-For"] = clientIp;
        }

        const acceptLanguage = headerStore.get("accept-language");
        if (acceptLanguage) {
          config.headers["Accept-Language"] = acceptLanguage;
        }

        // AES Payload Encryption if enabled
        const isEncryptEnabled = process.env.NEXT_PUBLIC_ENABLE_ENCRYPT === "true";
        if (isEncryptEnabled && config.data && typeof config.data === "object") {
          const cipherText = encryptPayload(config.data);
          config.data = { encrypted: true, payload: cipherText };
        }
      } catch (err) {
        // Handle requests outside Next.js request context gracefully
        console.warn("[ServerService] Request context read warning:", err);
      }

      return config;
    });

    // Response Interceptor: AES Decrypt and structure response
    this.instance.interceptors.response.use(
      (response) => {
        if (
          process.env.NEXT_PUBLIC_ENABLE_ENCRYPT === "true" &&
          response.data?.encrypted &&
          response.data?.payload
        ) {
          const decrypted = decryptPayload(response.data.payload);
          response.data = decrypted ?? response.data;
        }
        return response;
      },
      (error) => {
        console.error(
          `[ServerService] Error ${error.config?.url}:`,
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  /**
   * Preemptive Token Refresh Mutex Queue
   */
  private async refreshTokenMutex(refreshToken: string): Promise<string | null> {
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const baseURL =
          process.env.NEXT_PUBLIC_CORE_API_URL || "http://localhost:2025";
        const res = await this.instance.post(`${baseURL}/${CORE_AUTH_REFRESH_ENDPOINT}`, {
          refreshToken,
        });

        const newToken = res.data?.data?.accessToken;
        return newToken || null;
      } catch (error) {
        console.error("[ServerService] Preemptive refresh failed:", error);
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }
}

export const serverService = ServerService.getInstance();
