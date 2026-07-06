import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../api-config';
import { AlertApiService } from './alert-api.service';

describe('AlertApiService', () => {
  let service: AlertApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AlertApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAlerts hace GET al endpoint de alertas', () => {
    service.getAlerts().subscribe();

    const req = httpMock.expectOne(`${API_BASE_URL}/alerts`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
