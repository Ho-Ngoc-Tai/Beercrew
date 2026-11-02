import { redirect } from "next/navigation";
import { DASHBOARD_PAGE } from "@routes/web";

export default function RootPage() {
  redirect(DASHBOARD_PAGE);
}
