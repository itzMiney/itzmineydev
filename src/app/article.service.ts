import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'http://localhost:7020/api/articles';  // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getArticles(token: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
