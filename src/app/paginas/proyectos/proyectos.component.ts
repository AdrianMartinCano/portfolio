import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProyectosService } from '../../servicios/proyectos/proyectos.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
  standalone: true,
  imports: [CommonModule],
  
})
export class ProyectosComponent implements OnInit {
  listaProyectos: any[] = [];

  constructor(private router: Router, private proyectosService: ProyectosService) {}

  ngOnInit(): void {
    this.listaProyectos = this.proyectosService.listaProyectos;
  }

  verDetalles(index: number) {
    this.router.navigate(['/detalles', index]);
  }

 
}