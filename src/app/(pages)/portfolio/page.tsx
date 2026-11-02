import { redirect } from "next/navigation";
import { EXPENSES_PAGE } from "@routes/web";

export default function PortfolioPage() {
  redirect(EXPENSES_PAGE);
}
