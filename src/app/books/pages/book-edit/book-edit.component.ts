import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { BookAction, BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

import { BookDialogComponent } from '../../components/book-dialog/book-dialog.component';

@Component({
  selector: 'mxs-book-edit',
  imports: [BookDialogComponent],
  template: `
    @let bookDataValue = bookData();
    @if (bookDataValue) {
      <mxs-book-dialog
        [bookAction]="BookAction"
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
  readonly bookId = input.required<string>();
  protected readonly bookData = computed(() => this.bookStore.selectedBook());
  protected readonly BookAction: BookAction = 'Edit';

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
