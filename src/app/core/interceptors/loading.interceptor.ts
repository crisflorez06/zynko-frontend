import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loading = inject(LoadingService);

  // Permitir saltar el loader agregando un header opcional
  const skip = req.headers.get('x-skip-loader') === 'true';

  if (!skip) {
    loading.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skip) loading.hide();
    })
  );
};