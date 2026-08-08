import { proxyRequest } from "@/tools/proxyRequest";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  return await proxyRequest(`/replies/${searchParams.get("questionId")}/all`, {
    method: "GET",
    params: {
      userId: searchParams.get("userId"),
    },
  });
}
