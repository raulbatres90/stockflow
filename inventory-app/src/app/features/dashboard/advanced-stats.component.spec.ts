import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryStore } from '../../core/services/inventory-store.service';
import { Product } from '../../core/models/product.model';
import { AdvancedStatsComponent } from './advanced-stats.component';

function buildProduct(overrides: Partial<Product>): Product {
  return { id: 1, sku: 'A', name: 'A', category: 'X', currentStock: 1, minStock: 1, unitPrice: 1, ...overrides };
}

describe('AdvancedStatsComponent', () => {
  let fixture: ComponentFixture<AdvancedStatsComponent>;
  let store: InventoryStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdvancedStatsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(AdvancedStatsComponent);
    store = TestBed.inject(InventoryStore);
  });

  it('agrupa el valor de inventario por categoría', () => {
    store.products.set([
      buildProduct({ id: 1, category: 'Electrónica', currentStock: 10, unitPrice: 2 }),
      buildProduct({ id: 2, category: 'Electrónica', currentStock: 5, unitPrice: 2 }),
      buildProduct({ id: 3, category: 'Muebles', currentStock: 1, unitPrice: 100 })
    ]);

    const stats = fixture.componentInstance.categoryStats();

    const electronica = stats.find(s => s.category === 'Electrónica');
    expect(electronica?.value).toBe(30);
  });

  it('ordena las categorías de mayor a menor valor', () => {
    store.products.set([
      buildProduct({ id: 1, category: 'Bajo valor', currentStock: 1, unitPrice: 1 }),
      buildProduct({ id: 2, category: 'Alto valor', currentStock: 100, unitPrice: 50 })
    ]);

    const stats = fixture.componentInstance.categoryStats();

    expect(stats[0].category).toBe('Alto valor');
  });

  it('cuenta los productos en o bajo el mínimo', () => {
    store.products.set([
      buildProduct({ id: 1, currentStock: 2, minStock: 10 }),
      buildProduct({ id: 2, currentStock: 20, minStock: 10 })
    ]);

    expect(fixture.componentInstance.lowStockCount()).toBe(1);
  });

  it('renderiza una barra por categoría', () => {
    store.products.set([
      buildProduct({ id: 1, category: 'Electrónica' }),
      buildProduct({ id: 2, category: 'Muebles' })
    ]);
    fixture.detectChanges();

    const bars = (fixture.nativeElement as HTMLElement).querySelectorAll('.bar');
    expect(bars.length).toBe(2);
  });
});
