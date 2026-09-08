import { proxyRequest } from "@/tools/proxyRequest";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return await proxyRequest(`/replies/toggle-like`, {
    method: "POST",
    data: await req.json(),
  });
}
