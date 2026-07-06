import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-stack">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class.err]="toast.kind === 'error'" (click)="toastService.dismiss(toast.id)">
          <div class="ti" [class.err]="toast.kind === 'error'">
            @if (toast.kind === 'error') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            }
          </div>
          <div>
            <div class="tt">{{ toast.title }}</div>
            @if (toast.detail) {
              <div class="ts">{{ toast.detail }}</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack { position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; max-width: 360px; }
    .toast { display: flex; align-items: flex-start; gap: 12px; background: var(--navy2); border: 1px solid var(--line2); border-left: 3px solid var(--green); border-radius: 12px; padding: 13px 16px; box-shadow: 0 24px 60px -20px rgba(0,0,0,.6); cursor: pointer; animation: slideIn .25s ease-out; }
    .toast.err { border-left-color: var(--red); }
    .ti { width: 30px; height: 30px; border-radius: 9px; background: rgba(111,191,143,.16); color: var(--green); display: flex; align-items: center; justify-content: center; flex: none; }
    .ti.err { background: rgba(224,115,106,.16); color: var(--red); }
    .ti svg { width: 16px; height: 16px; }
    .tt { font-size: 13px; font-weight: 700; }
    .ts { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
    @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
