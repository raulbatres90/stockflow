import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/api-config';
import { InventoryStore } from '../../core/services/inventory-store.service';
import { MovementFormComponent } from './movement-form.component';

describe('MovementFormComponent', () => {
  let fixture: ComponentFixture<MovementFormComponent>;
  let httpMock: HttpTestingController;
  let store: InventoryStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MovementFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(MovementFormComponent);
    store = TestBed.inject(InventoryStore);
    store.products.set([{ id: 1, sku: 'A', name: 'Mouse', category: 'X', currentStock: 10, minStock: 5, unitPrice: 1 }]);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('el formulario inicia inválido sin producto seleccionado', () => {
    expect(fixture.componentInstance.form.invalid).toBeTrue();
  });

  it('submit() no llama a la API si el formulario es inválido', () => {
    fixture.componentInstance.submit();

    expect(fixture.componentInstance.form.invalid).toBeTrue();
    httpMock.expectNone(`${API_BASE_URL}/movements`);
  });

  it('submit() registra el movimiento y refresca la store al tener éxito', () => {
    fixture.componentInstance.form.setValue({ productId: 1, type: 'OUT', quantity: 2, reason: '' });

    fixture.componentInstance.submit();
    expect(fixture.componentInstance.submitting()).toBeTrue();

    const req = httpMock.expectOne(`${API_BASE_URL}/movements`);
    req.flush({ id: 1, productId: 1, type: 'OUT', quantity: 2, reason: null, timestamp: '2026-01-01' });

    expect(fixture.componentInstance.submitting()).toBeFalse();
    expect(fixture.componentInstance.form.value.productId).toBeNull();

    // refreshAfterMovement() dispara una nueva carga de productos y alertas.
    httpMock.expectOne(r => r.url === `${API_BASE_URL}/products`).flush({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 100 });
    httpMock.expectOne(`${API_BASE_URL}/alerts`).flush([]);
  });

  it('submit() deja de estar en submitting si la petición falla', () => {
    fixture.componentInstance.form.setValue({ productId: 1, type: 'OUT', quantity: 2, reason: '' });

    fixture.componentInstance.submit();
    const req = httpMock.expectOne(`${API_BASE_URL}/movements`);
    req.flush('error', { status: 422, statusText: 'Unprocessable Entity' });

    expect(fixture.componentInstance.submitting()).toBeFalse();
  });
});
