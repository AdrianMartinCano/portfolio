import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { datosDesdeApi } from '../datos-api/datos-api';

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
  private http = inject(HttpClient);
  private transloco = inject(TranslocoService);

  // Pide los proyectos a la API (con el idioma activo); si falla, cae
  // a los JSON locales de i18n (public/i18n/*.json)
  private api = datosDesdeApi<Proyecto>(this.http, this.transloco, 'proyectos', 'proyectos');
  proyectos = this.api.datos;
  cargando = this.api.cargando;

  getProyecto(slug: string): Proyecto | undefined {
    return this.proyectos().find(p => p.slug === slug);
  }
}
