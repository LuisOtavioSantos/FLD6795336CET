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
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
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
            <input
              {...register("password")}
              id="password"
              type="password"
              className={`w-full p-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 ${
                errors.password ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20 focus:border-primary"
              }`}
              placeholder="••••••••"
            />
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
