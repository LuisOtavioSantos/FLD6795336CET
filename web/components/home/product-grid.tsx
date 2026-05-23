"use client";

import { useProductsQuery } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ecommerce/product-card";
import { ProductSkeletonGrid } from "@/components/ecommerce/product-skeleton";
// Alternativa : Componente com spinner ao invés de skeletons
// import { ProductLoading } from "@/components/ecommerce/product-loading";

export function ProductGrid() {
  const { data: products, isLoading, isError } = useProductsQuery();

  // Enquanto estiver carregando OU com erro (retentando em background),
  // mostramos os placeholders translúcidos. O usuário nunca vê mensagem de erro.
  const showSkeleton = isLoading || (isError && (!products || products.length === 0));

  return (
    <section id="products" className="container mx-auto px-4 py-24 max-w-screen-xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Nossos Produtos
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Confira as últimas novidades com preços imbatíveis.
        </p>
      </div>

      {/* Skeleton placeholders — aparecem no loading e enquanto retenta conexão */}
      {showSkeleton && <ProductSkeletonGrid count={8} />}

      {/* Spinner */}
      {/* {showSkeleton && <ProductLoading />} */}

      {!showSkeleton && products?.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p>Nenhum produto encontrado na base de dados.</p>
        </div>
      )}

      {!showSkeleton && products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
