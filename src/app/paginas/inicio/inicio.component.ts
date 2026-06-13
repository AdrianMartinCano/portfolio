import { Component, computed, ElementRef, HostListener, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { SnakeComponent } from '../../componentes/snake/snake.component';
import { ProyectosService } from '../../servicios/proyectos/proyectos.service';
import { CvService } from '../../servicios/cv/cv.service';

interface EntradaHistorial {
  comando: string;
  salida: string[];
  // Si está, su traducción reemplaza a 'salida' y se recalcula al cambiar idioma
  salidaKey?: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, SnakeComponent, TranslocoPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  comando1 = signal('');
  comandoCat = signal('');
  comandoNeofetch = signal('');
  comando2 = signal('');
  mostrarSalida1 = signal(false);
  mostrarSalidaCat = signal(false);
  mostrarSalidaNeofetch = signal(false);
  mostrarLinea2 = signal(false);
  mostrarSalida2 = signal(false);
  mostrarPromptFinal = signal(false);
  // 1 = whoami, 2 = cat, 3 = neofetch, 4 = ls, 5 = prompt final
  cursorEn = signal(1);

  // Comandos ya ejecutados por el visitante, con su salida
  historial = signal<EntradaHistorial[]>([]);
  terminalInputValue = signal('');
  hireMode = signal(false);
  hireOutput = signal<string[]>([]);
  snakeActivo = signal(false);

  @ViewChild('terminalScroll') terminalScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('terminalInput') terminalInput!: ElementRef<HTMLInputElement>;

  private transloco = inject(TranslocoService);
  private proyectosService = inject(ProyectosService);
  cv = inject(CvService);

  // Salida de 'help' como signal reactivo. selectTranslateObject espera a que
  // el idioma esté cargado (evita que devuelva la clave en bruto) y re-emite
  // al cambiar de idioma.
  private helpLines = toSignal(
    this.transloco.selectTranslateObject<string[]>('inicio.help'),
    { initialValue: [] as string[] }
  );

  // Historial con las salidas traducibles resueltas en el idioma actual.
  historialRender = computed<EntradaHistorial[]>(() =>
    this.historial().map(e => {
      if (e.salidaKey === 'inicio.help') {
        const lineas = this.helpLines();
        return { ...e, salida: Array.isArray(lineas) ? lineas : [] };
      }
      return e;
    })
  );

  constructor(private router: Router) {}

  // Cada comando devuelve las líneas que imprime en la terminal
  private comandos: Record<string, () => string[]> = {
    'snake': () => {
      this.snakeActivo.set(true);
      return [];
    },
    'sudo hire adrian': () => {
      this.hireMode.set(true);
      this.hireOutput.set(this.transloco.translateObject<string[]>('inicio.hire'));
      return [];
    },
    'replay': () => {
      this.replay();
      return [];
    }
  };

  // Recuerda si la intro ya se reprodujo en esta carga de la app. Al navegar
  // a otra página y volver, el componente se recrea pero el flag (estático)
  // persiste → la animación solo se ve una vez. Se reinicia al recargar.
  private static introReproducida = false;

  ngOnInit() {
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sin animación si el usuario la desactiva o si ya se vio en esta sesión.
    if (reducirMovimiento || InicioComponent.introReproducida) {
      this.mostrarTodoInstantaneo();
      return;
    }

    InicioComponent.introReproducida = true;
    this.animar();
  }

  // Deja la terminal en su estado final, sin animar.
  private mostrarTodoInstantaneo() {
    this.comando1.set('whoami');
    this.comandoCat.set('cat sobre-mi.txt');
    this.comandoNeofetch.set('neofetch');
    this.comando2.set('ls ./');
    this.mostrarSalida1.set(true);
    this.mostrarSalidaCat.set(true);
    this.mostrarSalidaNeofetch.set(true);
    this.mostrarLinea2.set(true);
    this.mostrarSalida2.set(true);
    this.mostrarPromptFinal.set(true);
    this.cursorEn.set(5);
    this.scrollToBottom();
    this.focusTerminal();
  }

  // Reinicia los comandos de la intro a su estado inicial (antes de animar).
  private resetIntro() {
    this.comando1.set('');
    this.comandoCat.set('');
    this.comandoNeofetch.set('');
    this.comando2.set('');
    this.mostrarSalida1.set(false);
    this.mostrarSalidaCat.set(false);
    this.mostrarSalidaNeofetch.set(false);
    this.mostrarLinea2.set(false);
    this.mostrarSalida2.set(false);
    this.mostrarPromptFinal.set(false);
    this.cursorEn.set(1);
  }

  // Comando 'replay': limpia la sesión y vuelve a reproducir la intro.
  private replay() {
    // En el siguiente tick, para que se ejecute tras el eco del comando en
    // el historial (ejecutarComando lo añade después de llamar a la acción).
    setTimeout(() => {
      this.historial.set([]);
      this.hireMode.set(false);
      this.snakeActivo.set(false);
      this.resetIntro();
      this.animar();
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.hireMode() || e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key.toLowerCase();

    if (key === 'y') {
      e.preventDefault();
      this.runHireSequence();
    } else if (key === 'n') {
      e.preventDefault();
      this.cancelarHire();
    }
  }

  private cancelarHire() {
    this.hireMode.set(false);
    this.hireOutput.set([]);
    this.terminalInputValue.set('');
    this.focusTerminal();
  }

  private async animar() {
    await this.esperar(400);
    await this.escribir('whoami', this.comando1);
    await this.esperar(250);
    this.mostrarSalida1.set(true);
    await this.esperar(500);
    this.cursorEn.set(2);
    await this.escribir('cat sobre-mi.txt', this.comandoCat);
    await this.esperar(250);
    this.mostrarSalidaCat.set(true);
    this.scrollToBottom();
    await this.esperar(800);
    this.cursorEn.set(3);
    await this.escribir('neofetch', this.comandoNeofetch);
    await this.esperar(250);
    this.mostrarSalidaNeofetch.set(true);
    this.scrollToBottom();
    await this.esperar(800);
    this.mostrarLinea2.set(true);
    this.cursorEn.set(4);
    await this.esperar(150);
    await this.escribir('ls ./', this.comando2);
    await this.esperar(250);
    this.mostrarSalida2.set(true);
    await this.esperar(300);
    this.mostrarPromptFinal.set(true);
    this.cursorEn.set(5);
    this.scrollToBottom();
    this.focusTerminal();
  }

  onInput(event: Event) {
    this.terminalInputValue.set((event.target as HTMLInputElement).value);
    this.scrollToBottom();
  }

  cerrarSnake() {
    this.snakeActivo.set(false);
    this.scrollToBottom();
    this.focusTerminal();
  }

  ejecutarComando() {
    const cmd = this.terminalInputValue().trim().toLowerCase();
    this.terminalInputValue.set('');
    // Limpia también el DOM: con teclados virtuales (IME) el binding [value]
    // puede no reescribir el input y el comando se quedaría visible
    if (this.terminalInput?.nativeElement) {
      this.terminalInput.nativeElement.value = '';
    }

    // En modo hire, la confirmación también puede llegar escrita + Enter:
    // los teclados virtuales móviles no emiten keydown con la tecla real
    if (this.hireMode()) {
      if (['y', 'yes', 's', 'si', 'sí'].includes(cmd)) {
        this.runHireSequence();
      } else if (['n', 'no'].includes(cmd)) {
        this.cancelarHire();
      }
      return;
    }

    // Enter en vacío: solo repite el prompt, como en bash
    if (!cmd) {
      this.historial.update(h => [...h, { comando: '', salida: [] }]);
      this.scrollToBottom();
      return;
    }

    // 'help' guarda la clave i18n (no el texto) para que se re-traduzca al
    // cambiar de idioma; el resto guarda su salida literal.
    if (cmd === 'help') {
      this.historial.update(h => [...h, { comando: cmd, salida: [], salidaKey: 'inicio.help' }]);
      this.scrollToBottom();
      return;
    }

    const accion = this.comandos[cmd];
    const salida = accion ? accion() : [`bash: ${cmd}: command not found`];
    this.historial.update(h => [...h, { comando: cmd, salida }]);
    this.scrollToBottom();
  }

  private hireEnCurso = false;

  private async runHireSequence() {
    if (this.hireEnCurso) return;
    this.hireEnCurso = true;
    this.hireOutput.set([]);
    const lineas = this.transloco.translateObject<string[]>('inicio.hireSequence');
    const esperas = [800, 700, 700, 600];

    for (let i = 0; i < lineas.length; i++) {
      this.hireOutput.update(arr => [...arr, lineas[i]]);
      this.scrollToBottom();
      await this.esperar(esperas[i] ?? 700);
    }

    this.hireMode.set(false);
    this.hireEnCurso = false;
    this.router.navigate(['/contacto']);
  }

  // forzar = true cuando el usuario toca la línea del prompt (también en móvil).
  // Sin forzar, solo enfoca en dispositivos con puntero fino para no abrir
  // el teclado virtual nada más cargar.
  focusTerminal(forzar = false) {
    if (!forzar && !window.matchMedia('(pointer: fine)').matches) return;
    setTimeout(() => {
      this.terminalInput?.nativeElement?.focus();
    }, 50);
  }

  private scrollToBottom() {
    setTimeout(() => {
      // Desplaza el ancestro scrolleable (el área de la ventana de terminal)
      // hasta dejar visible el final de la sesión
      this.terminalScroll?.nativeElement?.scrollIntoView({ block: 'end' });
    }, 0);
  }

  private escribir(texto: string, destino: WritableSignal<string>) {
    return new Promise<void>(resolve => {
      let i = 0;
      const intervalo = setInterval(() => {
        destino.set(texto.slice(0, ++i));
        if (i === texto.length) {
          clearInterval(intervalo);
          resolve();
        }
      }, 55);
    });
  }

  private esperar(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
