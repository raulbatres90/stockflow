import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../api-config';
import { MovementApiService } from './movement-api.service';

describe('MovementApiService', () => {
  let service: MovementApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(MovementApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('registerMovement hace POST con el body correcto', () => {
    const request = { productId: 1, type: 'OUT' as const, quantity: 4, reason: 'venta' };

    service.registerMovement(request).subscribe();

    const req = httpMock.expectOne(`${API_BASE_URL}/movements`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({});
  });

  it('getHistory hace GET al endpoint del producto', () => {
    service.getHistory(7).subscribe();

    const req = httpMock.expectOne(`${API_BASE_URL}/movements/7/history`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
