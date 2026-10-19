import { inject, Injectable } from '@angular/core';
import { AnaliticaService } from '../analitica/analitica.service';

@Injectable({ providedIn: 'root' })
export class CvService {
  private analitica = inject(AnaliticaService);

  // Descarga el CV en PDF (vive en public/, servido desde la raíz)
  descargar() {
    const link = document.createElement('a');
    link.href = 'AdrianMartinCano.pdf';
    link.download = 'Adrian Martin Cano CV.pdf';
    link.click();
    this.analitica.evento('descargar-cv');
  }
}
