import { proxyRequest } from "@/tools/proxyRequest";
import { NextRequest } from "next/server";

type Context = {
  params: Promise<{ username: string }>;
};

export async function POST(req: NextRequest, context: Context) {
  const { username } = await context.params;

  return await proxyRequest(`/messages/${username}/profile`, {
    method: "GET",
  });
}
