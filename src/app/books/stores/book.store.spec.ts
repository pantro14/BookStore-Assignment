import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { BookstoreBffService } from '@openapi';
import { of, throwError } from 'rxjs';

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
    ],
  });

  beforeEach(() => {
    store = createService().service;
  });

  it('should have correct initial state', () => {
    expect(store.bookList()).toEqual([]);
    expect(store.selectedBook()).toBeNull();
  });

  describe('loadBooks', () => {
    it('should set a selected book by id', () => {
      bookstoreBffService.getBooks.mockReturnValue(of(listOfBooks));
      const store = createService().service;

      expect(store.selectedBook()).toBeNull();

      store.loadBooks({ onSale: false });

      expect(store.selectedBook()).toEqual(listOfBooks[0]);
    });
  });

  it('should set selectedBookId correctly', () => {
    bookstoreBffService.getBooks.mockReturnValue(of(listOfBooks));
    const store = createService().service;

    store.loadBooks({ onSale: false });
    store.setSelectedBook('1');
    expect(store.selectedBook()).toBe('1');
  });

  describe('addBook', () => {
    const newBook = { title: 'New Book', price: 20, pageCount: 200, onSale: false };

    it('should add a book and update the state', () => {
      const createdBook = { id: 3, ...newBook };

      bookstoreBffService.createBook.mockReturnValue(of(createdBook));

      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const navigateSpy = jest.spyOn(snackbar, 'open');

      store.addBook(newBook);

      expect(store.bookList()).toEqual([createdBook]);
      expect(navigateSpy).toHaveBeenCalledWith('Book "New Book" added successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
      });
    });

    it('should handle error when adding a book fails', () => {
      bookstoreBffService.createBook.mockReturnValue(throwError(() => new Error('Creation failed')));

      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const navigateSpy = jest.spyOn(snackbar, 'open');

      store.addBook(newBook);

      expect(store.bookList()).toEqual([]);
      expect(navigateSpy).toHaveBeenCalledWith('Book could not be created', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
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
      const navigateSpy = jest.spyOn(snackbar, 'open');

      store.loadBooks({ onSale: false });
      store.updateBook({ bookId: '1', bookFormData: updatedBook });

      expect(store.bookList()).toEqual([updatedBook]);
      expect(navigateSpy).toHaveBeenCalledWith('Book "Updated Book 1" edited successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
      });
    });

    it('should handle error when updating a book fails', () => {
      bookstoreBffService.updateBook.mockReturnValue(throwError(() => new Error('Update failed')));

      const spectator = createService();
      const store = spectator.service;

      const snackbar = spectator.inject(MatSnackBar);
      const navigateSpy = jest.spyOn(snackbar, 'open');

      store.loadBooks({ onSale: false });
      store.updateBook({ bookId: '1', bookFormData: updatedBook });

      expect(store.bookList()).toEqual([existingBook]);
      expect(navigateSpy).toHaveBeenCalledWith('Book could not be edited', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
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

  describe('selectedBook', () => {
    it('should return the selected book based on selectedBookId', () => {
      bookstoreBffService.getBooks.mockReturnValue(of(listOfBooks));
      const spectator = createService();
      const store = spectator.service;

      store.loadBooks({ onSale: false });
      store.setSelectedBook('2');
      const { id, ...bookData } = listOfBooks[1];

      expect(store.selectedBook()).toEqual(bookData);
    });

    it('should return null if selectedBookId does not match any book', () => {
      bookstoreBffService.getBooks.mockReturnValue(of(listOfBooks));
      const spectator = createService();
      const store = spectator.service;

      store.loadBooks({ onSale: false });
      store.setSelectedBook('999');

      expect(store.selectedBook()).toBeNull();
    });

    it('should fallback price and pageCount to 0 if they are null or undefined', () => {
      const booksWithNullValues = { id: '1', title: 'Book 1', price: null, pageCount: undefined, onSale: false };
      bookstoreBffService.getBooks.mockReturnValue(of([booksWithNullValues]));
      const spectator = createService();
      const store = spectator.service;

      store.loadBooks({ onSale: false });
      store.setSelectedBook('1');

      expect(store.selectedBook()).toEqual({
        title: 'Book 1',
        price: 0,
        pageCount: 0,
        onSale: false,
      });
    });
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
