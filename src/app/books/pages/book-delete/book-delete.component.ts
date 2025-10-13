import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { BookDialogComponent } from '@app/books/components/book-dialog/book-dialog.component';
import { BookAction } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

@Component({
  selector: 'mxs-book-delete',
  imports: [BookDialogComponent],
  template: `
    @let bookDataValue = bookData();
    @if (bookDataValue) {
      <mxs-book-dialog
        [bookData]="bookDataValue"
        [bookAction]="BookAction"
        (dialogSubmit)="onDelete()"
        (dialogClose)="onClose()"
      >
      </mxs-book-dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDeleteComponent {
  readonly bookId = input.required<string>();
  protected readonly bookStore = inject(BookStore);

  protected readonly bookData = computed(() => this.bookStore.selectedBook());

  protected readonly BookAction: BookAction = 'Delete';

  constructor() {
    effect(() => {
      this.bookStore.setSelectedBook(this.bookId());
    });

    effect(() => {
      const selectedBook = this.bookStore.selectedBook();
      if (!selectedBook) {
        this.bookStore.showBook404Error();
      }
    });
  }

  onDelete(): void {
    const bookTitle = this.bookData()!.title;
    const bookId = this.bookId();
    this.bookStore.deleteBook({ bookId, bookTitle });
  }

  onClose(): void {
    this.bookStore.nagivageToBookList();
  }
}
