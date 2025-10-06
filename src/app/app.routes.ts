import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'books',
    loadChildren: () => import('./books/books.routes').then(r => r.booksRoutes),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'books',
  },
  {
    path: '**',
    redirectTo: 'books',
  },
];
