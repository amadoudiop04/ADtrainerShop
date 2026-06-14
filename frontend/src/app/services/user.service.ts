import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const LS_KEY = 'adtrainer_user';

const mapApiUser = (u: ApiUser): UserProfile => ({
  id: u.id,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  phone: u.phone ?? '',
  role: u.role,
  isActive: u.is_active,
  createdAt: u.created_at,
});

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  register(data: { firstName: string; lastName: string; email: string; password: string; phone?: string }): Observable<UserProfile> {
    return this.http.post<ApiUser>(`${this.base}/auth/register`, data).pipe(
      tap(u => this.saveLocal(mapApiUser(u)))
    ) as unknown as Observable<UserProfile>;
  }

  login(email: string, password: string): Observable<UserProfile> {
    return this.http.post<ApiUser>(`${this.base}/auth/login`, { email, password }).pipe(
      tap(u => this.saveLocal(mapApiUser(u)))
    ) as unknown as Observable<UserProfile>;
  }

  updateProfile(id: string, data: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'email' | 'phone'>>): Observable<UserProfile> {
    return this.http.put<ApiUser>(`${this.base}/users/${id}`, data).pipe(
      tap(u => this.saveLocal(mapApiUser(u)))
    ) as unknown as Observable<UserProfile>;
  }

  getLocal(): UserProfile | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private saveLocal(user: UserProfile): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(LS_KEY, JSON.stringify(user));
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(LS_KEY);
    }
  }
}
