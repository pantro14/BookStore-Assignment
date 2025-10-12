import { signal } from '@angular/core';
import { BookDialogComponent } from '@app/books/components/book-dialog/book-dialog.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { ViewBookComponent } from './view-book.component';

describe('ViewBookComponent', () => {
  let spectator: Spectator<ViewBookComponent>;

  const bookStore = {
    setSelectedBook: jest.fn(),
    selectedBook: signal<BookFormData | null>(null),
    showBook404Error: jest.fn(),
    nagivageToBookList: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: ViewBookComponent,
    declarations: [MockComponent(BookDialogComponent)],
    providers: [{ provide: BookStore, useValue: bookStore }],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { bookId: '1' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create book dialog', () => {
    describe('selectedBook is null', () => {
      it('should not show a dialog', () => {
        spectator.detectChanges();
        const dialogComponent = spectator.query(BookDialogComponent);
        expect(bookStore.setSelectedBook).toHaveBeenCalledWith('1');
        expect(dialogComponent).not.toBeVisible();
      });

      it('should show book 404 error', () => {
        spectator.detectChanges();
        const erroSpy = jest.spyOn(bookStore, 'showBook404Error');
        expect(erroSpy).toHaveBeenCalled();
      });
    });

    describe('with selectedBook', () => {
      let dialogComponent: BookDialogComponent | null;
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
        dialogComponent = spectator.query(BookDialogComponent);
      });

      it('should test input data', () => {
        expect(dialogComponent).toBeTruthy();
        expect(dialogComponent?.bookAction).toEqual('View');
        expect(dialogComponent?.bookData).toEqual(bookData);
      });

      it('should not show book 404 error', () => {
        spectator.detectChanges();
        const erroSpy = jest.spyOn(bookStore, 'showBook404Error');
        expect(erroSpy).not.toHaveBeenCalled();
      });

      it('should test on dialogClose', () => {
        dialogComponent?.dialogClose.emit();
        expect(bookStore.nagivageToBookList).toHaveBeenCalled();
      });
    });
  });
});
