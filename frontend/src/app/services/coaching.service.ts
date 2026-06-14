import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CoachingRequestPayload {
  full_name: string;
  email: string;
  phone?: string;
  coaching_type: 'one_to_one' | 'e_coaching';
  availability?: string;
  message?: string;
  user_id?: string;
}

@Injectable({ providedIn: 'root' })
export class CoachingService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submit(payload: CoachingRequestPayload): Observable<unknown> {
    return this.http.post(`${this.base}/coaching-requests`, payload);
  }
}
