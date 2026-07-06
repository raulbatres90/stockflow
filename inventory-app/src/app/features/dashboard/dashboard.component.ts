import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { InventoryStore } from '../../core/services/inventory-store.service';
import { AdvancedStatsComponent } from './advanced-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, AdvancedStatsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  readonly store = inject(InventoryStore);

  ngOnInit(): void {
    this.store.loadAll();
  }
}
