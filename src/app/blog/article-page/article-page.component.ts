import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {DeviceDetectorService} from '../../shared/services/device-detector.service'
import { DatePipe, isPlatformBrowser, NgStyle } from '@angular/common';
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
    DatePipe,
    NgStyle,
    TranslatePipe
],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.css'
})
export class ArticlePageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('articleContent') articleContent!: ElementRef<HTMLDivElement>;
  selectedImage: string | null = null;
  private imagesProcessed = false;
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
    this.makeImagesClickable();
    this.imagesProcessed = true;
  }

  private makeImagesClickable() {
    const imgs: NodeListOf<HTMLImageElement> = this.articleContent.nativeElement.querySelectorAll('img');
    imgs.forEach(img => {
      img.style.cursor = 'pointer';
      if (!img.dataset['clickable']) {
        img.addEventListener('click', () => this.openPreview(img.src));
        img.dataset['clickable'] = 'true';
      }
    });
  }

  openPreview(src: string) {
    this.selectedImage = src;
  }

  closePreview() {
    this.selectedImage = null;
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
        this.article = article;
        this.loading = false;

        setTimeout(() => this.makeImagesClickable(), 0);

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
}
