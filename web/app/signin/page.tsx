"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/validations/auth.schema";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/services/api";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Endpoint do Spring Boot para login (EXEMPLO 1 usa /auth/login)
      const response = await api.post("/auth/login", data);
      
      // Salva o token no header do axios se não for via HttpOnly
      if (response.data.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      }

      // Salva dados no Zustand
      login({
        id: response.data.id || 1, // Ajuste conforme o retorno da sua API
        firstName: response.data.firstName || "Usuário",
        lastName: response.data.lastName || "",
        email: data.email,
        role: response.data.role || "CLIENT",
      });

      toast.success("Login realizado com sucesso!");
      router.push("/"); // Volta para home
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "E-mail ou senha incorretos."
        );
      } else {
        toast.error("Erro inesperado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090"}/oauth2/authorization/google`;
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 bg-muted/30">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-full">
            <LogIn className="h-6 w-6" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Bem-vindo de volta</h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          Faça login para continuar suas compras
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className={`w-full p-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 ${
                errors.email ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20 focus:border-primary"
              }`}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <span className="text-xs text-destructive mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                className={`w-full p-3 pr-10 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 ${
                  errors.password ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20 focus:border-primary"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-destructive mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-background border border-border text-foreground hover:bg-muted/50 font-semibold rounded-lg transition-colors flex justify-center items-center gap-2 border-input"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Entrar com Google
        </button>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}

