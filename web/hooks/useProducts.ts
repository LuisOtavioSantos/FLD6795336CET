"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Product } from "@/types/product";

async function fetchProducts(): Promise<Product[]> {
  // Chamada ao backend Spring Boot
  const { data } = await api.get("/product");
  return data;
}

export function useProductsQuery() {
  return useQuery({
    queryKey: ["products"], // qual chave/url
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    // O React Query gerencia isso nativamente — não precisa do axios-retry.
    retry: true,              // Ativa retry infinito
    retryDelay: 10_000,       // Intervalo fixo de 10 segundos entre tentativas
  });
}
