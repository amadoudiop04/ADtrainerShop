import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  subscribe(email: string, firstName?: string, lastName?: string): Observable<unknown> {
    return this.http.post(`${this.base}/newsletter-subscriptions`, { email, first_name: firstName, last_name: lastName });
  }
}
