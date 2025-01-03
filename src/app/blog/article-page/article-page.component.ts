import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DeviceDetectorService} from '../../services/device-detector.service'
import {DatePipe, isPlatformBrowser, NgIf} from '@angular/common';
import {VantaBackgroundService} from '../../services/vanta-background.service';
import {ArticleService} from '../../services/article.service';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

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
    DatePipe
  ],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.css'
})
export class ArticlePageComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-article-bg';
  isMobile: boolean = false;
  article: Article | undefined;
  currentArticle: any;
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
          console.log('Article found!')
        },
      (error) => {
        console.error('Error fetching article:', error);
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
