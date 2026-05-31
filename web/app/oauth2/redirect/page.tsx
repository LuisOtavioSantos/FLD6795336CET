"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/services/api";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

function RedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Injeta o token recebido no header global da API
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Requisita os dados do usuário autenticado no backend
      api.get("/auth/me")
        .then((response) => {
          login({
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            role: response.data.role,
            token: token, // Salva o token no Zustand para persistência
          });
          toast.success("Login com Google realizado com sucesso!");
          router.push("/");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Erro ao obter dados do perfil do Google.");
          router.push("/signin");
        });
    } else {
      toast.error("Falha na autenticação via Google.");
      router.push("/signin");
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm font-medium">
        Finalizando autenticação segura com o Google...
      </p>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">
          Carregando redirecionamento...
        </p>
      </div>
    }>
      <RedirectHandler />
    </Suspense>
  );
}
