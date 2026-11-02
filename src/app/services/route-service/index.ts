import { NextResponse } from "next/server";
import { serverService } from "@commons/ajax/server/service";
import CryptoJS from "crypto-js";
import {
  CORE_AUTH_SIGNIN_ENDPOINT,
  CORE_AUTH_ME_ENDPOINT,
  CORE_AUTH_SIGNOUT_ENDPOINT,
  CORE_TRANSACTION_LIST_ENDPOINT,
  CORE_TRANSACTION_CREATE_ENDPOINT,
  CORE_TRANSACTION_DELETE_ENDPOINT,
  CORE_DEBT_LIST_ENDPOINT,
  CORE_DEBT_CREATE_ENDPOINT,
  CORE_DEBT_UPDATE_ENDPOINT,
  CORE_DEBT_DELETE_ENDPOINT,
  CORE_FINANCE_SUMMARY_ENDPOINT,
} from "@routes/core.api";
import {
  Transaction,
  DebtRecord,
  MonthlySummary,
} from "@interfaces/finance";

export const methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethod = (typeof methods)[keyof typeof methods];

export const CacheStrategy = {
  NONE: "no-store, no-cache, must-revalidate",
  SHORT: "public, max-age=60, stale-while-revalidate=30",
  MEDIUM: "public, max-age=300, stale-while-revalidate=60",
  LONG: "public, max-age=1800, stale-while-revalidate=120",
} as const;

export interface RouteServiceOptions {
  request: Request;
  method: HttpMethod;
  endpoint: string;
  cache?: keyof typeof CacheStrategy;
  customData?: unknown;
}

// In-memory Daily Transactions Data
const mockTransactions: Transaction[] = [
  // Hôm nay (2026-10-08)
  {
    id: "TX-108",
    type: "expense",
    category: "food",
    title: "Đi siêu thị WinMart mua thịt cá rau tối",
    amount: 215000,
    date: "2026-10-08",
    time: "18:45",
    paymentMethod: "bank_transfer",
    notes: "Nấu ăn tối 2 người",
    createdAt: "2026-10-08T18:45:00Z",
  },
  {
    id: "TX-107",
    type: "expense",
    category: "food",
    title: "Trà sữa Koi Thé với đồng nghiệp",
    amount: 42000,
    date: "2026-10-08",
    time: "15:30",
    paymentMethod: "e_wallet",
    notes: "Size M giảm giá 20%",
    createdAt: "2026-10-08T15:30:00Z",
  },
  {
    id: "TX-106",
    type: "expense",
    category: "food",
    title: "Cơm trưa văn phòng sườn bì chả",
    amount: 55000,
    date: "2026-10-08",
    time: "12:15",
    paymentMethod: "bank_transfer",
    createdAt: "2026-10-08T12:15:00Z",
  },
  {
    id: "TX-105",
    type: "expense",
    category: "transport",
    title: "Đổ xăng xe máy Petrolimex",
    amount: 80000,
    date: "2026-10-08",
    time: "09:00",
    paymentMethod: "cash",
    notes: "Xăng A95 đầy bình",
    createdAt: "2026-10-08T09:00:00Z",
  },
  {
    id: "TX-104",
    type: "expense",
    category: "food",
    title: "Cà phê muối Highlands",
    amount: 35000,
    date: "2026-10-08",
    time: "08:15",
    paymentMethod: "bank_transfer",
    createdAt: "2026-10-08T08:15:00Z",
  },
  {
    id: "TX-103",
    type: "expense",
    category: "food",
    title: "Ăn sáng phở bò tái nạm",
    amount: 45000,
    date: "2026-10-08",
    time: "07:30",
    paymentMethod: "cash",
    createdAt: "2026-10-08T07:30:00Z",
  },

  // Hôm qua (2026-10-07)
  {
    id: "TX-102",
    type: "expense",
    category: "entertainment",
    title: "Cafe bàn công việc cuối chiều",
    amount: 65000,
    date: "2026-10-07",
    time: "17:00",
    paymentMethod: "bank_transfer",
    createdAt: "2026-10-07T17:00:00Z",
  },
  {
    id: "TX-101",
    type: "expense",
    category: "shopping",
    title: "Mua sắm đồ gia dụng Miniso",
    amount: 180000,
    date: "2026-10-07",
    time: "14:20",
    paymentMethod: "bank_transfer",
    createdAt: "2026-10-07T14:20:00Z",
  },
  {
    id: "TX-100",
    type: "expense",
    category: "food",
    title: "Cơm gà xối mỡ trưa",
    amount: 50000,
    date: "2026-10-07",
    time: "12:00",
    paymentMethod: "cash",
    createdAt: "2026-10-07T12:00:00Z",
  },
  {
    id: "TX-099",
    type: "expense",
    category: "food",
    title: "Ăn sáng xôi gà xé",
    amount: 30000,
    date: "2026-10-07",
    time: "07:45",
    paymentMethod: "cash",
    createdAt: "2026-10-07T07:45:00Z",
  },

  // Các ngày trước trong tháng 10
  {
    id: "TX-098",
    type: "income",
    category: "salary",
    title: "Nhận lương tháng 9 từ công ty",
    amount: 26500000,
    date: "2026-10-05",
    time: "09:30",
    paymentMethod: "bank_transfer",
    notes: "Đã trừ bảo hiểm y tế & BHXH",
    createdAt: "2026-10-05T09:30:00Z",
  },
  {
    id: "TX-097",
    type: "income",
    category: "freelance",
    title: "Thanh toán dự án thiết kế UI/UX ngoài giờ",
    amount: 4200000,
    date: "2026-10-05",
    time: "14:00",
    paymentMethod: "bank_transfer",
    notes: "Khách hàng chuyển khoản đợt 2",
    createdAt: "2026-10-05T14:00:00Z",
  },
  {
    id: "TX-096",
    type: "expense",
    category: "housing",
    title: "Thanh toán tiền phòng & dịch vụ tháng 10",
    amount: 4800000,
    date: "2026-10-05",
    time: "10:15",
    paymentMethod: "bank_transfer",
    notes: "Bao gồm phí gửi xe và quản lý",
    createdAt: "2026-10-05T10:15:00Z",
  },
  {
    id: "TX-095",
    type: "expense",
    category: "bills",
    title: "Hóa đơn tiền điện & nước tháng 9",
    amount: 620000,
    date: "2026-10-04",
    time: "16:00",
    paymentMethod: "e_wallet",
    createdAt: "2026-10-04T16:00:00Z",
  },
  {
    id: "TX-094",
    type: "expense",
    category: "bills",
    title: "Cước mạng Internet cáp quang VNPT 6 tháng",
    amount: 1100000,
    date: "2026-10-03",
    time: "11:20",
    paymentMethod: "bank_transfer",
    notes: "Gói Home Net 200Mbps tặng 1 tháng",
    createdAt: "2026-10-03T11:20:00Z",
  },
  {
    id: "TX-093",
    type: "expense",
    category: "shopping",
    title: "Mua giày thể thao chạy bộ",
    amount: 890000,
    date: "2026-10-02",
    time: "19:30",
    paymentMethod: "credit_card",
    createdAt: "2026-10-02T19:30:00Z",
  },
];

