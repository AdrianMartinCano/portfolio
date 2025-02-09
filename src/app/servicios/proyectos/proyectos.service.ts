import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  listaProyectos = [
  {
    nombre: "KeyCloud",
    tipo: "Frontend",
    descripcion: "Gestor de contraseñas seguro con Angular",
    repositorio: "https://github.com/AdrianMartinCano/keycloud-front",
    tecnologias: ["Angular 16", "TypeScript", "CSS", "Node.js"],
    caracteristicas: [
      "Encriptación AES con CryptoJS",
      "CRUD de contraseñas",
      "Autenticación de usuarios",
    ],
    
    fecha: "Enero 2025",
    estado: "Terminado",
  },
  {
    nombre: "KeyCloud",
    tipo: "Backend",
    descripcion: "API para la gestión de contraseñas",
    repositorio: "https://github.com/AdrianMartinCano/keycloud",
    tecnologias: ["Java", "JPA", "Spring Boot", "Maven", "Docker", "MySQL"],
    caracteristicas: [
      "Autenticación y creación de usuarios",
      "CRUD de contraseñas",
      "Gestión de dependencias con Maven",
      "Base de datos en MySQL",
      "Contenedorizado con Docker",
    ],
    
    fecha: "Enero 2025",
    estado: "Terminado",
  },
  {
    nombre: "Gas-Path",
    tipo: "Movil",
    descripcion: "Buscador de gasolineras según ubicación",
    repositorio: "https://github.com/AdrianMartinCano/Gas-Path",
    tecnologias: ["Kotlin", "Jetpack Compose", "Firebase", "Google Maps API"],
    caracteristicas: [
      "Arquitectura MVVM",
      "Uso de Google Maps API",
      "Autenticación con Firebase",
    ],
   
    fecha: "Junio 2024",
    estado: "Terminado",
  },
  {
    nombre: "Portfolio",
    tipo: "Frontend",
    descripcion: "Código fuente de esta web",
    repositorio: "https://github.com/AdrianMartinCano/portfolio",
    demo: "https://adrianmartincano.github.io/",
    tecnologias: ["Angular 19", "TypeScript", "Tailwind", "Node.js"],
    caracteristicas: [
      "Desarrollado con Angular 19",
      "Diseño responsive con Tailwind CSS",
      "Despliegue en GitHub Pages",
      
    ],
    
    fecha: "Enero 2025",
    estado: "Terminado",
  },
  
];


  constructor() { }

 
  getProyecto(index: number) {
    return this.listaProyectos[index];
  }
}