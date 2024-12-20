import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ContactComponent } from './contact/contact.component';
import { BlogComponent } from './blog/blog.component';
import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' }, // Redirect default route to 'about'
  { path: 'about', component: AboutComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'blog', component: BlogComponent },

  { path: '**', pathMatch: 'full', component: NotFoundComponent },
];
