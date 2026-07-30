// ═══════════════════════════════════════════════════════════════════
//  YasRose — API Service Layer
//  كل الـ API calls هتمر من هنا لما تتربط بالـ backend
// ═══════════════════════════════════════════════════════════════════

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

// ─── Token helpers ────────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem("yasrose_token");
}
export function setToken(t: string) {
  localStorage.setItem("yasrose_token", t);
}
export function removeToken() {
  localStorage.removeItem("yasrose_token");
}

// ─── API Error class ──────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 — token expired
  if (res.status === 401) {
    removeToken();
    window.location.href = "/login";
    throw new ApiError(401, "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً");
  }

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message =
      (data as { message?: string })?.message ??
      `خطأ في الاتصال (${res.status})`;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

// ─── HTTP helpers ─────────────────────────────────────────────────
export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

// ═══════════════════════════════════════════════════════════════════
//  Auth Endpoints
// ═══════════════════════════════════════════════════════════════════
export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};
export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    loyaltyPoints: number;
    memberSince: string;
  };
};

export const authApi = {
  login: (data: LoginPayload) => api.post<AuthResponse>("/auth/login", data),
  register: (data: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", data),
  logout: () => api.post<void>("/auth/logout", {}),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>("/auth/reset-password", { token, password }),
  getProfile: () => api.get<AuthResponse["user"]>("/auth/me"),
  updateProfile: (data: Partial<AuthResponse["user"]>) =>
    api.put<AuthResponse["user"]>("/auth/me", data),
};

// ═══════════════════════════════════════════════════════════════════
//  Products Endpoints
// ═══════════════════════════════════════════════════════════════════
export type ProductFilters = {
  category?: string;
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "bestseller";
  page?: number;
  limit?: number;
};

export const productsApi = {
  list: (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined) params.set(k, String(v));
      });
    }
    return api.get<{ products: unknown[]; total: number; page: number; pages: number }>(
      `/products?${params}`,
    );
  },
  getBySlug: (slug: string) => api.get<unknown>(`/products/${slug}`),
  getRelated: (slug: string) => api.get<unknown[]>(`/products/${slug}/related`),
};

// ═══════════════════════════════════════════════════════════════════
//  Orders Endpoints
// ═══════════════════════════════════════════════════════════════════
export type OrderItem = {
  productSlug: string;
  qty: number;
  selectedColor: number;
  selectedSize: number;
  giftCard?: boolean;
  luxuryWrap?: boolean;
  note?: string;
};
export type CreateOrderPayload = {
  items: OrderItem[];
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    district: string;
    street: string;
    building?: string;
    note?: string;
  };
  shippingOption: number;
  paymentMethod: string;
  couponCode?: string;
};
export type Order = {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
};

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    api.post<{ orderId: string; order: Order }>("/orders", payload),
  list: () => api.get<Order[]>("/orders"),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  track: (id: string) => api.get<{ steps: unknown[] }>(`/orders/${id}/track`),
};

// ═══════════════════════════════════════════════════════════════════
//  Addresses Endpoints
// ═══════════════════════════════════════════════════════════════════
export type Address = {
  id: string;
  label: string;
  city: string;
  district: string;
  street: string;
  building?: string;
  isDefault: boolean;
};

export const addressesApi = {
  list: () => api.get<Address[]>("/addresses"),
  create: (data: Omit<Address, "id">) =>
    api.post<Address>("/addresses", data),
  update: (id: string, data: Partial<Omit<Address, "id">>) =>
    api.put<Address>(`/addresses/${id}`, data),
  delete: (id: string) => api.delete<void>(`/addresses/${id}`),
  setDefault: (id: string) =>
    api.patch<Address>(`/addresses/${id}/default`, {}),
};

// ═══════════════════════════════════════════════════════════════════
//  Contact / Newsletter Endpoints
// ═══════════════════════════════════════════════════════════════════
export const contactApi = {
  send: (data: {
    name: string;
    phone: string;
    email: string;
    type: string;
    message: string;
  }) => api.post<{ message: string }>("/contact", data),
  subscribe: (email: string) =>
    api.post<{ message: string }>("/newsletter/subscribe", { email }),
};

// ═══════════════════════════════════════════════════════════════════
//  Coupons Endpoint
// ═══════════════════════════════════════════════════════════════════
export const couponsApi = {
  validate: (code: string, subtotal: number) =>
    api.post<{ discount: number; type: "percent" | "fixed"; message: string }>(
      "/coupons/validate",
      { code, subtotal },
    ),
};
