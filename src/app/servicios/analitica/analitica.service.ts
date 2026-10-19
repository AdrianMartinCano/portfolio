import { Injectable } from '@angular/core';

// Lo que expone el script de Umami (index.html). Puede no existir: bloqueadores de
// anuncios, desarrollo en local (data-domains solo cuenta en producción)...
interface Umami {
  track(evento: string, datos?: Record<string, string | number>): void;
}

declare global {
  interface Window {
    umami?: Umami;
  }
}

@Injectable({ providedIn: 'root' })
export class AnaliticaService {
  // Las visitas a cada página las cuenta Umami solo; esto es para las acciones
  // (descargar el CV, enviar el contacto, comandos de la terminal). Nunca rompe la web.
  evento(nombre: string, datos?: Record<string, string | number>) {
    try {
      window.umami?.track(nombre, datos);
    } catch {
      // La analítica es prescindible: si falla, la web sigue igual
    }
  }
}
