import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { FooterComponent } from './componentes/footer/footer.component';
import { TemaService } from './servicios/tema/tema.service';
import { IdiomaService } from './servicios/idioma/idioma.service';
import { ProyectosService } from './servicios/proyectos/proyectos.service';
import { ExperienciaService } from './servicios/experiencia/experiencia.service';
import { FormacionService } from './servicios/formacion/formacion.service';
import { CvService } from './servicios/cv/cv.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent, TranslocoPipe],
  templateUrl: './app.component.html'
})
export class AppComponent {
  tema = inject(TemaService);
  idioma = inject(IdiomaService);
  cv = inject(CvService);

  // Prefetch: instanciar los servicios de datos al arrancar dispara sus
  // peticiones de inmediato → calienta el backend (cold start de Render) y
  // deja las respuestas cacheadas para que la navegación sea instantánea.
  private readonly prefetch = [
    inject(ProyectosService),
    inject(ExperienciaService),
    inject(FormacionService)
  ];

  pestanas = [
    { ruta: '/inicio', etiqueta: 'inicio' },
    { ruta: '/proyectos', etiqueta: 'proyectos' },
    { ruta: '/experiencia', etiqueta: 'experiencia' },
    { ruta: '/formacion', etiqueta: 'formacion' },
    { ruta: '/contacto', etiqueta: 'contacto' }
  ];
}
