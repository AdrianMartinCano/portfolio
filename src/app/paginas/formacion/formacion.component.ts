import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

interface Formacion {
  grado: string;
  centro: string;
  fechaInicio: string;
  fechaFin: string;
  competencias: string;
}

@Component({
  selector: 'app-formacion',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './formacion.component.html',
  styleUrl: './formacion.component.css'
})
export class FormacionComponent {
  formaciones = toSignal(
    inject(TranslocoService).selectTranslateObject<Formacion[]>('datos.formacion'),
    { initialValue: [] as Formacion[] }
  );
}
