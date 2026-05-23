import { Banner } from "@/components/home/banner";
import { ProductGrid } from "@/components/home/product-grid";
import { NewsletterExample } from "@/components/home/newsletter-example";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <section id="hero" className="w-full shrink-0" aria-label="Destaque principal">
        <Banner />
      </section>

      <section id="produtos" className="w-full grow container mx-auto px-4 py-8" aria-label="Lista de produtos">
        <ProductGrid />
      </section>
      
      <section id="newsletter" className="w-full border-r-green-600 dark:bg-zinc-900 py-12 mt-auto text-center">
        <NewsletterExample />
      </section>
    </div>
  );
}
