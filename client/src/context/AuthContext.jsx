import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Axios instance with base config
  const authAxios = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  // Request interceptor
  useEffect(() => {
    const requestInterceptor = authAxios.interceptors.request.use((config) => {
      if (!config.headers.Authorization) {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => authAxios.interceptors.request.eject(requestInterceptor);
  }, []);

  // Response interceptor with refresh logic
  useEffect(() => {
    const responseInterceptor = authAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { data } = await authAxios.post("/api/auth/refresh-token");
            localStorage.setItem("accessToken", data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return authAxios(originalRequest);
          } catch (refreshError) {
            await logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => authAxios.interceptors.response.eject(responseInterceptor);
  }, []);

  // Auth check with proper error handling
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await authAxios.get("/api/users/me");
      setUser({
        ...data.user,
        isAdmin: data.user?.roles?.includes("admin") || false,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login with cookie handling
  const login = async (email, password) => {
    try {
      const { data } = await authAxios.post("/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Authentication failed",
      };
    }
  };

  // Registration with error handling
  const register = async (userData) => {
    try {
      const { data } = await authAxios.post("/api/users/register", userData);
      await checkAuth();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Enhanced logout
  const logout = async () => {
    try {
      await authAxios.post("/api/users/logout");
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      delete authAxios.defaults.headers.common.Authorization;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
