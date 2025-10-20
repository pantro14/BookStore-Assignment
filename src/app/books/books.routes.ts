import { Routes } from '@angular/router';

export const booksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/book-list/book-list.component').then(m => m.BookListComponent),
    children: [
      {
        path: 'new',
        loadComponent: () => import('./pages/book-create/book-create.component').then(m => m.BookCreateComponent),
      },
      {
        path: 'view/:bookId',
        loadComponent: () => import('./pages/book-view/book-view.component').then(m => m.BookViewComponent),
      },
      {
        path: 'edit/:bookId',
        loadComponent: () => import('./pages/book-edit/book-edit.component').then(m => m.BookEditComponent),
      },
      {
        path: 'delete/:bookId',
        loadComponent: () => import('./pages/book-delete/book-delete.component').then(m => m.BookDeleteComponent),
      },
    ],
  },
];
