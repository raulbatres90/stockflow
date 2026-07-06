import { Injectable, signal } from '@angular/core';

export type ToastKind = 'ok' | 'error';

export interface Toast {
  id: number;
  title: string;
  detail?: string;
  kind: ToastKind;
}

let nextId = 1;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(title: string, detail?: string, kind: ToastKind = 'ok'): void {
    const toast: Toast = { id: nextId++, title, detail, kind };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), 5000);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
