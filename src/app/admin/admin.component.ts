import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ArticleService} from '../services/article.service';
import {NgFor, NgIf, NgStyle} from '@angular/common';
import {Observer} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {DeviceDetectorService} from '../services/device-detector.service';

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
    private deviceService: DeviceDetectorService
  ) {}

  // Fetch articles from backend
  ngOnInit() {
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

  createArticle() {
    if (!this.token) {
      this.navigateToLogin();
      return;
    }

    if (!this.title || !this.content) {
      alert('Both title and content are required!');
      return;
    }

    this.articleService.postArticle(this.token, this.title, this.content).subscribe(
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

  editArticle(): void {
    if (!this.token) {
      this.navigateToLogin();
      return;
    }

    const articleId = prompt('Enter the article ID to edit:');

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
          const newTitle = prompt('Enter the new title (Leave blank to leave as is):');
          const newContent = prompt('Enter the new content (Leave blank to leave as is):');

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

  deleteArticle(): void {
    if (!this.token) {
      this.navigateToLogin();
      return;
    }
    const articleId = prompt('Enter the article ID to delete:');

    if (articleId && !isNaN(Number(articleId))) {
      const id = Number(articleId);

      this.articleService.deleteArticle(id, this.token).subscribe(
        () => {
          alert(`Article ${id} deleted successfully`);
          this.loadArticles();
        },
        (error) => {
          alert(`Error deleting article ${id}: ${error.message}`);
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
