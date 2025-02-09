import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-formacion',
  imports: [CommonModule],
   standalone: true,
  templateUrl: './formacion.component.html',
  styleUrl: './formacion.component.css'
  
})
export class FormacionComponent {

  formaciones = [
    {
    grado: 'Desarrollo de aplicaciones multiplataforma',
    centro : 'Escolapios de Gefate',
    fechaInicio: '2022',
    fechaFin: '2024',
    competencias:'IntelliJ, Visual Studio Code, Eclipse, SQL, Hibernate'
  },
  {
    grado: 'Ingeniería Informática (No Completado)',
    centro: 'Universidad a Distancia',
    fechaInicio:'2020',
    fechaFin:'2021',
    competencias:'Conocimientos en programación avanzada, algoritmos y estructuras de datos, sistemas operativos'
  },
  {
    grado: 'Ingeniería Informática (No Completado)',
    centro: 'Universidad Carlos III de Madrid',
    fechaInicio:'2014',
    fechaFin:'2019',
    competencias:'Fundamentos de programación, redes de computadores, bases de datos'
  }
];
}
