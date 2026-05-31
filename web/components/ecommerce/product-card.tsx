import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50 flex flex-col h-full">
      <Link href={`/product/${product.id}`} className="aspect-square bg-muted/30 w-full flex items-center justify-center relative overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={product.imageUrl.startsWith("http") ? product.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090"}${product.imageUrl}`} 
            alt={product.name} 
            loading="lazy" 
            decoding="async"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <span className="text-4xl text-muted-foreground/30 font-bold uppercase">{product.name.slice(0,2)}</span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/product/${product.id}`} className="hover:underline">
            <h3 className="text-lg font-bold line-clamp-2">{product.name}</h3>
          </Link>
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
            {product.category}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2 flex-1">
          {product.description}
        </p>
        
        {product.vendorName && (
          <p className="text-xs font-semibold text-muted-foreground mb-4">
            Vendido por: <span className="text-foreground">{product.vendorName}</span>
          </p>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <span className="text-2xl font-black">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
