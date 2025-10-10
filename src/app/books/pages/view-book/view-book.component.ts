import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { BookDialogComponent } from '@app/books/components/book-dialog/book-dialog.component';
import { BookAction } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

@Component({
  selector: 'mxs-view-book',
  imports: [BookDialogComponent],
  template: `
    @let bookDataValue = bookData();
    @if (bookDataValue !== null) {
      <mxs-book-dialog [bookAction]="BookAction" [bookData]="bookDataValue" (dialogClose)="onClose()"></mxs-book-dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewBookComponent {
  protected readonly bookStore = inject(BookStore);
  protected readonly BookAction: BookAction = 'View';

  readonly bookId = input.required<string>();
  protected readonly bookData = computed(() => this.bookStore.selectedBook());

  constructor() {
    effect(() => {
      this.bookStore.setSelectedBookId(this.bookId());
    });
  }

  onClose(): void {
    this.bookStore.nagivageToBookList();
  }
}
