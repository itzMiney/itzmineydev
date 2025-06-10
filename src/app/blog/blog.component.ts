import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DeviceDetectorService} from '../shared/services/device-detector.service'
import {DatePipe, isPlatformBrowser, NgIf, NgFor, AsyncPipe, SlicePipe, NgStyle} from '@angular/common';
import {VantaBackgroundService} from '../shared/services/vanta-background.service';
import { ArticleService } from '../shared/services/article.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-blog',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    AsyncPipe,
    SlicePipe,
    NgStyle,
    TranslatePipe
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit, OnDestroy, AfterViewInit {
  articles$: Observable<any[]> | undefined;
  private readonly elementId = 'vanta-blog-bg';
  isMobile: boolean = false;
  constructor(
    private deviceService: DeviceDetectorService,
    private vantaService: VantaBackgroundService,
    private articleService: ArticleService,
    private router: Router,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Blog | itzMiney')
    this.isMobile = this.deviceService.isMobile;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
    this.articles$ = this.articleService.getAllArticles();
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

  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {
      color: 0xac1f4e,
      backgroundColor: 0x191522
    });
  }
  ngOnDestroy() {
    this.vantaService.destroyVanta(this.elementId);
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  onResize() {
    this.vantaService.resizeVanta(this.elementId);
  }
}
