"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import Link from "next/link";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Monitora o scroll para mostrar/esconder o botão
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 p-3 rounded-full bg-secondary text-secondary-foreground shadow-lg transition-all duration-300 z-50 flex items-center justify-center hover:bg-secondary/80 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-auto"
      }`}
      aria-label="Voltar ao topo"
    >
      <Link
        href="/">
          <ArrowUp className="w-5 h-5" />
      </Link>
    </button>
  );
}
