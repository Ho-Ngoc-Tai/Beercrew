export type TicketStatus = "open" | "locked" | "paid" | "cancelled";

export interface TicketMember {
  id: string;
  name: string;
  avatar: string;
  status: "joined" | "declined" | "tentative";
  isPaid: boolean;
  paidAmount?: number;
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  venue: string;
  address: string;
  scheduledTime: string;
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  status: TicketStatus;
  totalBill: number;
  perPersonBill: number;
  members: TicketMember[];
  musicVotes?: {
    songName: string;
    artist: string;
    votes: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketStatusCount {
  all: number;
  open: number;
  locked: number;
  paid: number;
  cancelled: number;
}
