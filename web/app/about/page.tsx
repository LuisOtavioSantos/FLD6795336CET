import { Info } from "lucide-react";
import Link from "next/link";

export default function Sobre() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl flex-1 flex flex-col items-center text-center">
      <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Info className="h-8 w-8" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
        Sobre o Projeto
      </h1>

      <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
        Esta página foi criada apenas criando uma pasta chamada <strong>"about"</strong> dentro de <strong>"app"</strong> com um arquivo <strong>"page.tsx"</strong> dentro dela. O Next.js se encarregou de gerar automaticamente a rota <code>/about</code>.
      </p>

      <div className="bg-muted p-6 rounded-lg border border-border w-full text-left mb-8">
        <h3 className="font-bold mb-2">Como o Roteamento Funciona (App Router):</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li><strong>Pastas</strong> definem rotas (ex: <code>app/about</code> ➔ <code>/about</code>).</li>
          <li>O arquivo <strong>page.tsx</strong> define a interface pública (UI) daquela rota.</li>
          <li>Outros arquivos na pasta (como componentes, estilos ou testes) não são roteáveis publicamente.</li>
        </ul>
      </div>

      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-muted hover:text-foreground"
      >
        Voltar para Home
      </Link>
    </div>
  );
}
