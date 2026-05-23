"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/product";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, use } from "react";
import { toast } from "react-toastify";
import { ShoppingCart, Star, MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Definindo o tipo Comment localmente
interface ProductComment {
  id: number;
  text: string;
  rating: number;
  createdAt: string;
  clientId: number;
  clientFirstName: string;
  clientLastName: string;
}

export default function ProdutoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated, user } = useAuthStore();

  // Busca detalhes do produto
  const { data: product, isLoading: isProductLoading, isError: isProductError } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await api.get(`/product/${productId}`);
      return data;
    },
    retry: false
  });

  // Busca comentários do produto
  const { data: comments, isLoading: isCommentsLoading, refetch: refetchComments } = useQuery<ProductComment[]>({
    queryKey: ["product-comments", productId],
    queryFn: async () => {
      const { data } = await api.get(`/product/${productId}/comments`);
      return data;
    },
    retry: false
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.name} adicionado ao carrinho!`);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning("Você precisa fazer login para avaliar.");
      router.push("/signin");
      return;
    }
    
    if (newComment.trim().length < 5) {
      toast.error("O comentário precisa ter pelo menos 5 caracteres.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/product/${productId}/comments`, {
        text: newComment,
        rating
      });
      toast.success("Avaliação enviada com sucesso!");
      setNewComment("");
      setRating(5);
      refetchComments();
    } catch (error: unknown) {
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isProductLoading) {
    return <div className="flex-1 flex justify-center items-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  if (isProductError || !product) {
    return <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
      <Link href="/#products" className="text-primary hover:underline flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Voltar para loja</Link>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-screen-xl flex-1">
      <Link href="/#products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Imagem */}
        <div className="aspect-square bg-muted/30 rounded-3xl overflow-hidden border border-border shadow-sm flex items-center justify-center relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl.startsWith("http") ? product.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090"}${product.imageUrl}`} 
              alt={product.name} 
              className="object-cover w-full h-full" 
            />
          ) : (
            <span className="text-7xl text-muted-foreground/30 font-black uppercase">{product.name.substring(0, 2)}</span>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {product.category}
            </span>
          </div>
          <h1 className="text-4xl font-black mb-4">{product.name}</h1>
          
          <div className="text-3xl font-bold text-primary mb-6">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </div>
          
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-auto space-y-6 pt-6 border-t border-border">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantidade:</span>
              <div className="flex items-center border border-border rounded-lg bg-background w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors rounded-l-lg"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto flex flex-1 items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      {/* Seção de Comentários */}
      <div className="border-t border-border pt-16">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Avaliações dos Clientes</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Formulário de Comentário */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-4">Deixe sua avaliação</h3>
              
              {!isAuthenticated ? (
                <div className="bg-muted/50 rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">Você precisa estar logado para avaliar este produto.</p>
                  <Link href="/signin" className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full">
                    Fazer Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nota (1 a 5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Seu Comentário</label>
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="O que você achou deste produto?"
                      className="w-full p-3 rounded-lg border border-border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px] resize-y"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Avaliação"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Lista de Comentários */}
          <div className="lg:col-span-2 space-y-6">
            {isCommentsLoading ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                        {comment.clientFirstName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold">{comment.clientFirstName} {comment.clientLastName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                            day: '2-digit', month: 'long', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < comment.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{comment.text}</p>
                </div>
              ))
            ) : (
              <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium mb-1">Nenhuma avaliação ainda</p>
                <p className="text-sm">Seja o primeiro a avaliar este produto!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
