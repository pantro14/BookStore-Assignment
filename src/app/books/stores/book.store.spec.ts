import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { TranslateService } from '@ngx-translate/core';
import { BookstoreBffService } from '@openapi';
import { EMPTY, of, throwError } from 'rxjs';

import { translateServiceMock } from '../utils/translate-service.mock';
import { BookStore } from './book-store';

describe('BookStore', () => {
  let store: InstanceType<typeof BookStore>;

  let bookstoreBffService = {
    getBooks: jest.fn(),
    createBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
  };

  const listOfBooks = [
    { id: '1', title: 'Book 1', price: 10, pageCount: 100, onSale: false },
    { id: '2', title: 'Book 2', price: 15, pageCount: 150, onSale: true },
  ];

  const createService = createServiceFactory({
    service: BookStore,
    providers: [
      {
        provide: BookstoreBffService,
        useValue: bookstoreBffService,
      },
      {
        provide: Router,
        useValue: {
          navigate: jest.fn(),
        },
      },
      {
        provide: MatSnackBar,
        useValue: {
          open: jest.fn(),
        },
      },
      { provide: TranslateService, useValue: translateServiceMock },
    ],
  });

  beforeEach(() => {
    store = createService().service;
  });

  it('should have correct initial state', () => {
    expect(store.bookList()).toEqual([]);
    expect(store.selectedBook()).toBeNull();
  });

  describe('book not found: showBook404Error', () => {
    it('should show a snackbar and navigate to book list', () => {
      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const router = spectator.inject(Router);
      const snackBarRef = {
        afterDismissed: () => of({}),
      };
      const openSpy = jest.spyOn(snackbar, 'open').mockReturnValue(snackBarRef as any);
      const navigateSpy = jest.spyOn(router, 'navigate');

      store.showBook404Error();

      expect(openSpy).toHaveBeenCalledWith('books.snackbar.notFound', 'books.snackbar.close', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'snackbar-error',
      });
      expect(navigateSpy).toHaveBeenCalledWith(['/books']);
    });
  });

  describe('loadBooks', () => {
    it('should set a list of books', () => {
      bookstoreBffService.getBooks.mockReturnValue(of(listOfBooks));
      const store = createService().service;

      expect(store.bookList()).toEqual([]);

      store.loadBooks({ onSale: false });

      expect(store.bookList()).toEqual(listOfBooks);
    });
  });

  describe('setSelectedBook', () => {
    it('should select a book by id correctly', () => {
      bookstoreBffService.getBooks.mockReturnValue(of(listOfBooks));
      const store = createService().service;

      store.loadBooks({ onSale: false });
      store.setSelectedBook(listOfBooks[0].id);

      const { id, ...selectedBook } = listOfBooks[0];

      expect(store.selectedBook()).toEqual(selectedBook);
    });

    it('should not select a book', () => {
      bookstoreBffService.getBooks.mockReturnValue(of(listOfBooks));
      const store = createService().service;

      store.loadBooks({ onSale: false });
      store.setSelectedBook('999');

      expect(store.selectedBook()).toBeNull();
    });
  });

  describe('addBook', () => {
    const newBook = { title: 'New Book', price: 20, pageCount: 200, onSale: false };

    it('should add a book and update the state', () => {
      const createdBook = { id: 3, ...newBook };

      bookstoreBffService.createBook.mockReturnValue(of(createdBook));

      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const openSpy = jest.spyOn(snackbar, 'open');

      store.addBook(newBook);

      expect(store.bookList()).toEqual([createdBook]);
      expect(openSpy).toHaveBeenCalledWith('books.snackbar.added', 'books.snackbar.close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'snackbar-success',
      });
    });

    it('should handle error when adding a book fails', () => {
      bookstoreBffService.createBook.mockReturnValue(throwError(() => new Error('Creation failed')));

      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const openSpy = jest.spyOn(snackbar, 'open');

      store.addBook(newBook);

      expect(store.bookList()).toEqual([]);
      expect(openSpy).toHaveBeenCalledWith('books.snackbar.addError', 'books.snackbar.close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'snackbar-error',
      });
    });
  });

  describe('updateBook', () => {
    const existingBook = { id: '1', title: 'Book 1', price: 10, pageCount: 100, onSale: false };
    const updatedBook = { id: '1', title: 'Updated Book 1', price: 12, pageCount: 120, onSale: true };

    beforeEach(() => {
      bookstoreBffService.getBooks.mockReturnValue(of([existingBook]));
      store.loadBooks({ onSale: false });
    });

    it('should update a book and update the state', () => {
      bookstoreBffService.updateBook.mockReturnValue(of(updatedBook));

      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const openSpy = jest.spyOn(snackbar, 'open');

      store.updateBook({ bookId: '1', bookFormData: updatedBook });

      expect(store.bookList()).toEqual([updatedBook]);
      expect(openSpy).toHaveBeenCalledWith('books.snackbar.updated', 'books.snackbar.close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'snackbar-success',
      });
    });

    it('should handle error when updating a book fails', () => {
      bookstoreBffService.updateBook.mockReturnValue(throwError(() => new Error('Update failed')));

      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const openSpy = jest.spyOn(snackbar, 'open');

      store.updateBook({ bookId: '1', bookFormData: updatedBook });

      expect(store.bookList()).toEqual([existingBook]);
      expect(openSpy).toHaveBeenCalledWith('books.snackbar.updateError', 'books.snackbar.close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'snackbar-error',
      });
    });
  });

  describe('deleteBook', () => {
    const existingBook = { id: '1', title: 'Book 1', price: 10, pageCount: 100, onSale: false };

    beforeEach(() => {
      bookstoreBffService.getBooks.mockReturnValue(of([existingBook]));
      store.loadBooks({ onSale: false });
    });

    it('should delete a book and update the state', () => {
      bookstoreBffService.deleteBook.mockReturnValue(of(EMPTY));

      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const openSpy = jest.spyOn(snackbar, 'open');

      store.deleteBook({ bookId: '1', bookTitle: existingBook.title });

      expect(store.bookList()).toEqual([]);
      expect(openSpy).toHaveBeenCalledWith('books.snackbar.deleted', 'books.snackbar.close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'snackbar-success',
      });
    });

    it('should handle error when deleting a book fails', () => {
      bookstoreBffService.deleteBook.mockReturnValue(throwError(() => new Error('Delete failed')));

      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const openSpy = jest.spyOn(snackbar, 'open');

      store.deleteBook({ bookId: '1', bookTitle: existingBook.title });

      expect(store.bookList()).toEqual([existingBook]);
      expect(openSpy).toHaveBeenCalledWith('books.snackbar.deleteError', 'books.snackbar.close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'snackbar-error',
      });
    });
  });

  it('should navigate to book list', () => {
    const spectator = createService();
    const store = spectator.service;
    const router = spectator.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    store.nagivageToBookList();

    expect(navigateSpy).toHaveBeenCalledWith(['/books']);
  });

  describe('should load on sale books', () => {
    it('should load only on sale books when onSale is true', () => {
      const onSaleBooks = [{ id: '2', title: 'Book 2', price: 15, pageCount: 150, onSale: true }];
      bookstoreBffService.getBooks.mockReturnValue(of(onSaleBooks));
      const store = createService().service;

      store.loadBooks({ onSale: true });

      expect(store.bookList()).toEqual(onSaleBooks);
    });
  });
});
