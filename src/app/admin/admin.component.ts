import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../article.service';
import {NgFor, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    NgIf,
    NgFor,
    HttpClientModule
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
      this.router.navigate(['/login']);  // Redirect to login if not logged in
      return;
    }

    this.articleService.getArticles(token).subscribe(
      (data) => {
        this.articles = data;
        this.noArticles = this.articles.length === 0;
      },
      (error) => {
        console.error('Failed to load articles', error);
      }
    );
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
    this.router.navigate(['/login']);  // Redirect to login page
  }
}
