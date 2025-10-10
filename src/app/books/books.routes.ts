import { Routes } from '@angular/router';

export const booksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/book-list/book-list.component').then(m => m.BookListComponent),
    children: [
      {
        path: 'view/:bookId',
        loadComponent: () => import('./pages/view-book/view-book.component').then(m => m.ViewBookComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/book-create/book-create.component').then(m => m.BookCreateComponent),
      },
      {
        path: 'edit/:bookId',
        loadComponent: () => import('./pages/book-edit/book-edit.component').then(m => m.BookEditComponent),
      },
    ],
  },
];
