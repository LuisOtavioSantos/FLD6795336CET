"use client";

/**
 * ProductSkeleton — Placeholder translúcido que imita o formato do ProductCard.
 * É exibido enquanto os produtos estão carregando ou quando o backend está fora do ar.
 * O usuário não vê nenhuma mensagem de erro; apenas vê "cards fantasma" pulsando.
 */
export function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col h-full animate-pulse">
      {/* Imagem placeholder */}
      <div className="aspect-square bg-muted/40 w-full rounded-t-2xl" />

      <div className="p-5 flex flex-col flex-1">
        {/* Título + Categoria */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="h-5 bg-muted/50 rounded w-2/3" />
          <div className="h-5 bg-muted/30 rounded-full w-16" />
        </div>

        {/* Descrição */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="h-3 bg-muted/30 rounded w-full" />
          <div className="h-3 bg-muted/30 rounded w-5/6" />
          <div className="h-3 bg-muted/30 rounded w-4/6" />
        </div>

        {/* Preço + Botão */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="h-7 bg-muted/50 rounded w-24" />
          <div className="h-10 w-10 bg-muted/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * ProductSkeletonGrid — Renderiza uma grade de N skeletons.
 * @param count Quantidade de skeletons a mostrar (default: 8)
 */
export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
