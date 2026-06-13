import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { SpinnerTerminalComponent } from '../../componentes/spinner-terminal/spinner-terminal.component';
import { ExperienciaService } from '../../servicios/experiencia/experiencia.service';

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [CommonModule, TranslocoPipe, SpinnerTerminalComponent],
  templateUrl: './experiencia.component.html'
})
export class ExperienciaComponent {
  private servicio = inject(ExperienciaService);
  experiencia = this.servicio.experiencia;
  cargando = this.servicio.cargando;
}
