import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { datosDesdeApi } from '../datos-api/datos-api';

export interface Formacion {
  grado: string;
  centro: string;
  fechaInicio: string;
  fechaFin: string;
  competencias: string;
}

@Injectable({ providedIn: 'root' })
export class FormacionService {
  private http = inject(HttpClient);
  private transloco = inject(TranslocoService);

  private api = datosDesdeApi<Formacion>(this.http, this.transloco, 'formacion', 'formacion');
  formaciones = this.api.datos;
  cargando = this.api.cargando;
}
