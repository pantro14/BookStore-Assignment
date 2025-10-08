import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

import { BookDialogComponent } from '../../components/book-dialog/book-dialog.component';

@Component({
  selector: 'mxs-book-edit',
  imports: [BookDialogComponent],
  template: `
    @let bookDataValue = bookData();
    @if (bookDataValue !== null) {
      <mxs-book-dialog
        [bookData]="bookDataValue"
        (dialogSubmit)="onSubmit($event)"
        (dialogClose)="onClose()"
      ></mxs-book-dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent {
  protected readonly bookStore = inject(BookStore);
  readonly bookId = input.required<number>();
  protected readonly bookData = this.bookStore.selectedBook;

  constructor() {
    effect(() => {
      this.bookStore.setSelectedBookId(this.bookId());
    });
  }

  onSubmit(bookFormData: BookFormData): void {
    this.bookStore.updateBook({ bookId: this.bookId().toString(), bookFormData });
  }

  onClose(): void {
    this.bookStore.nagivageToBookList();
  }
}
