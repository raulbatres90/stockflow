import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { StockAlert } from '../models/stock-alert.model';

@Injectable({ providedIn: 'root' })
export class AlertApiService {
  private readonly http = inject(HttpClient);

  getAlerts(): Observable<StockAlert[]> {
    return this.http.get<StockAlert[]>(`${API_BASE_URL}/alerts`);
  }
}
