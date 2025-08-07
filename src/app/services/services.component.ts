import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {VantaBackgroundService} from '../shared/services/vanta-background.service';
import {DeviceDetectorService} from '../shared/services/device-detector.service';
import {Title} from '@angular/platform-browser';
import {isPlatformBrowser, NgIf, NgFor, NgStyle} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-services',
  imports: [
    NgStyle,
    NgIf,
    NgFor,
    TranslatePipe
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})

export class ServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-services-bg';
  private apiUrl = '/api/stripe/create-checkout-session';
  isMobile: boolean = false;
  activeTab: string[] = [];

  services: {
    name: string;
    basic: string;
    advanced: string;
    basicPriceId: string;
    advancedPriceId: string;
  }[] = [];

  constructor(
    private vantaService: VantaBackgroundService,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    private translate: TranslateService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  switchTab(serviceIndex: number, tab: string): void {
    this.activeTab[serviceIndex] = tab;
  }

  ngOnInit() {
    this.titleService.setTitle('Services | itzMiney');
    this.isMobile = this.deviceService.isMobile;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
    this.loadServices();
    this.translate.onLangChange.subscribe(() => this.loadServices());
  }

  loadServices(): void {
    this.translate.get([
      'SERVICES.PTERO_NAME',
      'SERVICES.PTERO_BASIC',
      'SERVICES.PTERO_ADVANCED',
      'SERVICES.SYSADMIN_NAME',
      'SERVICES.SYSADMIN_BASIC',
      'SERVICES.SYSADMIN_ADVANCED',
      'SERVICES.SUPPORT_NAME',
      'SERVICES.SUPPORT_BASIC',
      'SERVICES.SUPPORT_ADVANCED',
      'SERVICES.WP_FILES_NAME',
      'SERVICES.WP_FILES_BASIC',
      'SERVICES.WP_FILES_ADVANCED',
      'SERVICES.WP_SETUP_NAME',
      'SERVICES.WP_SETUP_BASIC',
      'SERVICES.WP_SETUP_ADVANCED',
      'SERVICES.ANGULAR_FILES_NAME',
      'SERVICES.ANGULAR_FILES_BASIC',
      'SERVICES.ANGULAR_FILES_ADVANCED',
      'SERVICES.ANGULAR_SETUP_NAME',
      'SERVICES.ANGULAR_SETUP_BASIC',
      'SERVICES.ANGULAR_SETUP_ADVANCED',
      'SERVICES.SERVER_SETUP_NAME',
      'SERVICES.SERVER_SETUP_BASIC',
      'SERVICES.SERVER_SETUP_ADVANCED'
    ]).subscribe(translations => {
      this.services = [
        {
          name: translations['SERVICES.PTERO_NAME'],
          basic: translations['SERVICES.PTERO_BASIC'],
          advanced: translations['SERVICES.PTERO_ADVANCED'],
          basicPriceId: 'price_1RtaOO2LT0gYeSqc4ns1BgPW',
          advancedPriceId: 'price_1RtaQF2LT0gYeSqcxxzlazIV'
        },
        {
          name: translations['SERVICES.SYSADMIN_NAME'],
          basic: translations['SERVICES.SYSADMIN_BASIC'],
          advanced: translations['SERVICES.SYSADMIN_ADVANCED'],
          basicPriceId: 'price_1Rtapt2LT0gYeSqcvZLmcj7S',
          advancedPriceId: 'price_1Rtapt2LT0gYeSqcvZLmcj7S'
        },
        {
          name: translations['SERVICES.SUPPORT_NAME'],
          basic: translations['SERVICES.SUPPORT_BASIC'],
          advanced: translations['SERVICES.SUPPORT_ADVANCED'],
          basicPriceId: '',
          advancedPriceId: ''
        },
        {
          name: translations['SERVICES.WP_FILES_NAME'],
          basic: translations['SERVICES.WP_FILES_BASIC'],
          advanced: translations['SERVICES.WP_FILES_ADVANCED'],
          basicPriceId: 'price_1RtaMn2LT0gYeSqcibmWe3c6',
          advancedPriceId: 'price_1RhuVf2LT0gYeSqcAbTNIM4F'
        },
        {
          name: translations['SERVICES.WP_SETUP_NAME'],
          basic: translations['SERVICES.WP_SETUP_BASIC'],
          advanced: translations['SERVICES.WP_SETUP_ADVANCED'],
          basicPriceId: 'price_1RtbTA2LT0gYeSqcH6u8krsj',
          advancedPriceId: 'price_1RtbTA2LT0gYeSqcpHffXghH'
        },
        {
          name: translations['SERVICES.ANGULAR_FILES_NAME'],
          basic: translations['SERVICES.ANGULAR_FILES_BASIC'],
          advanced: translations['SERVICES.ANGULAR_FILES_ADVANCED'],
          basicPriceId: 'price_1RtbAi2LT0gYeSqcutD8Zc9W',
          advancedPriceId: 'price_1RtbAi2LT0gYeSqcuLJXNSjZ'
        },
        {
          name: translations['SERVICES.ANGULAR_SETUP_NAME'],
          basic: translations['SERVICES.ANGULAR_SETUP_BASIC'],
          advanced: translations['SERVICES.ANGULAR_SETUP_ADVANCED'],
          basicPriceId: 'price_1RtbR32LT0gYeSqcWxYCVjoO',
          advancedPriceId: 'price_1RtbR32LT0gYeSqcIAWEqy5I'
        },
        {
          name: translations['SERVICES.SERVER_SETUP_NAME'],
          basic: translations['SERVICES.SERVER_SETUP_BASIC'],
          advanced: translations['SERVICES.SERVER_SETUP_ADVANCED'],
          basicPriceId: '',
          advancedPriceId: ''
        }
      ];

      this.activeTab = this.services.map(() => 'basic');
    });
  }

  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {
      color: 0x7272bd,
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

  checkout(priceId: string): void {
    this.http.post<any>(this.apiUrl, { priceId }).subscribe({
      next: (response) => {
        if (response.url) {
          window.location.href = response.url;
        } else {
          alert('Checkout session failed.');
        }
      },
      error: () => alert('Checkout session failed.')
    });
  }

  getActivePriceId(service: any, activeTab: string): string | null {
    const priceId = activeTab === 'basic' ? service.basicPriceId : service.advancedPriceId;
    return priceId?.trim() || null;
  }
}
