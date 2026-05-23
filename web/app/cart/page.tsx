"use client";

import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ShoppingBag, Trash2, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CarrinhoPage() {
  const { items, removeItem, totalPrice, totalItems } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.warning("Você precisa fazer login para finalizar a compra.");
      router.push("/signin");
      return;
    }
    
    toast.success(`Pedido realizado com sucesso, ${user?.firstName}!`);
    // Aqui você enviaria os itens para o backend (/purchases) via Axios
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-24 h-24 bg-muted/50 text-muted-foreground flex items-center justify-center rounded-full mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Parece que você ainda não adicionou nenhum produto ao carrinho. Dê uma olhada em nosso catálogo!
        </p>
        <Link
          href="/#products"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          Explorar Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-screen-xl flex-1">
      <h1 className="text-3xl font-bold mb-8">Meu Carrinho</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lista de Produtos */}
        <div className="flex-1 space-y-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-6 border-b border-border last:border-0 items-center">
                <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold opacity-30">{item.name.substring(0,2)}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold truncate">{item.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1 mb-3">Categoria: {item.category}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-lg bg-background">
                      <button 
                        onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors rounded-l-lg disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-3">
                  <span className="text-xl font-black">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-destructive text-sm flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-4 h-4" /> Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo e Checkout */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-20">
            <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems()} itens)</span>
                <span className="font-medium">R$ {totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-black">R$ {totalPrice().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {isAuthenticated ? (
                <>Finalizar Compra <ArrowRight className="w-5 h-5" /></>
              ) : (
                <>Faça Login para Comprar <Lock className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
