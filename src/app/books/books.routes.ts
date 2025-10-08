import { Routes } from '@angular/router';

export const booksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/book-list/book-list.component').then(m => m.BookListComponent),
    children: [
      {
        path: 'edit/:bookId',
        loadComponent: () => import('./pages/book-edit/book-edit.component').then(m => m.BookEditComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/book-create/book-create.component').then(m => m.BookCreateComponent),
      },
    ],
  },
];
