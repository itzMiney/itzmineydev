import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DeviceDetectorService} from '../services/device-detector.service'
import {DatePipe, isPlatformBrowser, NgIf} from '@angular/common';
import {VantaBackgroundService} from '../services/vanta-background.service';
import {ArticleService} from '../services/article.service';
import {ActivatedRoute} from '@angular/router';
import {UpdateMetaService} from '../services/update-meta.service';

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
    private updateMetaService: UpdateMetaService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile;

    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        this.loadArticleMetaBySlug(slug);
      } else {
        this.updateMetaService.updateMetaTags({
          title: 'Article | itzMiney',
          description: 'An article on itzMiney\'s Blog.',
          image: 'https://itzminey.dev/assets/ogimg.png',
          url: 'https://itzminey.dev/blog',
          color: '#ffffff'
        });
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

  loadArticleMetaBySlug(slug: string) {
    this.articleService.getArticleBySlug(slug).subscribe(
      (article) => {
        if (article) {
          this.currentArticle = article;
          this.updateMetaService.updateMetaTags({
            title: article.title,
            description: article.content.slice(0, 150), // First 150 characters
            image: 'https://itzminey.dev/assets/ogimg.png', // Use article image or default
            url: `https://itzminey.dev/blog/${article.slug}`,
            color: '#ffffff'
          });
        } else {
          console.warn('Article not found for slug:', slug);
          this.updateMetaService.updateMetaTags({
            title: 'Article Not Found',
            description: 'The requested article could not be found.',
            image: 'https://itzminey.dev/assets/ogimg.png',
            url: 'https://itzminey.dev',
            color: '#ff0000'
          });
        }
      },
      (error) => {
        console.error('Failed to load article metadata', error);
        this.updateMetaService.updateMetaTags({
          title: 'Error',
          description: 'An error occurred while loading this article.',
          image: 'https://itzminey.dev/assets/ogimg.png',
          url: 'https://itzminey.dev',
          color: '#ff0000'
        });
      }
    );
  }
}
