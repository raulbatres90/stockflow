import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { InventoryStore } from '../../core/services/inventory-store.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})
export class AlertsComponent implements OnInit {
  readonly store = inject(InventoryStore);

  ngOnInit(): void {
    if (this.store.products().length === 0) {
      this.store.loadAll();
    }
  }
}
