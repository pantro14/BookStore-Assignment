import { EventEmitter, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookDeleteConfirmComponent } from '@app/books/components/book-delete-confirm/book-delete-confirm.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { BookDeleteComponent } from './book-delete.component';

describe('BookDeleteComponent', () => {
  let spectator: Spectator<BookDeleteComponent>;

  const bookStore = {
    setSelectedBook: jest.fn(),
    selectedBook: signal<BookFormData | null>(null),
    showBook404Error: jest.fn(),
    nagivageToBookList: jest.fn(),
    deleteBook: jest.fn(),
  };

  const dialogOpen = {
    componentInstance: {
      bookDetails: signal<BookFormData | null>(null),
      closeDelete: new EventEmitter<void>(),
      submitDelete: new EventEmitter<BookFormData>(),
    },
  };

  const dialog = { open: jest.fn().mockImplementation(() => dialogOpen), closeAll: jest.fn() };

  const createComponent = createComponentFactory({
    component: BookDeleteComponent,
    providers: [
      { provide: BookStore, useValue: bookStore },
      { provide: MatDialog, useValue: dialog },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { bookId: '1' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Delete book page', () => {
    describe('selectedBook is null', () => {
      it('should not show a dialog', () => {
        const matDialog = spectator.inject(MatDialog);
        expect(bookStore.setSelectedBook).toHaveBeenCalledWith('1');
        const spyOpen = jest.spyOn(matDialog, 'open');
        expect(spyOpen).not.toHaveBeenCalled();
      });

      it('should show book 404 error', () => {
        const erroSpy = jest.spyOn(bookStore, 'showBook404Error');
        expect(erroSpy).toHaveBeenCalled();
      });
    });

    describe('with selectedBook', () => {
      const bookData = {
        title: 'Test Book',
        price: 250,
        pageCount: 600,
        onSale: true,
      } as BookFormData;

      beforeEach(() => {
        jest.spyOn(bookStore, 'selectedBook').mockImplementation(signal(bookData));
        spectator = createComponent({
          props: { bookId: '1' },
        });
      });

      it('should test input data', () => {
        const matDialog = spectator.inject(MatDialog);
        const spyOpen = jest.spyOn(matDialog, 'open');
        expect(spyOpen).toHaveBeenCalledWith(BookDeleteConfirmComponent, { width: '450px', disableClose: true });
      });

      it('should not show book 404 error', () => {
        const erroSpy = jest.spyOn(bookStore, 'showBook404Error');
        expect(erroSpy).not.toHaveBeenCalled();
      });

      it('should test book form input data', () => {
        const bookformComponent = dialogOpen.componentInstance;
        expect(bookformComponent.bookDetails()).toEqual(bookData);
      });

      it('should test delete a book', () => {
        const bookData = {
          title: 'Test Book',
          price: 20,
          pageCount: 200,
          onSale: true,
        };
        const bookformComponent = dialogOpen.componentInstance;
        bookformComponent.submitDelete.emit(bookData);
        expect(bookStore.deleteBook).toHaveBeenCalledWith({ bookId: '1', bookTitle: bookData.title });
      });

      it('should test go back', () => {
        const bookformComponent = dialogOpen.componentInstance;
        bookformComponent?.closeDelete.emit();
        expect(bookStore.nagivageToBookList).toHaveBeenCalled();
      });
    });
  });
});
