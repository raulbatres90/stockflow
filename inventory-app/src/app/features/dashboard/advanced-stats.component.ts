import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { InventoryStore } from '../../core/services/inventory-store.service';

interface CategoryStat {
  category: string;
  value: number;
  percent: number;
}

@Component({
  selector: 'app-advanced-stats',
  standalone: true,
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './advanced-stats.component.html',
  styleUrl: './advanced-stats.component.scss'
})
export class AdvancedStatsComponent {
  private readonly store = inject(InventoryStore);

  readonly categoryStats = computed<CategoryStat[]>(() => {
    const products = this.store.products();
    const totals = new Map<string, number>();
    for (const product of products) {
      const current = totals.get(product.category) ?? 0;
      totals.set(product.category, current + product.currentStock * product.unitPrice);
    }
    const max = Math.max(1, ...totals.values());
    return [...totals.entries()]
      .map(([category, value]) => ({ category, value, percent: Math.round((value / max) * 100) }))
      .sort((a, b) => b.value - a.value);
  });

  readonly lowStockCount = computed(() =>
    this.store.products().filter(p => p.currentStock <= p.minStock).length
  );
}
