import { Routes } from '@angular/router';

export const booksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/books-page/books-page.component').then(m => m.BooksPageComponent),
    children: [
      {
        path: 'edit/:bookId',
        loadComponent: () => import('./components/book-edit/book-edit.component').then(m => m.BookEditComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./components/book-create/book-create.component').then(m => m.BookCreateComponent),
      },
    ],
  },
];