// In-memory Debt Ledger Data
const mockDebts: DebtRecord[] = [
  {
    id: "DB-001",
    type: "lend",
    personName: "Hoàng Nam (Bạn cấp 3)",
    phoneNumber: "0908 112 233",
    amount: 3500000,
    paidAmount: 0,
    remainAmount: 3500000,
    dueDate: "2026-10-25",
    reason: "Mượn đóng tiền học lái xe B2",
    status: "unpaid",
    createdAt: "2026-10-01T10:00:00Z",
    updatedAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "DB-002",
    type: "lend",
    personName: "Tuấn Anh (Đồng nghiệp)",
    phoneNumber: "0909 445 566",
    amount: 320000,
    paidAmount: 0,
    remainAmount: 320000,
    dueDate: "2026-10-10",
    reason: "Tiền ăn trưa buffet thứ 6 tuần trước chưa chuyển",
    status: "unpaid",
    createdAt: "2026-10-06T13:00:00Z",
    updatedAt: "2026-10-06T13:00:00Z",
  },
  {
    id: "DB-003",
    type: "lend",
    personName: "Minh Khang (Em họ)",
    phoneNumber: "0903 778 899",
    amount: 1500000,
    paidAmount: 800000,
    remainAmount: 700000,
    dueDate: "2026-10-15",
    reason: "Mượn mua linh kiện máy tính, đã gửi lại 800k",
    status: "partial",
    createdAt: "2026-09-20T15:00:00Z",
    updatedAt: "2026-10-05T09:00:00Z",
  },
  {
    id: "DB-004",
    type: "borrow",
    personName: "Chị Lan (Team Lead)",
    phoneNumber: "0912 334 455",
    amount: 250000,
    paidAmount: 0,
    remainAmount: 250000,
    dueDate: "2026-10-10",
    reason: "Gom chung tiền mua quà sinh nhật sếp",
    status: "unpaid",
    createdAt: "2026-10-06T16:00:00Z",
    updatedAt: "2026-10-06T16:00:00Z",
  },
  {
    id: "DB-005",
    type: "borrow",
    personName: "Trả góp thẻ tín dụng Techcombank",
    phoneNumber: "1900 588822",
    amount: 6800000,
    paidAmount: 2200000,
    remainAmount: 4600000,
    dueDate: "2026-10-20",
    reason: "Trả góp điện thoại 0% lãi suất (còn 2 kỳ)",
    status: "partial",
    createdAt: "2026-08-20T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
];

const mockUser = {
  id: "usr-01",
  name: "Nguyễn Hải Đăng",
  email: "haidang.finance@gmail.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  role: "admin",
  phoneNumber: "0908 678 999",
};

function calculateMonthlySummary(): MonthlySummary {
  const incomes = mockTransactions.filter((t) => t.type === "income");
  const expenses = mockTransactions.filter((t) => t.type === "expense");

  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const todayExpense = expenses
    .filter((t) => t.date === "2026-10-08")
    .reduce((sum, t) => sum + t.amount, 0);

  const yesterdayExpense = expenses
    .filter((t) => t.date === "2026-10-07")
    .reduce((sum, t) => sum + t.amount, 0);

  // Sổ nợ
  const totalReceivable = mockDebts
    .filter((d) => d.type === "lend" && d.status !== "paid")
    .reduce((sum, d) => sum + d.remainAmount, 0);

  const totalPayable = mockDebts
    .filter((d) => d.type === "borrow" && d.status !== "paid")
    .reduce((sum, d) => sum + d.remainAmount, 0);

  return {
    month: "10/2026",
    totalIncome,
    totalExpense,
    balance,
    todayExpense,
    yesterdayExpense,
    dailyAverageExpense: Math.round(totalExpense / 8),
    totalReceivable,
    totalPayable,
    currency: "VND",
  };
}

function getMockResponse(
  endpoint: string,
  method: HttpMethod,
  payload?: any,
  request?: Request
) {
  if (endpoint === CORE_AUTH_SIGNIN_ENDPOINT) {
    return {
      code: 200,
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: mockUser,
        accessToken: "mock-jwt-finance-token-enterprise",
        refreshToken: "mock-jwt-finance-refresh-enterprise",
      },
    };
  }
  if (endpoint === CORE_AUTH_ME_ENDPOINT) {
    const tokenName = process.env.COOKIE_TOKEN_NAME || "vtt";
    const cookieHeader = request?.headers.get("cookie") || "";
    const hasToken =
      cookieHeader.includes(`${tokenName}=`) ||
      Boolean(request?.headers.get("authorization"));

    if (!hasToken) {
      return {
        code: 401,
        success: false,
        message: "Chưa đăng nhập",
        data: null,
      };
    }

    return {
      code: 200,
      success: true,
      data: mockUser,
    };
  }
  if (endpoint === CORE_AUTH_SIGNOUT_ENDPOINT) {
    return { code: 200, success: true, message: "Đăng xuất thành công", data: null };
  }
  if (endpoint === CORE_FINANCE_SUMMARY_ENDPOINT) {
    return {
      code: 200,
      success: true,
      data: calculateMonthlySummary(),
    };
  }
  if (endpoint === CORE_TRANSACTION_LIST_ENDPOINT) {
    return {
      code: 200,
      success: true,
      data: {
        items: mockTransactions,
        summary: calculateMonthlySummary(),
      },
      meta: {
        total: mockTransactions.length,
        page: 1,
        pageSize: 50,
      },
    };
  }
  if (endpoint === CORE_TRANSACTION_CREATE_ENDPOINT && method === "POST") {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    const newTx: Transaction = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      type: payload?.type || "expense",
      category: payload?.category || "food",
      title: payload?.title || "Khoản chi tiêu mới",
      amount: Number(payload?.amount) || 0,
      date: payload?.date || "2026-10-08",
      time: payload?.time || `${hh}:${mm}`,
      paymentMethod: payload?.paymentMethod || "cash",
      notes: payload?.notes || "",
      createdAt: now.toISOString(),
    };

    mockTransactions.unshift(newTx);

    return {
      code: 201,
      success: true,
      message: "Ghi chép giao dịch thành công",
      data: newTx,
    };
  }
  if (endpoint === CORE_TRANSACTION_DELETE_ENDPOINT && method === "POST") {
    const id = payload?.id;
    const index = mockTransactions.findIndex((t) => t.id === id);
    if (index !== -1) {
      mockTransactions.splice(index, 1);
    }
    return { code: 200, success: true, message: "Xóa giao dịch thành công", data: null };
  }
  if (endpoint === CORE_DEBT_LIST_ENDPOINT) {
    return {
      code: 200,
      success: true,
      data: {
        items: mockDebts,
        summary: calculateMonthlySummary(),
      },
      meta: {
        total: mockDebts.length,
      },
    };
  }
  if (endpoint === CORE_DEBT_CREATE_ENDPOINT && method === "POST") {
    const amount = Number(payload?.amount) || 0;
    const newDebt: DebtRecord = {
      id: `DB-${Math.floor(100 + Math.random() * 900)}`,
      type: payload?.type || "lend",
      personName: payload?.personName || "Người quen",
      phoneNumber: payload?.phoneNumber || "",
      amount,
      paidAmount: 0,
      remainAmount: amount,
      dueDate: payload?.dueDate || "2026-10-30",
      reason: payload?.reason || "",
      status: "unpaid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDebts.unshift(newDebt);

    return {
      code: 201,
      success: true,
      message: "Thêm vào sổ nợ thành công",
      data: newDebt,
    };
  }
  if (endpoint === CORE_DEBT_UPDATE_ENDPOINT && method === "POST") {
    const { id, status, paidAmount } = payload || {};
    const debt = mockDebts.find((d) => d.id === id);
    if (debt) {
      if (status === "paid") {
        debt.status = "paid";
        debt.paidAmount = debt.amount;
        debt.remainAmount = 0;
      } else if (paidAmount !== undefined) {
        debt.paidAmount = Number(paidAmount);
        debt.remainAmount = Math.max(debt.amount - debt.paidAmount, 0);
        debt.status = debt.remainAmount === 0 ? "paid" : "partial";
      }
      debt.updatedAt = new Date().toISOString();
    }
    return { code: 200, success: true, message: "Cập nhật sổ nợ thành công", data: debt };
  }
  if (endpoint === CORE_DEBT_DELETE_ENDPOINT && method === "POST") {
    const id = payload?.id;
    const index = mockDebts.findIndex((d) => d.id === id);
    if (index !== -1) {
      mockDebts.splice(index, 1);
    }
    return { code: 200, success: true, message: "Xóa khoản nợ thành công", data: null };
  }

  return null;
}

