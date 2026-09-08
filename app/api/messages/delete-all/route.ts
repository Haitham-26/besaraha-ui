import { proxyRequest } from "@/tools/proxyRequest";

export async function DELETE() {
  return proxyRequest(`/messages/delete-all`, {
    method: "DELETE",
  });
}
