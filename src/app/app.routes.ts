import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { BlogComponent } from './blog/blog.component';
import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/about',
    pathMatch: 'full',
    data: {
      meta: {
        title: 'itzMiney\'s Home',
        description: 'Welcome to itzMiney\'s Homepage! \bHere you can find my portfolio and other cool stuff.',
        image: 'https://itzminey.dev/assets/ogimg.png',
        url: 'https://itzminey.dev/about'
      }
    }
  }, // Redirect default route to 'about'
  {
    path: 'about',
    component: AboutComponent,
    data: {
      meta: {
        title: 'itzMiney\'s Home',
        description: 'Welcome to itzMiney\'s Homepage! \bHere you can find my portfolio and other cool stuff.',
        image: 'https://itzminey.dev/assets/ogimg.png',
        url: 'https://itzminey.dev/about'
      }
    }
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    data: {
      meta: {
        title: 'Portfolio | itzMiney',
        description: 'This is my portfolio where you can find examples of my designs and other projects!',
        image: 'https://itzminey.dev/assets/ogimg.png',
        url: 'https://itzminey.dev/portfolio'
      }
    }
  },
  {
    path: 'blog',
    component: BlogComponent,
    data: {
      meta: {
        title: 'Blog | itzMiney',
        description: 'Welcome to my blog! \bI\'ll post occasional updates here on the stuff I\'m currently up to.',
        image: 'https://itzminey.dev/assets/ogimg.png',
        url: 'https://itzminey.dev/blog'
      }
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
    data: {
      meta: {
        title: '404 | Page Not Found',
        description: 'How the hell did you end up here?',
        image: 'https://itzminey.dev/assets/ogimg.png',
        url: 'https://itzminey.dev/404'
      }
    }
  }
];
