import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-experiencia',
  imports: [CommonModule],
  templateUrl: './experiencia.component.html',
  styleUrl: './experiencia.component.css'
})
export class ExperienciaComponent {

  experiencia = [
  {
    puesto: 'Desarrollador Full Stack',
    empresa: 'Visual Presencia',
    fechaInicio: '07-2024',
    fechaFin: '12-2024',
    tareas: [
      "Desarrollo de la nueva aplicación del cliente con HTML, CSS, JS, PHP, jQuery y .NET.",
      "Diseño y mantenimiento de la base de datos para el nuevo proyecto (SQL).",
      "Desarrollo y mejora del CRM de la empresa con VB.NET."
    ]
  },
  {
    puesto: "Desarrollador Salesforce",
    empresa: "Cloudtree Solutions",
    fechaInicio: "04-2024",
    fechaFin: "07-2024",
    tareas: [
      "Prácticas de formación profesional en desarrollo de Salesforce.",
      "Desarrollo de backend y frontend, utilizando tecnologías como Lightning Web Components y Apex.",
      "Desarrollo de un bot para la automatización de procesos."
    ]
  },
  {
    puesto: "Programador",
    empresa: "Euroconsult NT",
    fechaInicio: "12-2022", // Se unifica el formato de fecha
    fechaFin: "04-2024",
    tareas: [
      "Desarrollo y optimización del software de la empresa con VB.NET.",
      "Mantenimiento y gestión de bases de datos en SQL.",
      "Desarrollo de aplicaciones multipropósito en Java."
    ]
  }
];

}
