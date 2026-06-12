import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, output, signal, ViewChild } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

interface Celda {
  x: number;
  y: number;
}

@Component({
  selector: 'app-snake',
  standalone: true,
  imports: [TranslocoPipe],
  templateUrl: './snake.component.html'
})
export class SnakeComponent implements AfterViewInit, OnDestroy {
  salir = output<void>();

  tablero = signal('');
  puntuacion = signal(0);
  gameOver = signal(false);

  @ViewChild('zona') zona!: ElementRef<HTMLDivElement>;
  @ViewChild('tableroPre') tableroPre!: ElementRef<HTMLPreElement>;

  private columnas = 20;
  private filas = 14;
  private serpiente: Celda[] = [];
  private comida: Celda = { x: 0, y: 0 };
  private direccion: Celda = { x: 1, y: 0 };
  private direccionPendiente: Celda = { x: 1, y: 0 };
  private intervalo?: ReturnType<typeof setInterval>;
  private toqueInicio?: { x: number; y: number };

  ngAfterViewInit() {
    // Espera un tick para que el layout esté resuelto antes de medir
    setTimeout(() => {
      this.calcularDimensiones();
      this.reiniciar();
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  // Calcula cuántas celdas caben en el área disponible midiendo el
  // tamaño real del carácter monoespaciado en el tamaño de fuente actual
  private calcularDimensiones() {
    const zona = this.zona.nativeElement;
    const medidor = document.createElement('pre');
    medidor.className = this.tableroPre.nativeElement.className;
    medidor.style.position = 'absolute';
    medidor.style.visibility = 'hidden';
    medidor.textContent = '██████████\n██████████';
    zona.appendChild(medidor);
    const rect = medidor.getBoundingClientRect();
    const anchoChar = rect.width / 10;
    const altoLinea = rect.height / 2;
    zona.removeChild(medidor);

    const disponible = zona.getBoundingClientRect();
    // Cada celda son 2 caracteres de ancho; bordes: 2 chars y 2 líneas
    this.columnas = Math.min(60, Math.max(10, Math.floor((disponible.width / anchoChar - 2) / 2)));
    this.filas = Math.min(40, Math.max(8, Math.floor(disponible.height / altoLinea) - 2));
  }

  reiniciar() {
    const y = Math.floor(this.filas / 2);
    const x = Math.max(5, Math.floor(this.columnas / 4));
    this.serpiente = [{ x, y }, { x: x - 1, y }, { x: x - 2, y }];
    this.direccion = { x: 1, y: 0 };
    this.direccionPendiente = { x: 1, y: 0 };
    this.puntuacion.set(0);
    this.gameOver.set(false);
    this.colocarComida();
    this.dibujar();
    this.programarTick();
  }

  @HostListener('window:keydown', ['$event'])
  onTecla(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();

    if (k === 'q' || k === 'escape') {
      e.preventDefault();
      this.salir.emit();
      return;
    }

    if (this.gameOver()) {
      if (k === 'r') {
        e.preventDefault();
        this.reiniciar();
      }
      return;
    }

    switch (k) {
      case 'arrowup': case 'w': e.preventDefault(); this.cambiarDireccion(0, -1); break;
      case 'arrowdown': case 's': e.preventDefault(); this.cambiarDireccion(0, 1); break;
      case 'arrowleft': case 'a': e.preventDefault(); this.cambiarDireccion(-1, 0); break;
      case 'arrowright': case 'd': e.preventDefault(); this.cambiarDireccion(1, 0); break;
    }
  }

  onTouchStart(e: TouchEvent) {
    const t = e.touches[0];
    this.toqueInicio = { x: t.clientX, y: t.clientY };
  }

  onTouchEnd(e: TouchEvent) {
    if (!this.toqueInicio) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - this.toqueInicio.x;
    const dy = t.clientY - this.toqueInicio.y;
    this.toqueInicio = undefined;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.cambiarDireccion(Math.sign(dx), 0);
    } else {
      this.cambiarDireccion(0, Math.sign(dy));
    }
  }

  private cambiarDireccion(x: number, y: number) {
    // No permite girar 180º sobre sí misma
    if (this.direccion.x === -x && this.direccion.y === -y) return;
    this.direccionPendiente = { x, y };
  }

  private programarTick() {
    clearInterval(this.intervalo);
    // Acelera un poco con cada comida
    const velocidad = Math.max(50, 90 - this.puntuacion() * 4);
    this.intervalo = setInterval(() => this.tick(), velocidad);
  }

  private tick() {
    this.direccion = this.direccionPendiente;
    const cabeza = this.serpiente[0];
    const nueva = { x: cabeza.x + this.direccion.x, y: cabeza.y + this.direccion.y };

    const choca =
      nueva.x < 0 || nueva.x >= this.columnas ||
      nueva.y < 0 || nueva.y >= this.filas ||
      this.serpiente.some(c => c.x === nueva.x && c.y === nueva.y);

    if (choca) {
      this.gameOver.set(true);
      clearInterval(this.intervalo);
      return;
    }

    this.serpiente.unshift(nueva);
    if (nueva.x === this.comida.x && nueva.y === this.comida.y) {
      this.puntuacion.update(p => p + 1);
      this.colocarComida();
      this.programarTick();
    } else {
      this.serpiente.pop();
    }
    this.dibujar();
  }

  private colocarComida() {
    do {
      this.comida = {
        x: Math.floor(Math.random() * this.columnas),
        y: Math.floor(Math.random() * this.filas)
      };
    } while (this.serpiente.some(c => c.x === this.comida.x && c.y === this.comida.y));
  }

  private dibujar() {
    const ocupadas = new Set(this.serpiente.map(c => `${c.x},${c.y}`));
    const filas: string[] = [];
    filas.push('┌' + '─'.repeat(this.columnas * 2) + '┐');
    for (let y = 0; y < this.filas; y++) {
      let fila = '│';
      for (let x = 0; x < this.columnas; x++) {
        if (ocupadas.has(`${x},${y}`)) {
          fila += '██';
        } else if (x === this.comida.x && y === this.comida.y) {
          fila += '<>';
        } else {
          fila += '  ';
        }
      }
      filas.push(fila + '│');
    }
    filas.push('└' + '─'.repeat(this.columnas * 2) + '┘');
    this.tablero.set(filas.join('\n'));
  }
}
