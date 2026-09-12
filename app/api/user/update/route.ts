import { proxyRequest } from "@/tools/proxyRequest";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();

  return await proxyRequest("/user/update", {
    method: "PATCH",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
