import { ExpensesFeature } from "@features/expenses";

export const metadata = {
  title: "Nhật Ký Thu Chi Hàng Ngày | FinFlow",
  description: "Liệt kê chi tiết số tiền và chi tiêu trong ngày, tính tổng tháng, tổng thu và chi",
};

export default function ExpensesPage() {
  return <ExpensesFeature />;
}
