import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ArticleService} from '../shared/services/article.service';
import {UserService} from '../shared/services/user.service';
import {NgFor, NgIf, NgStyle} from '@angular/common';
import { Observer} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {DeviceDetectorService} from '../shared/services/device-detector.service';
import {Title} from '@angular/platform-browser';
import {ModalComponent} from '../shared/modal/modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    NgStyle,
    ModalComponent
  ]
})
export class AdminComponent implements OnInit {
  articles: any[] = [];
  users: any[] = [];
  noArticles: boolean = false;

  isMobile: boolean = false;

  title: string = '';
  content: string = '';

  modalTitle: string = '';
  modalAction: string = '';
  isModalOpen: boolean = false;
  isViewingArticles: boolean = true;

  userData = {
    username: '',
    password: '',
    id: '',
  };

  token: string | null = localStorage.getItem('token');

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
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
    this.loadArticles();
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
        console.log(response);
      },
      (error) => {
        alert('Error creating article');
        console.error(error);
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
              console.error('Error:', error)
            }
          );
        },
        (error: { message: any; }) => {
          alert(`Failed to fetch article with ID ${id}: ${error.message}`);
          console.error('Error:', error)
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
          console.error('Error deleting article:', error)
        }
      );
    } else {
      alert('Invalid input. Please enter a valid article ID.');
    }
  }

  navigateToArticle(slug: string): void {
    this.router.navigate([`/blog/${slug}`]).then(
      (success) => {
        if (success) {
          console.log('Navigation to article succeeded');
        } else {
          console.warn('Navigation to article failed');
        }
      },
      (error) => {
        console.error('Navigation error:', error);
      }
    );
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

  loadUsers() {
    this.userService.getAllUsers(this.token).subscribe((data: any[]) => {
      this.users = data;
    });
  }

  toggleView() {
    this.isViewingArticles = !this.isViewingArticles;
    if (!this.isViewingArticles && this.users.length === 0) {
      this.loadUsers();
      this.loadArticles();
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.navigateToLogin();
  }

  openModal(action: string) {
    this.isModalOpen = true;
    this.modalAction = action;

    switch (action) {
      case 'create':
        this.modalTitle = 'Create User';
        break;
      case 'edit':
        this.modalTitle = 'Edit User';
        break;
      case 'delete':
        this.modalTitle = 'Delete User';
        break;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.userData = {
      username: '',
      password: '',
      id: '',
    };
  }

  createUser(form: any): void {
    if (!this.token) {
      this.navigateToLogin();
      return;
    }

    const username = form.value.createUsername;
    const password = form.value.createPassword;

    if (!username || !password) {
      alert('Both username and password are required!');
      return;
    }

    this.userService.createUser(this.token, username, password).subscribe(
      (response) => {
        alert('User created successfully!');
        this.loadUsers();
        console.log(response);
      },
      (error) => {
        alert('Error creating user');
        console.error(error);
      });
    this.closeModal();
  }

  editUser(form: any): void {
    if (!this.token) {
      this.navigateToLogin();
      return;
    }
    const userId = form.value.editUserId;

    if (userId && !isNaN(Number(userId))) {
      const id = Number(userId);

      this.userService.getUserById(id, this.token).subscribe(
        (user) => {
          if (!user) {
            alert(`User with ID ${id} not found.`);
            return;
          }

          const newUsername = form.value.editUsername;
          const newPassword = form.value.editPassword;

          // Use current values if left blank
          const updatedUsername = newUsername?.trim();
          const updatedPassword = newPassword?.trim();

          this.userService.editUser(id, this.token, updatedUsername, updatedPassword).subscribe(
            (response) => {
              alert(`User ${id} updated successfully!`);
              console.log('Updated User:', response);
              this.loadUsers();
            },
            (error) => {
              alert(`Error updating user ${id}: ${error.message}`);
              console.error('Error:', error)
            }
          );
        },
        (error: { message: any; }) => {
          alert(`Failed to fetch user with ID ${id}: ${error.message}`);
          console.error('Error:', error)
        }
      );
    } else {
      alert('Invalid input. Please enter a valid article ID.');
    }
    this.closeModal();
  }

  deleteUser(form: any): void {
    if (!this.token) {
      this.navigateToLogin();
      return;
    }

    const userId = form.value.deleteUserId;

    if (userId && !isNaN(Number(userId))) {
      this.userService.deleteUser(userId, this.token).subscribe(
        () => {
          alert(`User ${userId} deleted successfully`);
          this.loadUsers();
        },
        (error) => {
          alert(`Error deleting user ${userId}: ${error.message}`);
          console.error('Error deleting user:', error)
        }
      );
    } else {
      alert('Invalid input. Please enter a valid user ID.');
      console.error('Invalid input:', userId);
    }
    this.closeModal();
  }
}
