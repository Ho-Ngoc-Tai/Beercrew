import { CORE_TRANSACTION_LIST_ENDPOINT } from "@routes/core.api";
import { methods, RouteService } from "@services/route-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  return RouteService({
    request,
    method: methods.GET,
    endpoint: CORE_TRANSACTION_LIST_ENDPOINT,
    cache: "SHORT",
  });
}
