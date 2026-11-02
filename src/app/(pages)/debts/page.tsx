import { DebtsFeature } from "@features/debts";

export const metadata = {
  title: "Sổ Nợ & Cho Vay Cá Nhân | FinFlow",
  description: "Theo dõi người khác nợ tôi và tôi nợ người khác, ngày hẹn trả nợ và nhắc nợ",
};

export default function DebtsPage() {
  return <DebtsFeature />;
}
