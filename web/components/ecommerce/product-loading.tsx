"use client";

import { Loader2 } from "lucide-react";

/**
 * ProductLoading — Componente alternativo de loading com spinner central.
 * Pode ser usado no lugar do ProductSkeletonGrid caso queira demonstrar
 * outra abordagem de loading para os alunos.
 *
 * Uso:
 *   import { ProductLoading } from "@/components/ecommerce/product-loading";
 *   {isLoading && <ProductLoading />}
 */
export function ProductLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
      <p className="text-sm font-medium">Carregando catálogo...</p>
    </div>
  );
}
