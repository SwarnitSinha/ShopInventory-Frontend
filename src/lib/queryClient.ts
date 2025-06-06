import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  token?: string | undefined,
): Promise<Response> {
  console.log(`API Request: ${method} ${url}`, data);

  // Determine headers and body based on the type of `data`
  const isFormData = data instanceof FormData;
  const headers = new Headers();

  if (!isFormData) {
    headers.append('Content-Type', 'application/json');
  }
  const tokenInLocal = localStorage.getItem("token");

  if (tokenInLocal) {
    headers.append('Authorization', `Bearer ${tokenInLocal}`);
  }

  const body = isFormData ? (data as FormData) : data ? JSON.stringify(data) : undefined;

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const fullUrl = `${baseUrl}${url}`;

  console.log("full URL", fullUrl);

  const res = await fetch(fullUrl, {
    method,
    headers,
    body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
