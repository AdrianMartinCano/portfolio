import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';

import { ProyectosService
  
 } from '../../servicios/proyectos/proyectos.service';
@Component({
  selector: 'app-detalles-proyecto',
  templateUrl: './detalles-proyecto.component.html',
  styleUrls: ['./detalles-proyecto.component.css'],
  standalone: true,
  imports: [CommonModule],
  
})
export class DetallesProyectoComponent implements OnInit {
  proyecto: any;
  currentIndex: number = 0;
  
  constructor(private route: ActivatedRoute, private router: Router, private proyectosService: ProyectosService) {}

  ngOnInit(): void {
    const index = this.route.snapshot.paramMap.get('id');
    if (index !== null) {
      this.proyecto = this.proyectosService.getProyecto(+index);
    }
  }

  abrirURL(url: string) {
    window.open(url, '_blank');
  }

  volverAProyectos() {
    this.router.navigate(['/proyectos']);
  }

  
}