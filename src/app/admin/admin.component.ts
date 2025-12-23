import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ArticleService} from '../shared/services/article.service';
import {UserService} from '../shared/services/user.service';
import { NgStyle } from '@angular/common';
import {Observer, Subscription, interval} from 'rxjs';
import {FormsModule, NgForm} from '@angular/forms';
import {DeviceDetectorService} from '../shared/services/device-detector.service';
import {Title} from '@angular/platform-browser';
import {ModalComponent} from '../shared/modal/modal.component';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    FormsModule,
    NgStyle,
    ModalComponent
]
})
export class AdminComponent implements OnInit, OnDestroy {
  tokenValidationInterval: Subscription = new Subscription();

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

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    protected authService: AuthService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Admin Panel | itzMiney')
    this.isMobile = this.deviceService.isMobile;
    this.authService.validateToken().subscribe();
    this.startTokenValidation();
    this.loadArticles();
  }

  ngOnDestroy() {
    this.tokenValidationInterval.unsubscribe();
  }

  startTokenValidation() {
    this.tokenValidationInterval = interval(300000).subscribe(() => {
      this.authService.validateToken().subscribe();
    });
  }

  createArticle(form: any) {
    const title = form.value.title;
    const content = form.value.content;

    if (!title || !content) {
      alert('Both title and content are required!');
      return;
    }

    this.authService.validateToken().subscribe(valid => {
      if (!valid) return;

      const token = this.authService.token!;
      this.articleService.postArticle(token, title, content).subscribe(
        () => {
          alert('Article created successfully!');
          this.loadArticles();
        },
        error => {
          alert('Error creating article');
          console.error(error);
        }
      );
    });
  }

  editArticle(form: NgForm): void {
    const articleId = form.value.editId;

    if (!articleId || isNaN(Number(articleId))) {
      alert('Invalid input. Please enter a valid article ID.');
      return;
    }

    const id = Number(articleId);

    this.authService.validateToken().subscribe(valid => {
      if (!valid) return;

      const token = this.authService.token!;

      this.articleService.getArticleById(id).subscribe(
        (article) => {
          if (!article) {
            alert(`Article with ID ${id} not found.`);
            return;
          }

          const newTitle = form.value.editTitle || form.value.editTitleMobile;
          const newContent = form.value.editContent || form.value.editContentMobile;

          const updatedTitle = newTitle?.trim() || article.title;
          const updatedContent = newContent?.trim() || article.content;

          this.articleService.editArticle(id, token, updatedTitle, updatedContent).subscribe(
            (response) => {
              alert(`Article ${id} updated successfully!`);
              console.log('Updated Article:', response);
              this.loadArticles();
            },
            (error) => {
              alert(`Error updating article ${id}: ${error.message}`);
              console.error('Error:', error);
            }
          );
        },
        (error: { message: any }) => {
          alert(`Failed to fetch article with ID ${id}: ${error.message}`);
          console.error('Error:', error);
        }
      );
    });
  }

  deleteArticle(form: any): void {
    const articleId = form.value.deleteId || form.value.deleteIdMobile;

    if (!articleId || isNaN(Number(articleId))) {
      alert('Invalid input. Please enter a valid article ID.');
      return;
    }

    this.authService.validateToken().subscribe(valid => {
      if (!valid) return;

      const token = this.authService.token!;

      this.articleService.deleteArticle(Number(articleId), token).subscribe(
        () => {
          alert(`Article ${articleId} deleted successfully`);
          this.loadArticles();
        },
        error => {
          alert(`Error deleting article ${articleId}: ${error.message}`);
          console.error(error);
        }
      );
    });
  }

  navigateToArticle(slug: string): void {
    void this.router.navigate([`/blog/${slug}`]);
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
    this.authService.validateToken().subscribe(valid => {
      if (!valid) return;

      const token = this.authService.token!;

      this.userService.getAllUsers(token).subscribe(data => {
        this.users = data;
      });
    });
  }

  toggleView() {
    this.isViewingArticles = !this.isViewingArticles;
    if (!this.isViewingArticles && this.users.length === 0) {
      this.loadUsers();
      this.loadArticles();
    }
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
    const username = form.value.createUsername;
    const password = form.value.createPassword;

    if (!username || !password) {
      alert('Both username and password are required!');
      return;
    }

    this.authService.validateToken().subscribe(valid => {
      if (!valid) return;

      const token = this.authService.token!;

      this.userService.createUser(token, username, password).subscribe(
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
    });
  }

  editUser(form: any): void {
    const userId = form.value.editUserId;

    if (!userId || isNaN(Number(userId))) {
      alert('Invalid input. Please enter a valid user ID.');
      this.closeModal();
      return;
    }

    const id = Number(userId);

    this.authService.validateToken().subscribe(valid => {
      if (!valid) return;

      const token = this.authService.token!;

      this.userService.getUserById(id, token).subscribe(
        (user) => {
          if (!user) {
            alert(`User with ID ${id} not found.`);
            return;
          }

          const newUsername = form.value.editUsername;
          const newPassword = form.value.editPassword;

          const updatedUsername = newUsername?.trim();
          const updatedPassword = newPassword?.trim();

          this.userService.editUser(id, token, updatedUsername, updatedPassword).subscribe(
            (response) => {
              alert(`User ${id} updated successfully!`);
              console.log('Updated User:', response);
              this.loadUsers();
            },
            (error) => {
              alert(`Error updating user ${id}: ${error.message}`);
              console.error('Error:', error);
            }
          );
        },
        (error: { message: any }) => {
          alert(`Failed to fetch user with ID ${id}: ${error.message}`);
          console.error('Error:', error);
        }
      );
    });

    this.closeModal();
  }

  deleteUser(form: any): void {
    const userId = form.value.deleteUserId;

    if (!userId || isNaN(Number(userId))) {
      alert('Invalid input. Please enter a valid user ID.');
      console.error('Invalid input:', userId);
      this.closeModal();
      return;
    }

    this.authService.validateToken().subscribe(valid => {
      if (!valid) return;

      const token = this.authService.token!;

      this.userService.deleteUser(Number(userId), token).subscribe(
        () => {
          alert(`User ${userId} deleted successfully`);
          this.loadUsers();
        },
        (error) => {
          alert(`Error deleting user ${userId}: ${error.message}`);
          console.error('Error deleting user:', error);
        }
      );
    });

    this.closeModal();
  }
}
