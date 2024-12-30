import {Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {BlogComponent} from './blog/blog.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {ArticlePageComponent} from './article-page/article-page.component';

export const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'about', redirectTo: '/', pathMatch: 'full' },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'blog/:slug', component: ArticlePageComponent },
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];
