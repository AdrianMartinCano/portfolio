import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { datosDesdeApi } from '../datos-api/datos-api';

export interface Experiencia {
  puesto: string;
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  tareas: string[];
}

@Injectable({ providedIn: 'root' })
export class ExperienciaService {
  private http = inject(HttpClient);
  private transloco = inject(TranslocoService);

  private api = datosDesdeApi<Experiencia>(this.http, this.transloco, 'experiencia', 'experiencia');
  experiencia = this.api.datos;
  cargando = this.api.cargando;
}
