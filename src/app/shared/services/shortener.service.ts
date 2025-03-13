import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface ShortURL {
  id: number;
  og_url: string;
  short_url: string;
  author_id: string;
  custom: boolean,
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShortenerService {

  private apiUrl = '/api/short';

  constructor(private http: HttpClient) {}

  getAllURLs(token: string): Observable<ShortURL[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ShortURL[]>(`${this.apiUrl}?timestamp=${new Date().getTime()}`, {headers});
  }

  postURL(token: string, og_url: string, short_name?: string): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, {
      og_url,
      short_name
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  deleteURL(id: number, token: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map((response) => {
        return !!(response && response.message === 'Short URL deleted');
      })
    );
  }
}
