import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { SpinnerTerminalComponent } from '../../componentes/spinner-terminal/spinner-terminal.component';
import { FormacionService } from '../../servicios/formacion/formacion.service';

@Component({
  selector: 'app-formacion',
  standalone: true,
  imports: [CommonModule, TranslocoPipe, SpinnerTerminalComponent],
  templateUrl: './formacion.component.html'
})
export class FormacionComponent {
  private servicio = inject(FormacionService);
  formaciones = this.servicio.formaciones;
  cargando = this.servicio.cargando;
}
