import { Code, Layers, Zap } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-24 max-w-screen-xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Tudo o que você precisa
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Componentes e utilitários pensados para máxima produtividade e beleza visual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-foreground/20">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Performance Extrema</h3>
          <p className="text-muted-foreground">
            Aproveite o poder do Next.js App Router para entregas ultrarrápidas de conteúdo e SEO otimizado.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-foreground/20">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 transition-colors group-hover:bg-purple-500 group-hover:text-white">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Design System</h3>
          <p className="text-muted-foreground">
            Cores, tipografia e espaçamentos consistentes usando as novas variáveis nativas do Tailwind CSS v4.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-foreground/20">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
            <Code className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Código Limpo</h3>
          <p className="text-muted-foreground">
            Arquitetura de componentes modularizada, facilitando a manutenção e escala do seu projeto.
          </p>
        </div>
      </div>
    </section>
  );
}
