import { EventEmitter, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '@app/books/components/book-details/book-details.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { BookViewComponent } from './book-view.component';

describe('BookViewComponent', () => {
  let spectator: Spectator<BookViewComponent>;

  const bookStore = {
    setSelectedBook: jest.fn(),
    selectedBook: signal<BookFormData | null>(null),
    showBook404Error: jest.fn(),
    nagivageToBookList: jest.fn(),
  };

  const dialogOpen = {
    componentInstance: {
      bookDetails: signal<BookFormData | null>(null),
      closeDetails: new EventEmitter<void>(),
    },
  };

  const dialog = { open: jest.fn().mockImplementation(() => dialogOpen), closeAll: jest.fn() };

  const createComponent = createComponentFactory({
    component: BookViewComponent,
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

  describe('Book view page', () => {
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

      it('should test dialog open input data', () => {
        const matDialog = spectator.inject(MatDialog);
        const spyOpen = jest.spyOn(matDialog, 'open');
        expect(spyOpen).toHaveBeenCalledWith(BookDetailsComponent, { width: '450px', disableClose: true });
      });

      it('should not show book 404 error', () => {
        spectator.detectChanges();
        const erroSpy = jest.spyOn(bookStore, 'showBook404Error');
        expect(erroSpy).not.toHaveBeenCalled();
      });

      it('should test book details input data', () => {
        const bookDetailsComponent = dialogOpen.componentInstance;
        expect(bookDetailsComponent.bookDetails()).toEqual(bookData);
      });

      it('should test on dialogClose', () => {
        const bookDetailsComponent = dialogOpen.componentInstance;
        bookDetailsComponent?.closeDetails.emit();
        expect(bookStore.nagivageToBookList).toHaveBeenCalled();
      });
    });
  });
});
