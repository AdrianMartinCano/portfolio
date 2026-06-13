import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CvService {
  // Descarga el CV en PDF (vive en public/, servido desde la raíz)
  descargar() {
    const link = document.createElement('a');
    link.href = 'AdrianMartinCano.pdf';
    link.download = 'Adrian Martin Cano CV.pdf';
    link.click();
  }
}
