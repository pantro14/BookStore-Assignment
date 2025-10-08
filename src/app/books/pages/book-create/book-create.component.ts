import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

import { BookDialogComponent } from '../../components/book-dialog/book-dialog.component';

@Component({
  selector: 'mxs-book-create',
  imports: [BookDialogComponent],
  template: `
    <mxs-book-dialog
      [bookData]="bookData()"
      (dialogSubmit)="onSubmit($event)"
      (dialogClose)="onClose()"
    ></mxs-book-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateComponent {
  protected readonly bookStore = inject(BookStore);

  protected readonly bookData = signal({
    title: null,
    price: null,
    pageCount: null,
    onSale: false,
  });

  protected onSubmit(newBook: BookFormData): void {
    this.bookStore.addBook(newBook);
  }

  protected onClose(): void {
    this.bookStore.nagivageToBookList();
  }
}
