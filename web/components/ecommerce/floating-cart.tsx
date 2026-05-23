"use client"; // informa ao framework que este componente roda no lado do cliente

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Rnd } from "react-rnd";
import { ShoppingBag, X, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
// import { toast } from "react-toastify";
import Link from "next/link";

export function FloatingCart() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, totalPrice, totalItems } = useCartStore();

  useEffect(() => {
    const timer = setTimeout(() => { // setTimeout joga a função pro fim da fila
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []); // Array de dependências, quando vazio --> executa uma única vez


  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Botão flutuante para abrir */}
      <div className={`fixed bottom-6 right-6 transition-transform duration-300 pointer-events-auto ${isOpen ? "scale-0" : "scale-100"}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center"
        >
          <ShoppingBag className="w-6 h-6" />
          {totalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {totalItems()}
            </span>
          )}
        </button>
      </div>

      {/* Painel Arrastável */}
      <div className={`transition-all duration-300 origin-bottom-right ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div style={{ pointerEvents: isOpen ? "auto" : "none" }}>
          <Rnd
            default={{
              x: window.innerWidth - 380,
              y: window.innerHeight - 500,
              width: 340,
              height: 450,
            }}
            minWidth={320}
            minHeight={300}
            bounds="window"
            dragHandleClassName="drag-handle"
            className="flex flex-col bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Header Arrastável */}
            <div className="drag-handle flex items-center justify-between p-4 bg-muted/50 border-b border-border cursor-move select-none">
              <div className="flex items-center gap-2 font-bold">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Carrinho ({totalItems()})
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted-foreground/20 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de Itens */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-70">
                  <ShoppingBag className="w-12 h-12" />
                  <p className="text-sm">Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center border-b border-border pb-3 last:border-0">
                      <div className="w-12 h-12 bg-muted rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                         {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs">{item.name.substring(0,2)}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">{item.quantity}x R$ {item.price}</span>
                          <span className="text-sm font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer do Carrinho */}
            {items.length > 0 && (
              <div className="p-4 bg-muted/30 border-t border-border">
                <div className="flex justify-between font-bold mb-4">
                  <span>Total:</span>
                  <span>R$ {totalPrice().toFixed(2)}</span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex justify-center"
                >
                  Finalizar Compra
                </Link>
              </div>
            )}
          </Rnd>
        </div>
      </div>
    </div>,
    document.body
  );
}
