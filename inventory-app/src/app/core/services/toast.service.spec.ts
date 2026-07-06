import { fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
  });

  it('agrega un toast con show()', () => {
    service.show('Título', 'Detalle', 'ok');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].title).toBe('Título');
    expect(service.toasts()[0].kind).toBe('ok');
  });

  it('usa "ok" como kind por defecto', () => {
    service.show('Sin kind');

    expect(service.toasts()[0].kind).toBe('ok');
  });

  it('quita un toast con dismiss()', () => {
    service.show('Uno');
    const id = service.toasts()[0].id;

    service.dismiss(id);

    expect(service.toasts().length).toBe(0);
  });

  it('se auto-descarta a los 5 segundos', fakeAsync(() => {
    service.show('Temporal');
    expect(service.toasts().length).toBe(1);

    tick(5000);

    expect(service.toasts().length).toBe(0);
  }));

  it('permite varios toasts simultáneos', () => {
    service.show('Uno');
    service.show('Dos');

    expect(service.toasts().length).toBe(2);
  });
});
