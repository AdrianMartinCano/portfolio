import { Component, OnDestroy, OnInit, input, signal } from '@angular/core';

// Indicador de carga estilo terminal: spinner braille + texto + cursor.
// Se usa mientras un endpoint responde (sobre todo en el cold start de Render).
@Component({
  selector: 'app-spinner-terminal',
  standalone: true,
  template: `
    <p class="text-apagado">
      <span class="text-verde">{{ frames[indice()] }}</span>
      {{ texto() }}<span class="cursor-parpadeo text-texto">_</span>
    </p>
  `
})
export class SpinnerTerminalComponent implements OnInit, OnDestroy {
  texto = input('cargando datos...');

  protected readonly frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  protected indice = signal(0);

  private intervalo?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.intervalo = setInterval(
      () => this.indice.set((this.indice() + 1) % this.frames.length),
      80
    );
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }
}
