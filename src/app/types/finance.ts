export type TransactionType = "expense" | "income";

export type ExpenseCategory =
  | "food" // Ăn uống
  | "transport" // Đi lại / Xăng xe
  | "shopping" // Mua sắm
  | "bills" // Hóa đơn (Điện, Nước, Internet)
  | "housing" // Tiền nhà / Thuê phòng
  | "entertainment" // Giải trí / Cafe / Nhậu
  | "health" // Y tế / Thuốc
  | "other_expense"; // Khác

export type IncomeCategory =
  | "salary" // Lương
  | "bonus" // Thưởng
  | "freelance" // Làm thêm / Ngoài giờ
  | "investment" // Lãi tiết kiệm / Đầu tư
  | "other_income"; // Khác

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export type PaymentMethod =
  | "cash" // Tiền mặt
  | "bank_transfer" // Chuyển khoản ngân hàng
  | "credit_card" // Thẻ tín dụng
  | "e_wallet"; // Ví điện tử (Momo, ZaloPay)

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  title: string; // Chi tiêu cái gì / Nguồn thu nào
  amount: number; // Số tiền (VNĐ)
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export type DebtType = "lend" | "borrow"; // lend: Tôi cho vay (Người ta nợ tôi), borrow: Tôi đi vay (Tôi nợ người ta)

export interface DebtRecord {
  id: string;
  type: DebtType;
  personName: string; // Tên người nợ hoặc chủ nợ
  phoneNumber?: string;
  amount: number; // Số tiền nợ
  paidAmount: number; // Đã trả
  remainAmount: number; // Còn nợ lại
  dueDate?: string; // Hạn trả
  reason: string; // Lý do vay mượn
  status: "unpaid" | "partial" | "paid"; // Chưa trả, Trả một phần, Đã trả xong
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySummary {
  month: string; // e.g. "10/2026"
  totalIncome: number; // Tổng thu tháng
  totalExpense: number; // Tổng chi tháng
  balance: number; // Số dư = Tổng thu - Tổng chi
  todayExpense: number; // Hôm nay đã chi
  yesterdayExpense: number; // Hôm qua đã chi
  dailyAverageExpense: number; // Trung bình chi mỗi ngày
  totalReceivable: number; // Tổng tiền người khác nợ tôi
  totalPayable: number; // Tổng tiền tôi đang nợ người ta
  currency: "VND";
}
