import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../api-config';
import { Page } from '../models/page.model';
import { Product } from '../models/product.model';
import { ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProductApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getProducts sin categoría pide page y size', () => {
    service.getProducts(null, 0, 10).subscribe();

    const req = httpMock.expectOne(r => r.url === `${API_BASE_URL}/products`);
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.has('category')).toBeFalse();
    req.flush({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 } satisfies Page<Product>);
  });

  it('getProducts con categoría agrega el parámetro category', () => {
    service.getProducts('Electrónica', 0, 10).subscribe();

    const req = httpMock.expectOne(r => r.url === `${API_BASE_URL}/products`);
    expect(req.request.params.get('category')).toBe('Electrónica');
    req.flush({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 } satisfies Page<Product>);
  });

  it('getProductById pide el detalle por id', () => {
    service.getProductById(5).subscribe();

    const req = httpMock.expectOne(`${API_BASE_URL}/products/5`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 5, sku: 'SKU-5', name: 'Producto', category: 'Cat', currentStock: 1, minStock: 1, unitPrice: 1 } satisfies Product);
  });
});
