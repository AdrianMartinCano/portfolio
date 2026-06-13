import { Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, switchMap, tap, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

const TIMEOUT_MS = 8000;

export interface DatosApi<T> {
  // Los datos (vacío hasta que llega la primera respuesta)
  datos: Signal<T[]>;
  // true mientras hay una petición en vuelo; sirve para el spinner
  cargando: Signal<boolean>;
}

// Pide los datos a la API (según el idioma activo); si tarda más de
// TIMEOUT_MS o falla (cold start de Render, sin red...), cae a los
// JSON locales de i18n para no dejar la UI vacía.
//
// Pensado para vivir en un servicio `providedIn: 'root'`: así la
// suscripción dura toda la app y la respuesta queda cacheada (prefetch).
export function datosDesdeApi<T>(
  http: HttpClient,
  transloco: TranslocoService,
  endpoint: string,
  claveI18n: string
): DatosApi<T> {
  const cargando = signal(true);

  const datos = toSignal(
    transloco.langChanges$.pipe(
      switchMap(lang => {
        cargando.set(true);
        return http.get<T[]>(`${environment.apiUrl}/api/${endpoint}`, { params: { lang } }).pipe(
          timeout(TIMEOUT_MS),
          catchError(() => transloco.selectTranslateObject<T[]>(`datos.${claveI18n}`)),
          tap(() => cargando.set(false))
        );
      })
    ),
    { initialValue: [] as T[] }
  );

  return { datos, cargando };
}
