import { BookDialogComponent } from '@app/books/components/book-dialog/book-dialog.component';
import { BookStore } from '@app/books/stores/book-store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { BookCreateComponent } from './book-create.component';

describe('BookCreateComponent', () => {
  let spectator: Spectator<BookCreateComponent>;

  const bookStore = {
    addBook: jest.fn(),
    nagivageToBookList: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: BookCreateComponent,
    declarations: [MockComponent(BookDialogComponent)],
    providers: [{ provide: BookStore, useValue: bookStore }],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Create book dialog', () => {
    let dialogComponent: BookDialogComponent | null;

    beforeEach(() => {
      dialogComponent = spectator.query(BookDialogComponent);
    });

    it('should create the dialog', () => {
      expect(dialogComponent).toBeVisible();
    });

    it('should test input data', () => {
      expect(dialogComponent).toBeTruthy();
      expect(dialogComponent?.bookAction).toEqual('Create');
      expect(dialogComponent?.bookData).toEqual({
        title: null,
        price: null,
        pageCount: null,
        onSale: false,
      });
    });

    it('should test on dialogSubmit', () => {
      const bookData = {
        title: 'Test Book',
        price: 20,
        pageCount: 200,
        onSale: true,
      };
      dialogComponent?.dialogSubmit.emit(bookData);
      expect(bookStore.addBook).toHaveBeenCalledWith(bookData);
    });

    it('should test on dialogClose', () => {
      dialogComponent?.dialogClose.emit();
      expect(bookStore.nagivageToBookList).toHaveBeenCalled();
    });
  });
});
