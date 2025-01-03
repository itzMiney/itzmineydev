import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

interface Username {
  id: number;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(token: string | null): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/?timestamp=${new Date().getTime()}`, { headers });
  }

  createUser(token: string, username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, {
      username,
      password
    }, { headers });
  }

  editUser(id: number, token: string | null, username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body: any = {};
    if (username) {
      body.username = username
    }
    if (password) {
      body.password = password;
    }

    return this.http.put<any>(`${this.apiUrl}/${id}`, body, { headers });
  }

  deleteUser(id: number, token: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map((response) => {
        // If the backend responds successfully, return true
        return !!(response && response.message === 'User deleted');
      })
    );
  }

  getUserById(id: number, token: string): Observable<Username | undefined> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Username>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map(user => user)
    );
  }
}
