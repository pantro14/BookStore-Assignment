import { EventEmitter, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from '@app/books/components/book-form/book-form.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { BookCreateComponent } from './book-create.component';

describe('BookCreateComponent', () => {
  let spectator: Spectator<BookCreateComponent>;

  const bookStore = {
    addBook: jest.fn(),
    nagivageToBookList: jest.fn(),
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
    component: BookCreateComponent,
    providers: [
      { provide: BookStore, useValue: bookStore },
      { provide: MatDialog, useValue: dialog },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Create book page', () => {
    it('should test input data', () => {
      const matDialog = spectator.inject(MatDialog);
      const spyOpen = jest.spyOn(matDialog, 'open');
      expect(spyOpen).toHaveBeenCalledWith(BookFormComponent, { width: '450px', disableClose: true });
      const bookformComponent = dialogOpen.componentInstance;
      expect(bookformComponent.bookFormData()).toEqual({
        title: null,
        price: null,
        pageCount: null,
        onSale: false,
      });
    });

    it('should test addBook', () => {
      const bookData = {
        title: 'Test Book',
        price: 20,
        pageCount: 200,
        onSale: true,
      };
      const bookformComponent = dialogOpen.componentInstance;
      bookformComponent.submitForm.emit(bookData);
      expect(bookStore.addBook).toHaveBeenCalledWith(bookData);
    });

    it('should test on dialogClose', () => {
      const bookformComponent = dialogOpen.componentInstance;
      bookformComponent?.closeForm.emit();
      expect(bookStore.nagivageToBookList).toHaveBeenCalled();
    });
  });
});
