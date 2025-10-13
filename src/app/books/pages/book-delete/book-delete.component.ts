import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookDeleteConfirmComponent } from '@app/books/components/book-delete-confirm/book-delete-confirm.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

@Component({
  selector: 'mxs-book-delete',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDeleteComponent {
  private readonly dialog = inject(MatDialog);
  protected readonly bookStore = inject(BookStore);

  readonly bookId = input.required<string>();

  constructor() {
    effect(() => {
      this.bookStore.setSelectedBook(this.bookId());
    });

    effect(() => {
      const selectedBook = this.bookStore.selectedBook();
      if (!selectedBook) {
        this.bookStore.showBook404Error();
      } else {
        const { componentInstance: bookDeleteComponetRef } = this.dialog.open<BookDeleteConfirmComponent>(
          BookDeleteConfirmComponent,
          {
            width: '450px',
            disableClose: true,
          }
        );
        bookDeleteComponetRef.bookFormData.set(selectedBook);
        bookDeleteComponetRef.closeDelete.subscribe(() => this.onClose());
        bookDeleteComponetRef.submitDelete.subscribe(() => this.onDelete(selectedBook));
      }
    });
  }

  onDelete(selectedBook: BookFormData): void {
    this.bookStore.deleteBook({ bookId: this.bookId(), bookTitle: selectedBook.title });
    this.onClose();
  }

  onClose(): void {
    this.dialog.closeAll();
    this.bookStore.nagivageToBookList();
  }
}
