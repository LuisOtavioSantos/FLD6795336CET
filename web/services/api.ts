import axios from "axios";

// Puxa a URL do Spring Boot local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Importante para enviar cookies/JWT caso configurado
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Requisição: Injeta o Token JWT antes de sair
api.interceptors.request.use((config) => {
  // Lemos o token diretamente do localStorage onde o Zustand salvou
  if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.user?.token) {
          config.headers.Authorization = `Bearer ${state.user.token}`;
        }
      } catch (error) {
        console.error("Erro ao ler token JWT do localStorage");
      }
    }
  }
  return config;
});

// Interceptor para tratamento de erro global (ex: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        console.warn("Sessão expirada ou não autorizado.");
        // Opcional: localStorage.removeItem("auth-storage") para deslogar
      }
    }
    return Promise.reject(error);
  }
);
