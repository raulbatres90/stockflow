import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ToastService } from '../services/toast.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('muestra un toast con el mensaje del backend cuando la petición falla', () => {
    spyOn(toastService, 'show');

    http.get('/api/v1/products/99').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/v1/products/99');
    req.flush(
      { timestamp: '2026-01-01', status: 404, error: 'Recurso no encontrado', message: 'Producto no encontrado con id 99', path: '/api/v1/products/99' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(toastService.show).toHaveBeenCalledWith('Recurso no encontrado', 'Producto no encontrado con id 99', 'error');
  });

  it('usa un mensaje genérico cuando no hay body de error', () => {
    spyOn(toastService, 'show');

    http.get('/api/v1/products').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/v1/products');
    req.error(new ProgressEvent('network error'));

    expect(toastService.show).toHaveBeenCalledWith(
      'Error de conexión',
      'No se pudo conectar con el servidor. Intenta de nuevo.',
      'error'
    );
  });

  it('re-lanza el error para que el llamador también pueda reaccionar', () => {
    let received: unknown = null;

    http.get('/api/v1/products/99').subscribe({ error: err => (received = err) });

    const req = httpMock.expectOne('/api/v1/products/99');
    req.flush({ message: 'x' }, { status: 500, statusText: 'Internal Server Error' });

    expect(received).not.toBeNull();
  });
});
