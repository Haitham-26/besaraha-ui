import { proxyRequest } from "@/tools/proxyRequest";

export async function GET() {
  return await proxyRequest(`/settings`, {
    method: "GET",
  });
}
