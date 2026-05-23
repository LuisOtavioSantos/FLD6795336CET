"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { LogIn, LogOut, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

import { useState, useEffect } from "react";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl mx-auto items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg tracking-tight hover:text-primary transition-colors">
          Exemplo3
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sobre
          </Link>
          
          <Link href="/cart" className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Carrinho</span>
            {mounted && totalItems() > 0 && (
              <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems()}
              </span>
            )}
          </Link>

          <div className="w-px h-5 bg-border mx-2"></div>

          {!mounted ? (
            <div className="w-20 h-5 bg-muted rounded animate-pulse"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Olá, {user?.firstName}</span>
              </span>
              <button onClick={logout} className="text-sm font-medium text-destructive hover:underline flex items-center gap-1">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <Link href="/signin" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              <LogIn className="w-4 h-4" />
              Entrar
            </Link>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
