import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockBadgeComponent } from './stock-badge.component';

describe('StockBadgeComponent', () => {
  let fixture: ComponentFixture<StockBadgeComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBadgeComponent);
  });

  function setInputs(currentStock: number, minStock: number): void {
    fixture.componentRef.setInput('currentStock', currentStock);
    fixture.componentRef.setInput('minStock', minStock);
    fixture.detectChanges();
  }

  it('muestra OK cuando el stock está por encima del mínimo', () => {
    setInputs(50, 10);
    expect(fixture.componentInstance.status()).toBe('OK');
  });

  it('muestra BAJO cuando el stock está en el mínimo pero no a la mitad', () => {
    setInputs(9, 10);
    expect(fixture.componentInstance.status()).toBe('BAJO');
  });

  it('muestra CRITICO cuando el stock cae a la mitad del mínimo o menos', () => {
    setInputs(5, 10);
    expect(fixture.componentInstance.status()).toBe('CRITICO');
  });

  it('renderiza el texto del estado en el DOM', () => {
    setInputs(2, 10);
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('CRITICO');
  });
});
