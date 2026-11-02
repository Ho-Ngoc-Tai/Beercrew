export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: "text" | "image" | "system" | "bill_alert" | "location";
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  ticketId?: string;
  title: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  participants: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  }[];
}
