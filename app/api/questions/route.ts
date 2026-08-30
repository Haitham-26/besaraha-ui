import { proxyRequest } from "@/tools/proxyRequest";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  return await proxyRequest("/questions", {
    method: "GET",
    params: {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      isPublic: searchParams.get("isPublic"),
      sort: searchParams.get("sort"),
    },
  });
}
