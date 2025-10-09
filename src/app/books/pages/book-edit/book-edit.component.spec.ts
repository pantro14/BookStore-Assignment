import { signal } from '@angular/core';
import { BookDialogComponent } from '@app/books/components/book-dialog/book-dialog.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { BookEditComponent } from './book-edit.component';

describe('BookEditComponent', () => {
  let spectator: Spectator<BookEditComponent>;

  const bookStore = {
    setSelectedBookId: jest.fn(),
    selectedBook: signal<BookFormData | null>(null),
    nagivageToBookList: jest.fn(),
    updateBook: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: BookEditComponent,
    declarations: [MockComponent(BookDialogComponent)],
    providers: [{ provide: BookStore, useValue: bookStore }],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { bookId: '1' },
    });
  });

  describe('Create book dialog', () => {
    describe('selectedBook is null', () => {
      it('should not show a dialog', () => {
        spectator.detectChanges();
        const dialogComponent = spectator.query(BookDialogComponent);
        expect(bookStore.setSelectedBookId).toHaveBeenCalledWith('1');
        expect(dialogComponent).not.toBeVisible();
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
        expect(dialogComponent?.bookData).toEqual(bookData);
      });

      it('should test on dialogSubmit', () => {
        const bookData = {
          title: 'Test Book',
          price: 20,
          pageCount: 200,
          onSale: true,
        };
        dialogComponent?.dialogSubmit.emit(bookData);
        expect(bookStore.updateBook).toHaveBeenCalledWith({ bookId: '1', bookFormData: bookData });
      });

      it('should test on dialogClose', () => {
        dialogComponent?.dialogClose.emit();
        expect(bookStore.nagivageToBookList).toHaveBeenCalled();
      });
    });
  });
});
