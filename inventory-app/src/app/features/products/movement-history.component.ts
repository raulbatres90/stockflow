import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Movement } from '../../core/models/movement.model';
import { MovementApiService } from '../../core/services/movement-api.service';

@Component({
  selector: 'app-movement-history',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movement-history.component.html',
  styleUrl: './movement-history.component.scss'
})
export class MovementHistoryComponent implements OnInit {
  productId = input.required<number>();

  private readonly movementApi = inject(MovementApiService);

  readonly movements = signal<Movement[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.movementApi.getHistory(this.productId()).subscribe({
      next: movements => {
        this.movements.set(movements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
