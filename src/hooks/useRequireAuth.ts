import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Redirects to /login if the user is not authenticated.
 * Returns { user, isLoading } for convenience.
 */
export function useRequireAuth() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, isLoading, navigate]);

  return { user, isLoading };
}
