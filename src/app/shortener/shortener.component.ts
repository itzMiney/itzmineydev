import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {UserService} from '../shared/services/user.service';
import {ShortenerService} from '../shared/services/shortener.service';
import {Observer} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {NgFor, NgIf, SlicePipe} from '@angular/common';

@Component({
  selector: 'app-shortener',
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    SlicePipe
  ],
  templateUrl: './shortener.component.html',
  styleUrl: './shortener.component.css'
})
export class ShortenerComponent implements OnInit {
  urls: any[] = [];
  noURLs: boolean = false;

  token: string | null = localStorage.getItem('token');

  og_url: string = '';
  short_name: string | null = null;
  deleteId: number | null = null;

  constructor(
    private shortenerService: ShortenerService,
    private userService: UserService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Shortener | itzMiney')
    this.checkToken()
    this.loadURLs();
  }

  checkToken() {
    if (!this.token || !this.isValidToken(this.token)) {
      localStorage.removeItem('token');
      this.navigateToLogin();
      return;
    }
  }

  isValidToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;

      return expiry > Date.now();
    } catch (e) {
      console.error('Invalid token format:', e);
      return false;
    }
  }

  navigateToLogin() {
    const currentRoute = this.router.url;
    this.router.navigate(['/login'], { queryParams: { redirectUrl: currentRoute } }).then(
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

  loadURLs(): void {
    this.checkToken()
    const urlObserver: Observer<any> = {
      next: (data) => {
        this.urls = data;
        this.noURLs = this.urls.length === 0;
      },
      error: (error) => {
        console.error('Failed to load Short URLs', error);
      },
      complete: () => {
        console.log('Short URL loading complete');
      }
    };
    if (!this.token) return;
    this.shortenerService.getAllURLs(this.token).subscribe(urlObserver);
  }

  createShortURL(form: any) {
    if (!this.token || !this.isValidToken(this.token)) {
      localStorage.removeItem('token');
      this.navigateToLogin();
      return;
    }

    const og_url = form.value.og_url;
    const short_name = form.value.short_name ?? null;

    if (!og_url) {
      alert('Original URL Required!');
      return;
    }
    if (!short_name) {
      this.shortenerService.postURL(this.token, og_url).subscribe(
        (response) => {
          alert('Short URL created successfully!');
          this.loadURLs();
          console.log(response);
        },
        (error) => {
          alert('Error creating Short URL');
          console.error(error);
        }
      );
    } else if (short_name) {
      this.shortenerService.postURL(this.token, og_url, short_name).subscribe(
        (response) => {
          alert('Short URL created successfully!');
          this.loadURLs();
          console.log(response);
        },
        (error) => {
          alert('Error creating Short URL');
          console.error(error);
        }
      );
    }
  }

  deleteShortURL(form: any) {
    if (!this.token || !this.isValidToken(this.token)) {
      localStorage.removeItem('token');
      this.navigateToLogin();
      return;
    }

    const id = form.value.deleteId

    if (id && !isNaN(Number(id))) {
      this.shortenerService.deleteURL(id, this.token).subscribe(
        () => {
          alert(`Short URL with ID ${id} deleted successfully`);
          this.loadURLs();
        },
        (error) => {
          alert(`Error deleting Short URL ${id}: ${error.message}`);
          console.error('Error deleting Short URL:', error)
        }
      );
    } else {
      alert('Invalid input. Please enter a valid Short URL ID.');
    }
  }
}
