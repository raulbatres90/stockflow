import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { InventoryStore } from '../../core/services/inventory-store.service';
import { StockBadgeComponent } from '../../shared/stock-badge/stock-badge.component';
import { MovementHistoryComponent } from './movement-history.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe, StockBadgeComponent, MovementHistoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  readonly store = inject(InventoryStore);

  ngOnInit(): void {
    if (this.store.products().length === 0) {
      this.store.loadAll();
    }
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.setCategoryFilter(value || null);
  }
}
