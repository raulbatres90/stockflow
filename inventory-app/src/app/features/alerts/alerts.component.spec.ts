import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryStore } from '../../core/services/inventory-store.service';
import { AlertsComponent } from './alerts.component';

describe('AlertsComponent', () => {
  let fixture: ComponentFixture<AlertsComponent>;
  let store: InventoryStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlertsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(AlertsComponent);
    store = TestBed.inject(InventoryStore);
  });

  it('muestra el estado "sin alertas" cuando la lista está vacía', () => {
    store.products.set([{ id: 1, sku: 'A', name: 'A', category: 'X', currentStock: 10, minStock: 1, unitPrice: 1 }]);
    store.alerts.set([]);

    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Sin alertas activas');
  });

  it('lista las alertas activas con su severidad', () => {
    store.products.set([{ id: 1, sku: 'A', name: 'A', category: 'X', currentStock: 10, minStock: 1, unitPrice: 1 }]);
    store.alerts.set([
      { productId: 1, productName: 'Aceite', currentStock: 2, minStock: 10, severity: 'CRITICAL' }
    ]);

    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Aceite');
    expect(text).toContain('CRITICAL');
  });
});
