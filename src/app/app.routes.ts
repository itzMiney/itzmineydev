import {Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {BlogComponent} from './blog/blog.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {ArticlePageComponent} from './blog/article-page/article-page.component';
import {SocialsComponent} from './socials/socials.component';
import {ServicesComponent} from './services/services.component';
import {TosComponent} from './tos/tos.component';
import {ImprintComponent} from './imprint/imprint.component';
import {ShortenerComponent} from './shortener/shortener.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {SuccessComponent} from './checkout/success/success.component';
import {CancelComponent} from './checkout/cancel/cancel.component';

export const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'about', redirectTo: '/', pathMatch: 'full' },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'socials', component: SocialsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'tos', component: TosComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'blog/:slug', component: ArticlePageComponent },
  { path: 'shortener', component: ShortenerComponent },
  { path: 'checkout/success', pathMatch: 'full', component: SuccessComponent },
  { path: 'checkout/cancel', pathMatch: 'full', component: CancelComponent },
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];
