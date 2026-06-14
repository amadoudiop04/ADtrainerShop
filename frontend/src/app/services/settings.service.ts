import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getShopStatus(): Observable<{ open: boolean }> {
    return this.http.get<{ open: boolean }>(`${this.base}/settings/shop-status`);
  }

  setShopStatus(open: boolean, userId: string): Observable<{ open: boolean }> {
    const headers = new HttpHeaders({ 'X-User-Id': userId });
    return this.http.put<{ open: boolean }>(
      `${this.base}/settings/shop-status`,
      { open },
      { headers }
    );
  }
}
