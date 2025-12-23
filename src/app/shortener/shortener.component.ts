import { Component, OnInit, OnDestroy} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ShortenerService} from '../shared/services/shortener.service';
import {interval, Subscription, switchMap} from 'rxjs';
import {FormsModule} from '@angular/forms';
import { SlicePipe } from '@angular/common';
import {AuthService} from '../shared/services/auth.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-shortener',
  imports: [
    FormsModule,
    SlicePipe
],
  templateUrl: './shortener.component.html',
  styleUrl: './shortener.component.css'
})
export class ShortenerComponent implements OnInit, OnDestroy {
  tokenValidationInterval: Subscription = new Subscription();

  urls: any[] = [];
  noURLs: boolean = false;

  og_url: string = '';
  short_name: string | null = null;
  deleteId: number | null = null;

  constructor(
    private shortenerService: ShortenerService,
    private authService: AuthService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Shortener | itzMiney')
    this.loadURLs();
    this.startTokenValidation();
  }

  ngOnDestroy() {
    this.tokenValidationInterval.unsubscribe();
  }

  startTokenValidation() {
    this.tokenValidationInterval = interval(300000).subscribe(() => {
      this.authService.validateToken().subscribe();
    });
  }

  loadURLs(): void {
    this.authService.validateToken().pipe(
      filter(valid => valid),
      switchMap(() => this.shortenerService.getAllURLs(this.authService.token!))
    ).subscribe({
      next: (data) => {
        this.urls = data;
        this.noURLs = data.length === 0;
      },
      error: (err) => console.error(err)
    });
  }

  createShortURL(form: any) {
    const og_url = form.value.og_url;
    const short_name = form.value.short_name ?? null;

    if (!og_url) {
      alert('Original URL Required!');
      return;
    }

    this.authService.validateToken().subscribe(valid => {
      if (!valid) return;

      const token = this.authService.token!;

      const req$ = short_name
        ? this.shortenerService.postURL(token, og_url, short_name)
        : this.shortenerService.postURL(token, og_url);

      req$.subscribe(
        () => {
          alert('Short URL created successfully!');
          this.loadURLs();
        },
        (error) => {
          alert('Error creating Short URL');
          console.error(error);
        }
      );
    });
  }

  deleteShortURL(form: any) {
    const id = form.value.deleteId;

    if (!id || isNaN(Number(id))) {
      alert('Invalid input. Please enter a valid Short URL ID.');
      return;
    }

    this.authService.validateToken().subscribe(valid => {
      if (!valid) return;

      const token = this.authService.token!;

      this.shortenerService.deleteURL(Number(id), token).subscribe(
        () => {
          alert(`Short URL with ID ${id} deleted successfully`);
          this.loadURLs();
        },
        (error) => {
          alert(`Error deleting Short URL ${id}: ${error.message}`);
          console.error('Error deleting Short URL:', error);
        }
      );
    });
  }
}
