import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { SpinnerTerminalComponent } from '../../componentes/spinner-terminal/spinner-terminal.component';
import { Proyecto, ProyectosService } from '../../servicios/proyectos/proyectos.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  standalone: true,
  imports: [CommonModule, TranslocoPipe, SpinnerTerminalComponent]
})
export class ProyectosComponent {
  private servicio = inject(ProyectosService);
  listaProyectos = this.servicio.proyectos;
  cargando = this.servicio.cargando;

  constructor(private router: Router) {}

  verDetalles(slug: string) {
    this.router.navigate(['/proyecto', slug]);
  }

  // El permiso viene del dato de cada proyecto (ver semántica en proyectos.leyenda de los JSON)
  permisos(proyecto: Proyecto): string {
    return proyecto.permisos ?? '755';
  }

  // Solo los permisos presentes en la lista, para una leyenda sin entradas huérfanas
  permisosEnUso = computed(() =>
    [...new Set(this.listaProyectos().map(p => p.permisos ?? '755'))]
      .sort((a, b) => b.localeCompare(a))
  );

  // Conversión del octal a la notación simbólica de ls -l ('d' porque son directorios)
  permisosSimbolicos(proyecto: Proyecto): string {
    const rwx = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
    return 'd' + [...this.permisos(proyecto)].map(digito => rwx[+digito]).join('');
  }
}
