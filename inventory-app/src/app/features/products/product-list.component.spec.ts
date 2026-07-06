import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../core/models/product.model';
import { InventoryStore } from '../../core/services/inventory-store.service';
import { ProductListComponent } from './product-list.component';

function buildProduct(overrides: Partial<Product>): Product {
  return { id: 1, sku: 'A', name: 'A', category: 'Electrónica', currentStock: 10, minStock: 5, unitPrice: 1, ...overrides };
}

describe('ProductListComponent', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let store: InventoryStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(ProductListComponent);
    store = TestBed.inject(InventoryStore);
    // Pre-cargar la store evita que ngOnInit dispare una petición HTTP real en el test.
    store.products.set([
      buildProduct({ id: 1, name: 'Mouse', category: 'Electrónica' }),
      buildProduct({ id: 2, name: 'Silla', category: 'Muebles' })
    ]);
  });

  it('renderiza una fila por producto', () => {
    fixture.detectChanges();

    const rows = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr');
    // Cada producto ocupa 2 filas: la de datos y la del panel de historial diferido.
    expect(rows.length).toBe(4);
  });

  it('onCategoryChange actualiza el filtro en la store', () => {
    fixture.detectChanges();
    const select = document.createElement('select');
    const option = document.createElement('option');
    option.value = 'Muebles';
    select.appendChild(option);
    select.value = 'Muebles';

    fixture.componentInstance.onCategoryChange({ target: select } as unknown as Event);

    expect(store.categoryFilter()).toBe('Muebles');
  });

  it('lista las categorías disponibles en el select', () => {
    fixture.detectChanges();

    const options = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('select option')).map(o => o.textContent?.trim());
    expect(options).toContain('Electrónica');
    expect(options).toContain('Muebles');
  });
});
