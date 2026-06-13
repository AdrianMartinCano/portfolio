import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export type Idioma = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {
  private transloco = inject(TranslocoService);

  idioma = signal<Idioma>('es');

  // Locale al estilo de la variable de entorno LANG de Linux
  lang = computed(() => (this.idioma() === 'es' ? 'es_ES.UTF-8' : 'en_US.UTF-8'));

  constructor() {
    const guardado = localStorage.getItem('idioma');
    if (guardado === 'es' || guardado === 'en') {
      this.idioma.set(guardado);
    }
    effect(() => {
      this.transloco.setActiveLang(this.idioma());
      localStorage.setItem('idioma', this.idioma());
      document.documentElement.lang = this.idioma();
    });
  }

  alternar() {
    this.idioma.update(i => (i === 'es' ? 'en' : 'es'));
  }
}
