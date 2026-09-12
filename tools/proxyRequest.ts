import { NextResponse } from "next/server";
import { AuthClient } from "./AuthClient";
import { AxiosRequestConfig } from "axios";
import getToken from "./getToken";

export async function proxyRequest(
  url: string,
  config?: AxiosRequestConfig,
): Promise<Response> {
  const token = await getToken();

  try {
    const { data } = await AuthClient(url, config, token);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(error?.response?.data || "Internal Server Error", {
      status: error?.response?.status || 500,
    });
  }
}