/**
 * Standardized Route Handler wrapper for Next.js BFF Layer
 */
export async function RouteService({
  request,
  method,
  endpoint,
  cache = "NONE",
  customData,
}: RouteServiceOptions): Promise<Response> {
  let payload = customData;
  if (!payload && (method === "POST" || method === "PUT" || method === "PATCH")) {
    try {
      payload = await request.json();
    } catch {
      payload = undefined;
    }
  }

  let result: any = null;

  // Use local mock layer for standalone development / demo
  const isMockMode = process.env.USE_MOCK !== "false";
  if (isMockMode) {
    const mock = getMockResponse(endpoint, method, payload, request);
    if (mock) {
      result = mock;
    }
  }

  if (!result) {
    try {
      const url = new URL(request.url);
      const searchParams = Object.fromEntries(url.searchParams.entries());

      switch (method) {
        case methods.GET:
          result = await serverService.get(endpoint, searchParams);
          break;
        case methods.POST:
          result = await serverService.post(endpoint, payload);
          break;
        case methods.PUT:
          result = await serverService.put(endpoint, payload);
          break;
        case methods.PATCH:
          result = await serverService.patch(endpoint, payload);
          break;
        case methods.DELETE:
          result = await serverService.delete(endpoint);
          break;
      }
    } catch (error: any) {
      const fallbackMock = getMockResponse(endpoint, method, payload, request);
      if (fallbackMock) {
        result = fallbackMock;
      } else {
        console.error(`[RouteService] Error proxying ${endpoint}:`, error?.message);
        const status = error?.response?.status || 500;
        return NextResponse.json(
          {
            code: status,
            success: false,
            message: error?.message || "Internal Server Error in BFF Proxy",
          },
          { status }
        );
      }
    }
  }

  const jsonString = JSON.stringify(result);
  const etag = `W/"${CryptoJS.MD5(jsonString).toString()}"`;

  const clientEtag = request.headers.get("if-none-match");
  if (clientEtag && clientEtag === etag) {
    return new Response(null, { status: 304 });
  }

  const response = NextResponse.json(result, {
    status: result?.code && result.code >= 200 && result.code < 600 ? result.code : 200,
  });

  // Set HTTP-Only cookies for Auth
  if (endpoint === CORE_AUTH_SIGNIN_ENDPOINT && result?.data?.accessToken) {
    const tokenName = process.env.COOKIE_TOKEN_NAME || "vtt";
    const refreshTokenName = process.env.COOKIE_REFRESH_TOKEN_NAME || "vttr";
    response.cookies.set(tokenName, result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    if (result.data.refreshToken) {
      response.cookies.set(refreshTokenName, result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }
  }

  // Clear cookie on signout
  if (endpoint === CORE_AUTH_SIGNOUT_ENDPOINT) {
    const tokenName = process.env.COOKIE_TOKEN_NAME || "vtt";
    const refreshTokenName = process.env.COOKIE_REFRESH_TOKEN_NAME || "vttr";
    response.cookies.delete(tokenName);
    response.cookies.delete(refreshTokenName);
  }

  response.headers.set("ETag", etag);
  response.headers.set("Cache-Control", CacheStrategy[cache] || CacheStrategy.NONE);

  return response;
}
