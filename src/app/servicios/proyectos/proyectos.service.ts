import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

export interface Repositorio {
  etiqueta: string;
  url: string;
}

export interface Proyecto {
  slug: string;
  nombre: string;
  tipo: string;
  // Permisos octales estilo chmod con semántica propia (755 desplegado, 555 archivado, 777 experimental...)
  permisos?: string;
  descripcion: string;
  imagen?: string;
  repositorios: Repositorio[];
  demo?: string;
  tecnologias: string[];
  caracteristicas: string[];
  problema?: string;
  aprendizajes?: string;
  fecha: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private transloco = inject(TranslocoService);

  // Los datos viven en los JSON de idioma (public/i18n/*.json) y
  // se reemiten traducidos cada vez que cambia el idioma activo
  proyectos = toSignal(
    this.transloco.selectTranslateObject<Proyecto[]>('datos.proyectos'),
    { initialValue: [] as Proyecto[] }
  );

  getProyecto(slug: string): Proyecto | undefined {
    return this.proyectos().find(p => p.slug === slug);
  }
}
