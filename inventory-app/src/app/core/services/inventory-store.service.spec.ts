import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../api-config';
import { Product } from '../models/product.model';
import { InventoryStore } from './inventory-store.service';

function buildProduct(overrides: Partial<Product>): Product {
  return {
    id: 1,
    sku: 'SKU-1',
    name: 'Producto',
    category: 'Categoría A',
    currentStock: 10,
    minStock: 5,
    unitPrice: 10,
    ...overrides
  };
}

describe('InventoryStore', () => {
  let store: InventoryStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    store = TestBed.inject(InventoryStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushLoadAll(products: Product[], alerts: unknown[] = []): void {
    store.loadAll();
    httpMock.expectOne(r => r.url === `${API_BASE_URL}/products`).flush({ content: products });
    httpMock.expectOne(`${API_BASE_URL}/alerts`).flush(alerts);
  }

  it('calcula totalProducts a partir de la lista cargada', () => {
    flushLoadAll([buildProduct({ id: 1 }), buildProduct({ id: 2 })]);

    expect(store.totalProducts()).toBe(2);
  });

  it('calcula totalInventoryValue como stock * precio', () => {
    flushLoadAll([
      buildProduct({ id: 1, currentStock: 10, unitPrice: 5 }),
      buildProduct({ id: 2, currentStock: 3, unitPrice: 20 })
    ]);

    expect(store.totalInventoryValue()).toBe(10 * 5 + 3 * 20);
  });

  it('calcula totalCriticalAlerts solo con severidad CRITICAL', () => {
    flushLoadAll([], [
      { productId: 1, productName: 'A', currentStock: 1, minStock: 10, severity: 'CRITICAL' },
      { productId: 2, productName: 'B', currentStock: 4, minStock: 5, severity: 'LOW' }
    ]);

    expect(store.totalCriticalAlerts()).toBe(1);
  });

  it('deriva las categorías únicas de los productos cargados', () => {
    flushLoadAll([
      buildProduct({ id: 1, category: 'Electrónica' }),
      buildProduct({ id: 2, category: 'Muebles' }),
      buildProduct({ id: 3, category: 'Electrónica' })
    ]);

    expect(store.categories()).toEqual(['Electrónica', 'Muebles']);
  });

  it('setCategoryFilter filtra los productos y reinicia la página', () => {
    flushLoadAll([
      buildProduct({ id: 1, category: 'Electrónica' }),
      buildProduct({ id: 2, category: 'Muebles' })
    ]);
    store.setPage(2);

    store.setCategoryFilter('Muebles');

    expect(store.filteredProducts().length).toBe(1);
    expect(store.filteredProducts()[0].category).toBe('Muebles');
    expect(store.page()).toBe(0);
  });

  it('persiste el filtro de categoría en localStorage', () => {
    store.setCategoryFilter('Juguetes');
    TestBed.flushEffects();

    expect(localStorage.getItem('stockflow.categoryFilter')).toBe('Juguetes');
  });

  it('quita el filtro de localStorage cuando se limpia', () => {
    store.setCategoryFilter('Juguetes');
    TestBed.flushEffects();
    store.setCategoryFilter(null);
    TestBed.flushEffects();

    expect(localStorage.getItem('stockflow.categoryFilter')).toBeNull();
  });

  it('pagedProducts corta la lista filtrada en páginas de 8', () => {
    const products = Array.from({ length: 20 }, (_, i) => buildProduct({ id: i + 1 }));
    flushLoadAll(products);

    expect(store.pagedProducts().length).toBe(8);
    expect(store.totalPages()).toBe(3);
  });
});
