import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ArticleService} from '../services/article.service';
import {NgFor, NgIf} from '@angular/common';
import {Observer} from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    NgIf,
    NgFor
  ]
})
export class AdminComponent implements OnInit {
  articles: any[] = [];
  noArticles: boolean = false;

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit() {
    this.fetchArticles();
  }

  // Fetch articles from backend
  fetchArticles() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']).then(
        (success) => {
          if (success) {
            console.log('Navigation to login succeeded');
          } else {
            console.warn('Navigation to login failed');
          }
        },
        (error) => {
          console.error('Navigation error:', error);
        }
      );
      return;
    }

    const articleObserver: Observer<any> = {
      next: (data) => {
        this.articles = data;
        this.noArticles = this.articles.length === 0;
      },
      error: (error) => {
        console.error('Failed to load articles', error);
      },
      complete: () => {
        console.log('Article loading complete');
      }
    };

    this.articleService.getArticles(token).subscribe(articleObserver);
  }

  createArticle() {
    alert('Create article functionality goes here');
  }

  editArticle() {
    alert('Delete article functionality goes here');
  }

  deleteArticle() {
    alert('Delete article functionality goes here');
  }

  viewArticles() {
    this.fetchArticles();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(
      (success) => {
        if (success) {
          console.log('Navigation to login succeeded');
        } else {
          console.warn('Navigation to login failed');
        }
      },
      (error) => {
        console.error('Navigation error:', error);
      }
    );
  }
}
