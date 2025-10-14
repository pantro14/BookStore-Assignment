import { EventEmitter, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from '@app/books/components/book-form/book-form.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { BookEditComponent } from './book-edit.component';

describe('BookEditComponent', () => {
  let spectator: Spectator<BookEditComponent>;

  const bookStore = {
    setSelectedBook: jest.fn(),
    selectedBook: signal<BookFormData | null>(null),
    showBook404Error: jest.fn(),
    nagivageToBookList: jest.fn(),
    updateBook: jest.fn(),
  };

  const dialogOpen = {
    componentInstance: {
      bookFormData: signal<BookFormData | null>(null),
      closeForm: new EventEmitter<void>(),
      submitForm: new EventEmitter<BookFormData>(),
    },
  };

  const dialog = { open: jest.fn().mockImplementation(() => dialogOpen), closeAll: jest.fn() };

  const createComponent = createComponentFactory({
    component: BookEditComponent,
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

  describe('Edit book page', () => {
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
        expect(spyOpen).toHaveBeenCalledWith(BookFormComponent, { width: '450px', disableClose: true });
      });

      it('should not show book 404 error', () => {
        const erroSpy = jest.spyOn(bookStore, 'showBook404Error');
        expect(erroSpy).not.toHaveBeenCalled();
      });

      it('should test book form input data', () => {
        const bookformComponent = dialogOpen.componentInstance;
        expect(bookformComponent.bookFormData()).toEqual(bookData);
      });

      it('should test update book', () => {
        const bookData = {
          title: 'Test Book',
          price: 20,
          pageCount: 200,
          onSale: true,
        };
        const bookformComponent = dialogOpen.componentInstance;
        bookformComponent.submitForm.emit(bookData);
        expect(bookStore.updateBook).toHaveBeenCalledWith({ bookId: '1', bookFormData: bookData });
      });

      it('should test go back', () => {
        const bookformComponent = dialogOpen.componentInstance;
        bookformComponent?.closeForm.emit();
        expect(bookStore.nagivageToBookList).toHaveBeenCalled();
      });
    });
  });
});
