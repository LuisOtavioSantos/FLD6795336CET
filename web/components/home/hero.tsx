import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-background to-muted/50">
      <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium mb-8 bg-card shadow-sm transition-colors hover:bg-muted cursor-pointer">
        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
        Liquidação de Inverno: Até 50% OFF
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
        Descubra produtos incríveis com preços imbatíveis.
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
        A sua nova loja favorita. Produtos de alta qualidade, entrega rápida e pagamento super seguro. 
        Navegue pelo nosso catálogo e aproveite as ofertas exclusivas!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
        <Link
          href="#features"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Começar agora
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link
          href="https://github.com"
          target="_blank"
          className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Ver repositório
        </Link>
      </div>
    </section>
  );
}
