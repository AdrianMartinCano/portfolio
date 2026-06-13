import { Routes } from '@angular/router';

// Lazy loading: cada página se descarga en su propio chunk bajo demanda.
// Con PreloadAllModules (ver app.config.ts) los chunks se precargan en
// segundo plano tras la carga inicial, así la navegación sigue siendo instantánea.
export const routes: Routes = [
  { path: 'inicio', loadComponent: () => import('./paginas/inicio/inicio.component').then(m => m.InicioComponent) },
  { path: 'proyectos', loadComponent: () => import('./paginas/proyectos/proyectos.component').then(m => m.ProyectosComponent), data: { animation: 'proyectos' } },
  { path: 'contacto', loadComponent: () => import('./paginas/contacto/contacto.component').then(m => m.ContactoComponent) },
  { path: 'formacion', loadComponent: () => import('./paginas/formacion/formacion.component').then(m => m.FormacionComponent) },
  { path: 'proyecto/:slug', loadComponent: () => import('./paginas/detalles-proyecto/detalles-proyecto.component').then(m => m.DetallesProyectoComponent), data: { animation: 'detalles' } },
  { path: 'experiencia', loadComponent: () => import('./paginas/experiencia/experiencia.component').then(m => m.ExperienciaComponent) },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/inicio' }
];
