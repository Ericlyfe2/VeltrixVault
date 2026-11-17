export type ApiFailure = {
  ok: false;
  status: number;
  message: string;
  error?: string;
  fields?: Record<string, string>;
};

export type ApiSuccess<T> = { ok: true; status: number; data: T };

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export async function requestJson<T>(
  url: string,
  options: {
    method?: "GET" | "POST" | "DELETE" | "PATCH";
    body?: unknown;
    signal?: AbortSignal;
  } = {},
): Promise<ApiResult<T>> {
  const { method = "GET", body, signal } = options;

  try {
    const response = await fetch(url, {
      method,
      signal,
      cache: "no-store",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const data = (await response.json().catch(() => null)) as
      | (T & { message?: string; error?: string; fields?: Record<string, string> })
      | null;

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: data?.message ?? "Something went wrong. Please try again.",
        error: data?.error,
        fields: data?.fields,
      };
    }

    return { ok: true, status: response.status, data: data as T };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return {
      ok: false,
      status: 0,
      message: "The request could not reach the server. Check your connection and try again.",
    };
  }
}
