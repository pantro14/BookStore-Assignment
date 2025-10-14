import { registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookStore } from '@app/books/stores/book-store';
import { translateServiceMock } from '@app/books/utils/translate-service.mock';
import { byTestId, createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslateService } from '@ngx-translate/core';
import { BookDTO } from '@openapi';

import { BookListComponent } from './book-list.component';

registerLocaleData(localeDa, 'da-DK');

describe('BookListComponent', () => {
  let spectator: Spectator<BookListComponent>;

  const bookStore = {
    loading: signal(false),
    loadBooks: jest.fn(),
    bookList: signal<BookDTO[]>([
      { id: '1', title: 'Book 1', onSale: true, pageCount: 412, price: 79 },
      { id: '2', title: 'Book 2', onSale: true, pageCount: 412, price: 79 },
      { id: '3', title: 'Book 3', onSale: true, pageCount: 412, price: 79 },
    ]),
  };

  const createComponent = createComponentFactory({
    component: BookListComponent,
    providers: [
      { provide: BookStore, useValue: bookStore },
      { provide: Router, useValue: { navigate: jest.fn() } },
      { provide: TranslateService, useValue: translateServiceMock },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should check elements of the page', () => {
    expect(spectator.query(byTestId('card-title'))).toHaveText('books.list.title');
    expect(spectator.query(byTestId('new-book-button'))).toHaveText('books.list.newBook');
    expect(spectator.query(byTestId('on-sale-book-toggle'))).toHaveText('books.global.onSale');
    expect(spectator.query(byTestId('books-table'))).toBeVisible();
    expect(spectator.query(byTestId('paginator'))).toBeVisible();
  });

  describe('Table', () => {
    it('should check headers of the table', () => {
      const tableHeader = spectator.queryAll('.mat-mdc-header-cell') as Element[];
      expect(tableHeader.length).toBe(5);
      expect(tableHeader[0]).toHaveText('books.global.title');
      expect(tableHeader[1]).toHaveText('books.global.price');
      expect(tableHeader[2]).toHaveText('books.global.onSale');
      expect(tableHeader[3]).toHaveText('');
      expect(tableHeader[4]).toHaveText('');
    });

    it('should check content of the table', () => {
      const tableRows = spectator.queryAll('.mat-mdc-row') as Element[];
      expect(tableRows.length).toBe(3);

      const firstRowCells = tableRows[0].querySelectorAll('.mat-mdc-cell') as NodeListOf<Element>;
      expect(firstRowCells[0]).toHaveText('Book 1');
      expect(firstRowCells[1]).toHaveText('79,00 kr.');
      expect(firstRowCells[2]).toHaveText('books.global.yes');
      expect(firstRowCells[3].querySelector('button')).toBeVisible();
      expect(firstRowCells[4].querySelector('button')).toBeVisible();
    });

    it('should check new book button', () => {
      const newBookButton = spectator.query(byTestId('new-book-button')) as HTMLButtonElement;

      const router = spectator.inject(Router);
      const navigateSpy = jest.spyOn(router, 'navigate');

      spectator.click(newBookButton);
      expect(navigateSpy).toHaveBeenCalledWith(['/books/new']);
    });

    it('should check edit book button', () => {
      const tableRows = spectator.queryAll('.mat-mdc-row') as Element[];
      const firstRowCells = tableRows[0].querySelectorAll('.mat-mdc-cell') as NodeListOf<Element>;
      const editButton = firstRowCells[3].querySelector('button') as HTMLButtonElement;

      expect(editButton).toBeVisible();
      expect(editButton).toHaveText('edit');

      const router = spectator.inject(Router);
      const navigateSpy = jest.spyOn(router, 'navigate');

      spectator.click(editButton);
      expect(navigateSpy).toHaveBeenCalledWith(['/books/edit/1']);
    });

    it('should check delete button', () => {
      const tableRows = spectator.queryAll('.mat-mdc-row') as Element[];
      const firstRowCells = tableRows[0].querySelectorAll('.mat-mdc-cell') as NodeListOf<Element>;
      const deleteButton = firstRowCells[4].querySelector('button') as HTMLButtonElement;

      expect(deleteButton).toBeVisible();
      expect(deleteButton).toHaveText('delete');

      const router = spectator.inject(Router);
      const navigateSpy = jest.spyOn(router, 'navigate');

      spectator.click(deleteButton);
      expect(navigateSpy).toHaveBeenCalledWith(['/books/delete/1']);
    });

    it('should check view details button', () => {
      const tableRows = spectator.queryAll('.mat-mdc-row') as Element[];
      const router = spectator.inject(Router);
      const navigateSpy = jest.spyOn(router, 'navigate');

      spectator.click(tableRows[0]);

      expect(navigateSpy).toHaveBeenCalledWith(['/books/view/1']);
    });
  });

  describe('Paginator', () => {
    it('should have page size options 10 and 20', () => {
      const paginator = spectator.query(byTestId('paginator')) as HTMLElement;
      expect(paginator.getAttribute('ng-reflect-page-size-options')).toBe('10,20');
    });
  });

  describe('On sale books', () => {
    it('should check on sale books toggle', () => {
      const onSaleToggle = spectator.query(byTestId('on-sale-book-toggle')) as HTMLElement;
      const button = onSaleToggle.querySelector('button') as HTMLButtonElement;
      expect(button).toBeVisible();

      const bookStore = spectator.inject(BookStore);
      const loadBooksSpy = jest.spyOn(bookStore, 'loadBooks');

      spectator.click(button);

      expect(loadBooksSpy).toHaveBeenCalledWith({ onSale: true });
    });
  });
});
