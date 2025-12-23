import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, tap, map, catchError} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth/login';

  private redirectingToLogin = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get token(): string | null {
    return localStorage.getItem('token');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password }).pipe(
      tap((response: any) => {
        if (response?.token) localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void {
    if (this.redirectingToLogin) return;

    if (this.router.url.startsWith('/login')) {
      localStorage.removeItem('token');
      return;
    }

    this.redirectingToLogin = true;

    localStorage.removeItem('token');

    const tree = this.router.parseUrl(this.router.url);
    delete tree.queryParams?.['redirectUrl'];
    const cleanRedirectUrl = tree.toString();

    void this.router.navigate(['/login'], {
      queryParams: { redirectUrl: cleanRedirectUrl },
      replaceUrl: true
    }).finally(() => {
      this.redirectingToLogin = false;
    });
  }

  private isJwtNotExpired(token: string | null): boolean {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expMs = payload.exp * 1000;
      return expMs > Date.now();
    } catch {
      return false;
    }
  }

  isTokenValid(): Observable<boolean> {
    const token = this.token;

    if (!this.isJwtNotExpired(token)) {
      return of(false);
    }

    return this.http.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  validateToken(): Observable<boolean> {
    return this.isTokenValid().pipe(
      tap(valid => {
        if (!valid) {
          this.logout();
        }
      })
    );
  }
}
