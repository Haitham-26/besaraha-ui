import { proxyRequest } from "@/tools/proxyRequest";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  return await proxyRequest(`/message/messages`, {
    method: "GET",
    params: {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      isStarred: searchParams.get("isStarred"),
      sort: searchParams.get("sort"),
    },
  });
}
