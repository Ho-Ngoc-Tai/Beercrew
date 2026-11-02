export type AssetCategory =
  | "cash"
  | "stocks"
  | "real_estate"
  | "crypto"
  | "gold"
  | "vehicle"
  | "debt";

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  institution?: string; // e.g. Vietcombank, VPS, Binance, PNJ, SJC
  initialValue: number; // Giá trị mua vào / gốc
  currentValue: number; // Giá trị thị trường hiện tại
  currency: "VND" | "USD";
  pnl: number; // Lời / lỗ = currentValue - initialValue
  pnlPercentage: number; // % Tăng/giảm
  acquiredDate: string; // Ngày mua / tạo
  lastValuationDate: string; // Ngày định giá gần nhất
  status: "active" | "liquidated" | "locked";
  notes?: string;
  allocationPercentage?: number;
}

export interface AssetCategorySummary {
  category: AssetCategory;
  label: string;
  totalValue: number;
  count: number;
  percentage: number;
  color: string;
}

export interface NetWorthSummary {
  totalAssets: number; // Tổng tài sản có
  totalLiabilities: number; // Tổng nợ
  netWorth: number; // Tài sản ròng
  monthlyGrowthAmount: number;
  monthlyGrowthRate: number;
  currency: "VND";
}
