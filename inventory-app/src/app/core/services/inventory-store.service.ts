import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { StockAlert } from '../models/stock-alert.model';
import { AlertApiService } from './alert-api.service';
import { ProductApiService } from './product-api.service';
import { ToastService } from './toast.service';

const FILTER_STORAGE_KEY = 'stockflow.categoryFilter';
const PAGE_SIZE = 8;

// El catálogo es pequeño (demo de ~20 productos), así que se carga completo una
// sola vez y el filtro/paginación de la tabla se hace en el cliente sobre esa lista.
@Injectable({ providedIn: 'root' })
export class InventoryStore {
  private readonly productApi = inject(ProductApiService);
  private readonly alertApi = inject(AlertApiService);
  private readonly toast = inject(ToastService);

  readonly products = signal<Product[]>([]);
  readonly alerts = signal<StockAlert[]>([]);
  readonly selectedProduct = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly categoryFilter = signal<string | null>(localStorage.getItem(FILTER_STORAGE_KEY));
  readonly page = signal(0);

  readonly categories = computed(() =>
    [...new Set(this.products().map(p => p.category))].sort()
  );

  readonly filteredProducts = computed(() => {
    const category = this.categoryFilter();
    return category ? this.products().filter(p => p.category === category) : this.products();
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / PAGE_SIZE)));

  readonly pagedProducts = computed(() => {
    const start = this.page() * PAGE_SIZE;
    return this.filteredProducts().slice(start, start + PAGE_SIZE);
  });

  readonly totalProducts = computed(() => this.products().length);
  readonly totalCriticalAlerts = computed(() => this.alerts().filter(a => a.severity === 'CRITICAL').length);
  readonly totalInventoryValue = computed(() =>
    this.products().reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0)
  );

  constructor() {
    effect(() => {
      const category = this.categoryFilter();
      if (category) {
        localStorage.setItem(FILTER_STORAGE_KEY, category);
      } else {
        localStorage.removeItem(FILTER_STORAGE_KEY);
      }
    });

    effect(() => {
      const activeAlerts = this.alerts();
      if (activeAlerts.length > 0) {
        this.toast.show(
          'Alertas de inventario',
          `${activeAlerts.length} producto(s) con stock bajo o crítico`,
          'error'
        );
      }
    }, { allowSignalWrites: true });
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productApi.getProducts(null, 0, 100).subscribe({
      next: page => {
        this.products.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos');
        this.loading.set(false);
      }
    });

    this.alertApi.getAlerts().subscribe({
      next: alerts => this.alerts.set(alerts),
      error: () => this.error.set('No se pudieron cargar las alertas')
    });
  }

  setCategoryFilter(category: string | null): void {
    this.categoryFilter.set(category);
    this.page.set(0);
  }

  setPage(page: number): void {
    this.page.set(page);
  }

  selectProduct(product: Product | null): void {
    this.selectedProduct.set(product);
  }

  refreshAfterMovement(): void {
    this.loadAll();
  }
}
