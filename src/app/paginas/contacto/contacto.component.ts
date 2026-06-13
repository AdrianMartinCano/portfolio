import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { environment } from '../../../environments/environment';

interface ContactoForm {
  nombre: string;
  email: string;
  mensaje: string;
  website: string; // honeypot: un campo oculto que solo rellenan los bots
}

type EstadoEnvio = 'idle' | 'ok' | 'limite' | 'error';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoPipe],
  templateUrl: './contacto.component.html'
})
export class ContactoComponent implements OnDestroy {
  private http = inject(HttpClient);
  private transloco = inject(TranslocoService);

  // Tras cuántos ms se oculta solo el mensaje de estado
  private static readonly AUTO_OCULTAR_MS = 6000;

  formulario: ContactoForm = { nombre: '', email: '', mensaje: '', website: '' };
  enviando = signal(false);
  estado = signal<EstadoEnvio>('idle');

  // Fecha y hora local para las líneas de "enlaces.log"
  protected readonly logTimestamp = (() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  })();

  private temporizador?: ReturnType<typeof setTimeout>;

  enviar(f: NgForm) {
    if (f.invalid || this.enviando()) return;

    this.enviando.set(true);
    this.mostrarEstado('idle');

    const payload = { ...this.formulario, lang: this.transloco.getActiveLang() };
    this.http.post(`${environment.apiUrl}/api/contacto`, payload).subscribe({
      next: () => {
        this.enviando.set(false);
        this.mostrarEstado('ok');
        f.resetForm();
      },
      error: (err) => {
        this.enviando.set(false);
        this.mostrarEstado(err.status === 429 ? 'limite' : 'error');
      }
    });
  }

  // Muestra un estado y programa su desaparición automática
  private mostrarEstado(estado: EstadoEnvio) {
    clearTimeout(this.temporizador);
    this.estado.set(estado);
    if (estado !== 'idle') {
      this.temporizador = setTimeout(
        () => this.estado.set('idle'),
        ContactoComponent.AUTO_OCULTAR_MS
      );
    }
  }

  ngOnDestroy() {
    clearTimeout(this.temporizador);
  }
}
