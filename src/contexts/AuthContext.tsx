import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { authApi, getToken, setToken, removeToken, type AuthResponse } from "@/lib/api";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  memberSince: string;
};

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
};

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: if token exists, fetch the profile to restore session
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .getProfile()
      .then((profile) => setUser(profile as User))
      .catch(() => removeToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        // Try real API first
        const res: AuthResponse = await authApi.login({ email, password });
        setToken(res.token);
        setUser(res.user as User);
        return { ok: true };
      } catch {
        // ── MOCK fallback (remove when backend is ready) ──────────────────
        if (!email.includes("@")) return { ok: false, error: "بريد إلكتروني غير صحيح" };
        await new Promise((r) => setTimeout(r, 600));
        setUser({
          id: crypto.randomUUID(),
          name: email.split("@")[0],
          email,
          loyaltyPoints: 1240,
          memberSince: "2023",
        });
        return { ok: true };
        // ──────────────────────────────────────────────────────────────────
      }
    },
    [],
  );

  const register = useCallback(
    async (data: RegisterData): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res: AuthResponse = await authApi.register(data);
        setToken(res.token);
        setUser(res.user as User);
        return { ok: true };
      } catch {
        // ── MOCK fallback ─────────────────────────────────────────────────
        if (!data.email.includes("@")) return { ok: false, error: "بريد إلكتروني غير صحيح" };
        await new Promise((r) => setTimeout(r, 700));
        setUser({
          id: crypto.randomUUID(),
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          loyaltyPoints: 0,
          memberSince: new Date().getFullYear().toString(),
        });
        return { ok: true };
        // ──────────────────────────────────────────────────────────────────
      }
    },
    [],
  );

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    removeToken();
    setUser(null);
    toast.success("تم تسجيل الخروج بنجاح");
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
