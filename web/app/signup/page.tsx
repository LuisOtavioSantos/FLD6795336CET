"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/validations/auth.schema";
import { api } from "@/services/api";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function CadastroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // O backend espera o campo "role" — definimos como CLIENT por padrão
      const payload = { ...data, role: "CLIENT" };
      const response = await api.post("/auth/register", payload);

      // NÃO logamos o usuário automaticamente!
      // A conta precisa ser verificada via e-mail antes do primeiro login.
      toast.info(
        "📧 Conta criada! Verifique seu e-mail para ativar sua conta antes de fazer login.",
        { autoClose: 8000 }
      );
      router.push("/signin");
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 400) {
        toast.error("Este e-mail já está cadastrado.");
      } else if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Erro ao criar conta. Tente novamente."
        );
      } else {
        toast.error("Erro inesperado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/30">
      <div className="w-full max-w-lg bg-card border border-border p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-full">
            <UserPlus className="h-6 w-6" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Criar Conta</h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          Preencha os dados abaixo para criar sua conta
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome e Sobrenome */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                Nome
              </label>
              <input
                {...register("firstName")}
                id="firstName"
                type="text"
                autoComplete="given-name"
                className={`w-full p-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:ring-primary/20 focus:border-primary"
                }`}
                placeholder="João"
              />
              {errors.firstName && (
                <span className="text-xs text-destructive mt-1 block">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                Sobrenome
              </label>
              <input
                {...register("lastName")}
                id="lastName"
                type="text"
                autoComplete="family-name"
                className={`w-full p-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:ring-primary/20 focus:border-primary"
                }`}
                placeholder="Silva"
              />
              {errors.lastName && (
                <span className="text-xs text-destructive mt-1 block">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              className={`w-full p-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-primary/20 focus:border-primary"
              }`}
              placeholder="joao@email.com"
            />
            {errors.email && (
              <span className="text-xs text-destructive mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`w-full p-3 pr-10 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:ring-primary/20 focus:border-primary"
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
              <span className="text-xs text-destructive mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="address">
              Endereço
            </label>
            <input
              {...register("address")}
              id="address"
              type="text"
              autoComplete="street-address"
              className={`w-full p-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 ${
                errors.address
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-primary/20 focus:border-primary"
              }`}
              placeholder="Rua Exemplo, 123"
            />
            {errors.address && (
              <span className="text-xs text-destructive mt-1 block">
                {errors.address.message}
              </span>
            )}
          </div>

          {/* Gênero */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="gender">
              Gênero
            </label>
            <select
              {...register("gender")}
              id="gender"
              className={`w-full p-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 ${
                errors.gender
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-primary/20 focus:border-primary"
              }`}
            >
              <option value="">Selecione...</option>
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
              <option value="OTHER">Outro</option>
            </select>
            {errors.gender && (
              <span className="text-xs text-destructive mt-1 block">
                {errors.gender.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Criar Conta"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            href="/signin"
            className="text-primary hover:underline font-medium"
          >
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
