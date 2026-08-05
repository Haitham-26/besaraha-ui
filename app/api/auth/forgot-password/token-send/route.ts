import { proxyRequest } from "@/tools/proxyRequest";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return await proxyRequest(`/auth/forgot-password/token-send`, {
    method: "POST",
    data: await req.json(),
  });
}
