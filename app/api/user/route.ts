import { proxyRequest } from "@/tools/proxyRequest";

export async function GET() {
  return await proxyRequest(`/user`, {
    method: "GET",
  });
}
