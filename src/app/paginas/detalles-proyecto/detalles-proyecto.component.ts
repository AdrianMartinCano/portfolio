import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProyectosService } from '../../servicios/proyectos/proyectos.service';

@Component({
  selector: 'app-detalles-proyecto',
  templateUrl: './detalles-proyecto.component.html',
  styleUrls: ['./detalles-proyecto.component.css'],
  standalone: true,
  imports: [CommonModule, TranslocoPipe]
})
export class DetallesProyectoComponent {
  private proyectosService = inject(ProyectosService);
  private slug = inject(ActivatedRoute).snapshot.paramMap.get('slug') ?? '';

  // Computed para que el proyecto se retraduzca al cambiar de idioma
  proyecto = computed(() => this.proyectosService.getProyecto(this.slug));

  constructor(private router: Router) {}

  volverAProyectos() {
    this.router.navigate(['/proyectos']);
  }
}
