"use client";

import React, { useState } from "react";

// A interface define o "contrato" das Propriedades (Props) 
// que o filho exige que o pai passe para ele.
interface NewsletterFormProps {
  title: string; // Uma variável de texto
  onSubscribe: (email: string) => void; // Uma função para enviar o email de volta ao pai
}

function NewsletterForm({ title, onSubscribe }: NewsletterFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (email) {
      // Chama a função do Pai, passando o dado que o Filho coletou
      onSubscribe(email);
      setEmail(""); // Limpa o input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <label className="text-sm font-medium leading-none">{title}</label>
      <div className="flex gap-2">
        {/* Estilo idêntico ao componente Input do Shadcn UI */}
        <input 
          type="email" 
          placeholder="exemplo@vitru.com.br" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        />
        {/* Estilo idêntico ao componente Button do Shadcn UI */}
        <button 
          type="submit" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Assinar
        </button>
      </div>
    </form>
  );
}

export function NewsletterExample() {
  const [message, setMessage] = useState("Fique por dentro das novidades!");

  // Função que será repassada como "Prop" para o Filho
  const handleUserSubscribed = (email: string) => {
    setMessage(`Sucesso! O e-mail ${email} foi cadastrado.`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 text-left">
        
        {/* Card Header */}
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">Newsletter</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        
        {/* Card Content: Aqui chamamos o Filho e passamos as Variáveis (Props) */}
        <NewsletterForm 
          title="Insira seu melhor e-mail abaixo:" 
          onSubscribe={handleUserSubscribed} 
        />
        
      </div>
    </div>
  );
}
