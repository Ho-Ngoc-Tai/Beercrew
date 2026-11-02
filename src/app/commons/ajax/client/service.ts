import { AxiosCommon } from "../Axios";
import { decryptPayload } from "@commons/utils/crypto";
import { AUTH_SIGNIN_PAGE } from "@routes/web";

export class ClientService extends AxiosCommon {
  private static instance: ClientService;

  private constructor() {
    // Client calls relative Next.js BFF routes (e.g. /api/...)
    super("", 15000);
    this.setupInterceptors();
  }

  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  private setupInterceptors(): void {
    // Response Interceptor: Auto-decrypt payload & manage errors
    this.instance.interceptors.response.use(
      (response) => {
        const isEncryptEnabled = process.env.NEXT_PUBLIC_ENABLE_ENCRYPT === "true";
        if (
          isEncryptEnabled &&
          response.data?.encrypted &&
          response.data?.payload
        ) {
          const decrypted = decryptPayload(response.data.payload);
          response.data = decrypted ?? response.data;
        }
        return response;
      },
      (error) => {
        if (typeof window !== "undefined") {
          const status = error.response?.status;
          if (status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath !== AUTH_SIGNIN_PAGE) {
              window.location.href = `${AUTH_SIGNIN_PAGE}?redirect=${encodeURIComponent(
                currentPath
              )}`;
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }
}

export const clientService = ClientService.getInstance();
