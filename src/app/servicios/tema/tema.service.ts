import { effect, Injectable, signal } from '@angular/core';

export type Tema = 'oscuro' | 'claro';

@Injectable({
  providedIn: 'root'
})
export class TemaService {
  tema = signal<Tema>('oscuro');

  constructor() {
    const guardado = localStorage.getItem('tema');
    if (guardado === 'oscuro' || guardado === 'claro') {
      this.tema.set(guardado);
    }
    effect(() => {
      document.documentElement.setAttribute('data-tema', this.tema());
      localStorage.setItem('tema', this.tema());
    });
  }

  alternar() {
    this.tema.update(t => (t === 'oscuro' ? 'claro' : 'oscuro'));
  }
}
