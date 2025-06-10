import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DeviceDetectorService} from '../../shared/services/device-detector.service'
import {DatePipe, isPlatformBrowser, NgIf, NgStyle} from '@angular/common';
import {VantaBackgroundService} from '../../shared/services/vanta-background.service';
import {ArticleService} from '../../shared/services/article.service';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TranslatePipe} from '@ngx-translate/core';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  authorId: number;
  authorName: string;
}

@Component({
  selector: 'app-article-page',
  imports: [
    NgIf,
    DatePipe,
    NgStyle,
    TranslatePipe
  ],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.css'
})
export class ArticlePageComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-article-bg';
  isMobile: boolean = false;
  article: Article | undefined;
  currentArticle: any;
  error: boolean = false;
  copied: boolean = false;

  loading: boolean = true;
  constructor(
    private deviceService: DeviceDetectorService,
    private vantaService: VantaBackgroundService,
    private articleService: ArticleService,
    private titleService: Title,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile;

    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        this.loadTitleBySlug(slug);
      } else {
        this.titleService.setTitle('Article | itzMiney');
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.articleService.getArticleBySlug(slug).subscribe(
      (article) => {
          this.article = article;
          this.loading = false;
          console.log('Article found!')
        },
      (error) => {
        console.error('Error fetching article:', error);
        this.loading = false;
        if (error.status === 404) {
          this.error = true;
        }
      }
    );
  }

  copyLink() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    const shareLink: string = 'https://itzminey.dev/blog/' + slug;
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 3000);

    navigator.clipboard.writeText(shareLink).then()
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

  loadTitleBySlug(slug: string) {
    this.articleService.getArticleBySlug(slug).subscribe(
      (article) => {
        if (article) {
          this.currentArticle = article;
          this.titleService.setTitle( article.title );
        } else {
          console.warn('Article not found for slug:', slug);
          this.titleService.setTitle('Article Not Found');
        }
      },
      (error) => {
        console.error('Failed to load article title', error);
        this.titleService.setTitle('Error loading Article');
      }
    );
  }
}
