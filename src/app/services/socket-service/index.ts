import { io, Socket } from "socket.io-client";

/**
 * Native WebSocket Wrapper with exponential backoff auto-reconnect
 */
export class NativeWSWrapper {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000;
  private isExplicitlyClosed = false;
  private messageHandlers: Set<(event: MessageEvent) => void> = new Set();

  constructor(url: string) {
    this.url = url;
  }

  public connect(): void {
    if (typeof window === "undefined") return;
    this.isExplicitlyClosed = false;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        console.log(`[NativeWSWrapper] Connected to ${this.url}`);
      };

      this.ws.onmessage = (event) => {
        this.messageHandlers.forEach((handler) => handler(event));
      };

      this.ws.onclose = () => {
        if (!this.isExplicitlyClosed) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (err) => {
        console.error("[NativeWSWrapper] Error:", err);
      };
    } catch (e) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );
    console.log(`[NativeWSWrapper] Reconnecting in ${delay}ms...`);
    setTimeout(() => this.connect(), delay);
  }

  public onMessage(handler: (event: MessageEvent) => void): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  public close(): void {
    this.isExplicitlyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

/**
 * Singleton SocketService managing Socket.IO connection & subscribed topics
 */
export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private subscribedTopics: Set<string> = new Set();
  private eventListeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(url?: string, token?: string): Socket | null {
    if (typeof window === "undefined") return null;
    if (this.socket && this.socket.connected) return this.socket;

    const socketUrl =
      url || process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:2025";

    this.socket = io(socketUrl, {
      auth: token ? { token } : undefined,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    this.socket.on("connect", () => {
      console.log(`[SocketService] Connected with ID: ${this.socket?.id}`);
      // Resubscribe to existing topics upon reconnect
      this.subscribedTopics.forEach((topic) => {
        this.socket?.emit("subscribe", { topic });
      });
    });

    this.socket.on("disconnect", (reason) => {
      console.warn(`[SocketService] Disconnected: ${reason}`);
    });

    this.socket.on("connect_error", (error) => {
      console.warn("[SocketService] Connection error:", error.message);
    });

    return this.socket;
  }

  public subscribe(topic: string): void {
    if (this.subscribedTopics.has(topic)) return;
    this.subscribedTopics.add(topic);
    if (this.socket && this.socket.connected) {
      this.socket.emit("subscribe", { topic });
    }
  }

  public unsubscribe(topic: string): void {
    if (!this.subscribedTopics.has(topic)) return;
    this.subscribedTopics.delete(topic);
    if (this.socket && this.socket.connected) {
      this.socket.emit("unsubscribe", { topic });
    }
  }

  public on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
      this.socket?.on(event, (...args: any[]) => {
        const listeners = this.eventListeners.get(event);
        listeners?.forEach((cb) => cb(...args));
      });
    }
    this.eventListeners.get(event)?.add(callback);

    return () => {
      this.eventListeners.get(event)?.delete(callback);
    };
  }

  public emit(event: string, data?: unknown): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.subscribedTopics.clear();
      this.eventListeners.clear();
    }
  }
}

export const socketService = SocketService.getInstance();
