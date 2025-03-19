// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [loading, setLoading] = useState(true);


//   // Function to decode JWT token safely
//   const decodeToken = (token) => {
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return { id: payload.userId, email: payload.email };
//     } catch (error) {
//       console.error("Invalid token:", error);
//       return null;
//     }
//   };

//   // Load user from token
//   useEffect(() => {
//     const loadUser = async () => {
//       if (token) {
//         const decodedUser = decodeToken(token);
//         if (decodedUser) {
//           setUser(decodedUser);
//           axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//         } else {
//           logout();
//         }
//       }
//       setLoading(false);
//     };

//     loadUser();
//   }, [token]);

//   // Login function
//   const login = async (email, password) => {
//     try {
//       const res = await axios.post("/api/users/login", {
//         email,
//         password,
//       });

//       const { token, user } = res.data;
      
    

//       // Save token to local storage
//       localStorage.setItem("token", token);
//       setToken(token);
//       setUser(user);

//       // Set axios default headers
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || "Login failed",
//       };
//     }
//   };

//   // Register function
//   const register = async (username, email, password) => {
//     try {
//       const res = await axios.post("/api/users/register", {
//         username,
//         email,
//         password,
//       });

//       const { token, user } = res.data;

//       // Save token to local storage
//       localStorage.setItem("token", token);
//       setToken(token);
//       setUser(user);

//       // Set axios default headers
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || "Registration failed",
//       };
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//     delete axios.defaults.headers.common["Authorization"];
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         login,
//         register,
//         logout,
//         isAuthenticated: !!token,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { ApiError } from "../utils/ApiError";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data } = await axios.post("/api/auth/refresh-token");
            localStorage.setItem("accessToken", data.accessToken);
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

// Update checkAuth useEffect
useEffect(() => {
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/users/me", {
        withCredentials: true
      });
    // Ensure backend returns isAdmin in the response
    setUser({
      ...data.user,
      isAdmin: data.user.isAdmin
    });
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };
  checkAuth();
}, []);

// Update login and register functions
const login = async (email, password) => {
  try {
    const { data } = await axios.post("/api/users/login", { email, password });
    
    // Store tokens in cookies (httpOnly)
    document.cookie = `accessToken=${data.accessToken}; Path=/; Secure; SameSite=Strict`;
    document.cookie = `refreshToken=${data.refreshToken}; Path=/; Secure; SameSite=Strict`;

    setUser(data.user);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed"
    };
  }
};

  // Register function
  const register = async (username, email, password, isAdmin = false) => {
    try {
      const { data } = await axios.post("/api/users/register", {
        username,
        email,
        password,
        isAdmin,
      });

      setUser(data.user);
      return { success: true };
      console.log("Registration");
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
    } finally {
      setUser(null);
      localStorage.removeItem("accessToken");
      delete axios.defaults.headers.common.Authorization;
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
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);