import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryStore } from '../../core/services/inventory-store.service';
import { MovementApiService } from '../../core/services/movement-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movement-form.component.html',
  styleUrl: './movement-form.component.scss'
})
export class MovementFormComponent implements OnInit {
  readonly store = inject(InventoryStore);
  private readonly movementApi = inject(MovementApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly submitting = signal(false);

  readonly form = this.fb.group({
    productId: [null as number | null, Validators.required],
    type: ['OUT' as 'IN' | 'OUT', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['']
  });

  ngOnInit(): void {
    if (this.store.products().length === 0) {
      this.store.loadAll();
    }
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const value = this.form.getRawValue();

    this.movementApi.registerMovement({
      productId: value.productId!,
      type: value.type!,
      quantity: value.quantity!,
      reason: value.reason || undefined
    }).subscribe({
      next: () => {
        this.toast.show('Movimiento registrado', 'El stock se actualizó correctamente', 'ok');
        this.form.reset({ productId: null, type: 'OUT', quantity: 1, reason: '' });
        this.submitting.set(false);
        this.store.refreshAfterMovement();
      },
      error: () => {
        this.submitting.set(false);
      }
    });
  }
}
