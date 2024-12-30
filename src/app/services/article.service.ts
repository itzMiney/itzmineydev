import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  authorId: number;
  authorName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = '/api/articles';

  constructor(private http: HttpClient) {}

  getAllArticles(): Observable<Article[]> {
    const timeStampedUrl = "/api/articles?timestamp=" + new Date().getTime();
    return this.http.get<Article[]>(timeStampedUrl);
  }

  getArticleBySlug(slug: string): Observable<Article |undefined> {
    return this.http.get<Article[]>(this.apiUrl).pipe(
      map((articles) => articles.find((article) => article.slug === slug))
    );
  }

  getArticleById(id: number): Observable<Article |undefined> {
    return this.http.get<Article[]>(this.apiUrl).pipe(
      map((articles) => articles.find((article) => article.id === id))
    );
  }

  postArticle(token: string, title: string, content: string ): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, {
      title,
      content
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  deleteArticle(id: number, token: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map((response) => {
        // If the backend responds successfully, return true
        return !!(response && response.message === 'Article deleted');
      })
    );
  }

  editArticle(id: number, token: string | null, title: string, content: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { title, content };

    return this.http.put<any>(`${this.apiUrl}/${id}`, body, { headers });
  }
}
