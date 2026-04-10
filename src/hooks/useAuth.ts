import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import { useState } from "react";
import { authService } from "@/services/api/authService";
import { LoginDto } from "@/types/auth-types";
import { useAppDispatch } from "@/store";
import { clearAuth, setAuth } from "@/store/slices/authSlice";

export function useAuth() {
  const authState = useSelector((state: IRootState) => state.auth);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(false);
    setError(null);
    try {
      await authService.logout();
      dispatch(clearAuth());
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const login = async (loginDto: LoginDto): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(loginDto);
      dispatch(setAuth({accessToken: response.accessToken, 
        refreshToken: response.refreshToken, user: response.user}));
      return true;
    } catch (error) {
     setError(" Please check your email and password " + error);
     setIsLoading(false);
      return false;
    }
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    error,
    logout,
    login,
  };
}
