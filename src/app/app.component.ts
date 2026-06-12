import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { FooterComponent } from './componentes/footer/footer.component';
import { TemaService } from './servicios/tema/tema.service';
import { IdiomaService } from './servicios/idioma/idioma.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent, TranslocoPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  tema = inject(TemaService);
  idioma = inject(IdiomaService);

  pestanas = [
    { ruta: '/inicio', etiqueta: 'inicio' },
    { ruta: '/proyectos', etiqueta: 'proyectos' },
    { ruta: '/experiencia', etiqueta: 'experiencia' },
    { ruta: '/formacion', etiqueta: 'formacion' },
    { ruta: '/contacto', etiqueta: 'contacto' }
  ];

  descargarCV() {
    const link = document.createElement('a');
    link.href = 'AdrianMartinCano.pdf';
    link.download = 'Adrian Martin Cano CV.pdf';
    link.click();
  }
}
