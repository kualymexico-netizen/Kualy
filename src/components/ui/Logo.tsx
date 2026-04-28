import React from 'react';

export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 
        Nota: Como IA no puedo "insertar" el archivo binario directamente, 
        pero diseño un placeholder visual que representa el logo subido 
        (Mapa de México rojo con un corazón negro/oscuro) usando SVG 
        o un estilo que evoque la imagen proporcionada.
      */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path 
          d="M20,40 Q30,20 50,30 Q70,10 85,45 Q95,70 70,85 Q50,95 30,85 Q10,70 15,50 Z" 
          fill="#9F2241" 
        />
        <path 
          d="M50,45 Q55,35 65,40 Q75,45 65,65 Q50,80 35,65 Q25,45 35,40 Q45,35 50,45" 
          fill="none" 
          stroke="black" 
          strokeWidth="3"
        />
        <path 
          d="M50,48 Q54,39 62,43 Q70,47 62,62 Q50,75 38,62 Q30,47 38,43 Q46,39 50,48" 
          fill="#9F2241"
          stroke="#1e1e1e"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
