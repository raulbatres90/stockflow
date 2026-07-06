import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/api-config';
import { MovementHistoryComponent } from './movement-history.component';

describe('MovementHistoryComponent', () => {
  let fixture: ComponentFixture<MovementHistoryComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MovementHistoryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(MovementHistoryComponent);
    fixture.componentRef.setInput('productId', 3);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('pide el historial del producto recibido por input', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${API_BASE_URL}/movements/3/history`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('muestra el mensaje de "sin movimientos" cuando la lista viene vacía', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${API_BASE_URL}/movements/3/history`).flush([]);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Sin movimientos registrados');
  });

  it('renderiza los movimientos recibidos', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${API_BASE_URL}/movements/3/history`).flush([
      { id: 1, productId: 3, type: 'OUT', quantity: 4, reason: 'venta', timestamp: '2026-01-01T10:00:00' }
    ]);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('OUT');
    expect(text).toContain('venta');
  });
});
