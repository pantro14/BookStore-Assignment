import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '@app/books/components/book-details/book-details.component';
import { BookStore } from '@app/books/stores/book-store';

@Component({
  selector: 'mxs-view-book',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewBookComponent {
  private readonly dialog = inject(MatDialog);
  protected readonly bookStore = inject(BookStore);

  readonly bookId = input.required<string>();
  protected readonly bookData = computed(() => this.bookStore.selectedBook());

  constructor() {
    effect(() => {
      this.bookStore.setSelectedBook(this.bookId());
    });

    effect(() => {
      const selectedBook = this.bookStore.selectedBook();
      if (!selectedBook) {
        this.bookStore.showBook404Error();
      } else {
        const { componentInstance: bookDetailsComponetRef } = this.dialog.open<BookDetailsComponent>(
          BookDetailsComponent,
          {
            width: '450px',
            disableClose: true,
          }
        );
        bookDetailsComponetRef.bookFormData.set(selectedBook);
        bookDetailsComponetRef.closeDetails.subscribe(() => this.onClose());
      }
    });
  }

  onClose(): void {
    this.dialog.closeAll();
    this.bookStore.nagivageToBookList();
  }
}
