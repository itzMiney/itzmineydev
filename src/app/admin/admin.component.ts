import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ArticleService} from '../services/article.service';
import {NgFor, NgIf, NgStyle} from '@angular/common';
import { Observer} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {DeviceDetectorService} from '../services/device-detector.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    NgStyle
  ]
})
export class AdminComponent implements OnInit {
  articles: any[] = [];
  noArticles: boolean = false;
  isMobile: boolean = false;
  title: string = '';
  content: string = '';
  token: string | null = localStorage.getItem('token');

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private titleService: Title
  ) {}

  // Fetch articles from backend
  ngOnInit() {
    this.titleService.setTitle('Admin Panel | itzMiney')
    this.isMobile = this.deviceService.isMobile;
    if (!this.token) {
      this.navigateToLogin();
      return;
    }
    this.loadArticles()
  }

  navigateToLogin() {
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

  createArticle(form: any) {
    if (!this.token) {
      this.navigateToLogin();
      return;
    }

    const title = form.value.title;
    const content = form.value.content;

    if (!title || !content) {
      alert('Both title and content are required!');
      return;
    }

    this.articleService.postArticle(this.token, title, content).subscribe(
      (response) => {
        alert('Article created successfully!');
        this.loadArticles();
        console.log(response);  // You can log the response or take further actions like redirecting
      },
      (error) => {
        alert('Error creating article');
        console.error(error);  // Log the error for debugging
      }
    );
  }

  editArticle(form: any): void {
    if (!this.token) {
      this.navigateToLogin();
      return;
    }

    const articleId = form.value.editId;

    if (articleId && !isNaN(Number(articleId))) {
      const id = Number(articleId);

      // Fetch the current article to get existing values
      this.articleService.getArticleById(id).subscribe(
        (article) => {
          if (!article) {
            alert(`Article with ID ${id} not found.`);
            return;
          }

          // Prompt for title and content with placeholders
          const newTitle = form.value.editTitle || form.value.editTitleMobile;
          const newContent = form.value.editContent || form.value.editContentMobile;

          // Use current values if left blank
          const updatedTitle = newTitle?.trim() || article.title;
          const updatedContent = newContent?.trim() || article.content;

          this.articleService.editArticle(id, this.token, updatedTitle, updatedContent).subscribe(
            (response) => {
              alert(`Article ${id} updated successfully!`);
              console.log('Updated Article:', response);
              this.loadArticles();
            },
            (error) => {
              alert(`Error updating article ${id}: ${error.message}`);
            }
          );
        },
        (error: { message: any; }) => {
          alert(`Failed to fetch article with ID ${id}: ${error.message}`);
        }
      );
    } else {
      alert('Invalid input. Please enter a valid article ID.');
    }
  }

  deleteArticle(form: any): void {
    if (!this.token) {
      this.navigateToLogin();
      return;
    }

    const articleId = form.value.deleteId || form.value.deleteIdMobile;

    if (articleId && !isNaN(Number(articleId))) {
      this.articleService.deleteArticle(articleId, this.token).subscribe(
        () => {
          alert(`Article ${articleId} deleted successfully`);
          this.loadArticles();
        },
        (error) => {
          alert(`Error deleting article ${articleId}: ${error.message}`);
        }
      );
    } else {
      alert('Invalid input. Please enter a valid article ID.');
    }
  }

  navigateToArticle(slug: string): void {
    this.router.navigate([`/blog/${slug}`]);
  }

  loadArticles(): void {
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
    this.articleService.getAllArticles().subscribe(articleObserver);
  }

  logout() {
    localStorage.removeItem('token');
    this.navigateToLogin();
  }
}
