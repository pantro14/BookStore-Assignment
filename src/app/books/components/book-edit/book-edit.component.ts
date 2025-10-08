import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

import { BookDialogComponent } from '../book-dialog/book-dialog.component';

@Component({
  selector: 'mxs-book-edit',
  imports: [BookDialogComponent],
  template: `
    @let bookDataValue = bookData();
    @if (bookDataValue !== null) {
      <mxs-book-dialog
        [initialData]="bookDataValue"
        (dialogSubmit)="onSubmit($event)"
        (dialogClose)="onClose()"
      ></mxs-book-dialog>
    }
  `,
  styleUrl: './book-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent {
  protected readonly bookStore = inject(BookStore);
  readonly bookId = input.required<number>();
  protected bookData = this.bookStore.selectedBook;

  constructor() {
    effect(() => {
      this.bookStore.setSelectedBookId(this.bookId());
    });
  }

  onSubmit(book: BookFormData): void {
    this.bookStore.addBook(book);
  }

  onClose(): void {
    this.bookStore.nagivageToBookList();
  }
}
