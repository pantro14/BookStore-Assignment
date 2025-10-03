import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'books',
    loadComponent: () => import('@app/books/book-list/book-list.component').then(m => m.BookListComponent),
  },
  { path: '**', redirectTo: 'books' },
];
