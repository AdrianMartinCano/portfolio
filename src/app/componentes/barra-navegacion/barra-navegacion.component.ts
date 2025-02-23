import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css'],
  standalone: true,
   imports: [CommonModule, RouterModule]
})
export class BarraNavegacionComponent {
  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  descargarArchivo() {
    const link = document.createElement('a');
    link.href = 'assets/AdrianMartinCano.pdf';
    link.download = 'Adrian Martin Cano CV.pdf';
    link.click();
  }

}