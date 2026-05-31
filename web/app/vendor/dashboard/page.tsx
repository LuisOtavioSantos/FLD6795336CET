"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { toast } from "react-toastify";
import type { Product } from "@/types/product";
import { Loader2, Plus, Upload, Package } from "lucide-react";
import Link from "next/link";

export default function VendorDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Periféricos");
  const [stock, setStock] = useState("10");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    if (user?.role !== "VENDOR" && user?.role !== "ADMIN") {
      router.push("/");
      toast.warning("Acesso restrito para vendedores.");
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user, router]);

  const fetchProducts = async () => {
    try {
      // In a real app, we'd have a /product/vendor endpoint. For now we fetch all and filter client-side.
      // Or we can just show all since ADMIN can see all, and VENDOR might only see theirs if we implement backend filtering.
      // Since we just added vendorId, let's filter by vendorId locally for simplicity in this MVP.
      const { data } = await api.get("/product");
      setProducts(data.filter((p: any) => p.vendorId === user?.id || user?.role === "ADMIN"));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar produtos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !stock) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Product
      const { data: newProduct } = await api.post("/product", {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10),
      });

      // 2. Upload Image if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await api.post(`/product/${newProduct.id}/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Produto cadastrado com sucesso!");
      setShowForm(false);
      setName("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      fetchProducts(); // refresh
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar produto.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-screen-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">Painel do Vendedor</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus produtos e vendas (Loja de {user?.firstName})</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          {showForm ? "Cancelar" : <><Plus className="w-5 h-5" /> Novo Produto</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-12">
          <h2 className="text-2xl font-bold mb-6">Cadastrar Novo Produto</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Produto *</label>
                <input 
                  type="text" 
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preço (R$) *</label>
                <input 
                  type="number" step="0.01" min="0"
                  value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria *</label>
                  <select 
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Periféricos">Periféricos</option>
                    <option value="Computadores">Computadores</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estoque *</label>
                  <input 
                    type="number" min="0"
                    value={stock} onChange={(e) => setStock(e.target.value)}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Descrição do Produto</label>
                <textarea 
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Imagem Real do Produto</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Clique ou arraste a imagem aqui</p>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="mt-4 text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 pt-4 border-t border-border flex justify-end">
              <button 
                type="submit" disabled={submitting}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {submitting ? "Salvando..." : "Salvar Produto"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Package className="w-6 h-6" /> Meus Produtos Cadastrados</h2>
        
        {products.length === 0 ? (
          <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-bold mb-2">Nenhum produto cadastrado</h3>
            <p className="text-muted-foreground">Você ainda não possui produtos à venda no marketplace.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                <div className="aspect-video bg-muted relative">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl.startsWith("http") ? product.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090"}${product.imageUrl}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground text-xs uppercase font-bold">Sem Foto</div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold line-clamp-1" title={product.name}>{product.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{product.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Estoque: {product.stock} unid.</p>
                  <div className="mt-auto font-black text-lg">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
