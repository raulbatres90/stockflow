import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/api-config';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(DashboardComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('pide productos y alertas al iniciar', () => {
    fixture.detectChanges();

    const productsReq = httpMock.expectOne(r => r.url === `${API_BASE_URL}/products`);
    const alertsReq = httpMock.expectOne(`${API_BASE_URL}/alerts`);
    expect(productsReq.request.method).toBe('GET');
    expect(alertsReq.request.method).toBe('GET');
    productsReq.flush({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 100 });
    alertsReq.flush([]);
  });

  it('muestra el mensaje de error cuando falla la carga', () => {
    fixture.detectChanges();

    httpMock.expectOne(r => r.url === `${API_BASE_URL}/products`).flush('error', { status: 500, statusText: 'Error' });
    httpMock.expectOne(`${API_BASE_URL}/alerts`).flush([]);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('No se pudieron cargar los productos');
  });

  it('muestra las KPI con los totales calculados', () => {
    fixture.detectChanges();

    httpMock.expectOne(r => r.url === `${API_BASE_URL}/products`).flush({
      content: [
        { id: 1, sku: 'A', name: 'A', category: 'X', currentStock: 10, minStock: 5, unitPrice: 2 }
      ],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 100
    });
    httpMock.expectOne(`${API_BASE_URL}/alerts`).flush([]);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('$20.00');
  });
});
