import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { ProyectosComponent } from './paginas/proyectos/proyectos.component';
import { ContactoComponent } from './paginas/contacto/contacto.component';
import { FormacionComponent } from './paginas/formacion/formacion.component';
import { DetallesProyectoComponent } from './paginas/detalles-proyecto/detalles-proyecto.component';
export const routes: Routes = [
 
 {path: 'inicio', component: InicioComponent},
 {path: 'proyectos', component: ProyectosComponent},
 {path: 'contacto', component: ContactoComponent},
 {path:'formacion', component: FormacionComponent},
 {path:'detalles/:id',component: DetallesProyectoComponent},
 {path:'', redirectTo: '/inicio', pathMatch: 'full'},
 {path:'**', redirectTo: '/inicio'}
];
