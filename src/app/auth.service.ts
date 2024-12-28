import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:7020/api/auth/login';  // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:7020/api/auth/login', { username, password })
        .pipe(
            tap((response: any) => {
              // Store token in localStorage after successful login
              if (response.token) {
                localStorage.setItem('token', response.token);
              }
            })
        );
  }
}
