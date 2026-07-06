import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { Movement, MovementRequest } from '../models/movement.model';

@Injectable({ providedIn: 'root' })
export class MovementApiService {
  private readonly http = inject(HttpClient);

  registerMovement(request: MovementRequest): Observable<Movement> {
    return this.http.post<Movement>(`${API_BASE_URL}/movements`, request);
  }

  getHistory(productId: number): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${API_BASE_URL}/movements/${productId}/history`);
  }
}
