import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../models/error-response.model';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const body = error.error as ErrorResponse | null;
      const title = body?.error ?? 'Error de conexión';
      const message = body?.message ?? 'No se pudo conectar con el servidor. Intenta de nuevo.';
      toast.show(title, message, 'error');
      return throwError(() => error);
    })
  );
};
