import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

interface Experiencia {
  puesto: string;
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  tareas: string[];
}

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experiencia.component.html',
  styleUrl: './experiencia.component.css'
})
export class ExperienciaComponent {
  experiencia = toSignal(
    inject(TranslocoService).selectTranslateObject<Experiencia[]>('datos.experiencia'),
    { initialValue: [] as Experiencia[] }
  );
}
