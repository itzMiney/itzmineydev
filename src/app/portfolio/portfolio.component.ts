import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {VantaBackgroundService} from '../shared/services/vanta-background.service';
import {DeviceDetectorService} from '../shared/services/device-detector.service';
import {CommonModule, isPlatformBrowser, NgStyle} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {AudioPlayerComponent} from '../shared/audio-player/audio-player.component';
import {TranslatePipe} from '@ngx-translate/core';
import {animate, stagger, style, transition, trigger, query} from '@angular/animations';

@Component({
  selector: 'app-portfolio',
  imports: [
    NgStyle,
    AudioPlayerComponent,
    TranslatePipe,
    CommonModule
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ]),
    trigger('staggerGallery', [
      transition(':enter', [
        query('.gallery-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  galleryItems = [
    { src: '/assets/design1.png', alt: 'Design 1', label: 'Abstract Background' },
    { src: '/assets/design2.png', alt: 'Design 2', label: 'Profile Picture Design' },
    { src: '/assets/design3.png', alt: 'Design 3', label: 'Pixelart Canvas' },
    { src: '/assets/design4.png', alt: 'Design 4', label: 'Profile Picture Design 2' },
    { src: '/assets/design5.png', alt: 'Design 5', label: 'Social Media Banner' },
    { src: '/assets/design6.png', alt: 'Design 6', label: 'Logo Design' },
    { src: '/assets/design7.png', alt: 'Design 7', label: 'Clipart Design' },
    { src: 'https://opengraph.githubassets.com/1/itzMiney/itzmineydev', alt: 'Frontend', label: 'itzMiney.dev Frontend' },
    { src: 'https://opengraph.githubassets.com/1/Hideout-Codeworks/DoritoBot', alt: 'DoritoBot', label: 'DoritoBot' },
  ];
  selectedItem: any = null;
  showModal = false;
  private readonly elementId = 'vanta-portfolio-bg';
  isMobile: boolean = false;
  constructor(
    private vantaService: VantaBackgroundService,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Portfolio | itzMiney');
    this.isMobile = this.deviceService.isMobile;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {
      color: 0x514f80,
      backgroundColor: 0x291c3c
    });
  }
  ngOnDestroy() {
    this.vantaService.destroyVanta(this.elementId);
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  onResize() {
    // Update the minHeight and minWidth when the window is resized
    this.vantaService.resizeVanta(this.elementId);
  }

  openModal(item: any) {
    this.selectedItem = item;
    this.showModal = true;
  }

  closeModal() {
    this.selectedItem = null;
    this.showModal = false;
  }
}
