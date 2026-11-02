import { CORE_TRANSACTION_CREATE_ENDPOINT } from "@routes/core.api";
import { methods, RouteService } from "@services/route-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return RouteService({
    request,
    method: methods.POST,
    endpoint: CORE_TRANSACTION_CREATE_ENDPOINT,
  });
}
