import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const getToken = () => localStorage.getItem("accessToken");

  const isTokenValid = useCallback(() => {
    const token = getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return {
    getToken,
    isTokenValid,
    logout,
  };
};
