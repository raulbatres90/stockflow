import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stock-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="pill" [class.gr]="status() === 'OK'" [class.am]="status() === 'BAJO'" [class.rd]="status() === 'CRITICO'">{{ status() }}</span>`
})
export class StockBadgeComponent {
  currentStock = input.required<number>();
  minStock = input.required<number>();

  status = computed(() => {
    const current = this.currentStock();
    const min = this.minStock();
    if (current > min) return 'OK';
    if (current * 2 <= min) return 'CRITICO';
    return 'BAJO';
  });
}
