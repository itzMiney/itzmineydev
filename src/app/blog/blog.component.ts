import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DeviceDetectorService} from '../services/device-detector.service'
import {DatePipe, isPlatformBrowser, NgIf, NgFor, AsyncPipe, SlicePipe, NgStyle} from '@angular/common';
import {VantaBackgroundService} from '../services/vanta-background.service';
import { ArticleService } from '../services/article.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-blog',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    AsyncPipe,
    SlicePipe,
    NgStyle
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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
    this.articles$ = this.articleService.getAllArticles();
  }

  navigateToArticle(slug: string): void {
    this.router.navigate([`/blog/${slug}`]);
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
