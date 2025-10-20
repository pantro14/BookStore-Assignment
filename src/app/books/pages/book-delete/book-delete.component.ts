import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { BookDeleteConfirmComponent } from '@app/books/components/book-delete-confirm/book-delete-confirm.component';
import { BookFormData } from '@app/books/interfaces';
import { BaseBookDialogComponent } from '@app/books/shared/base-book-dialog.component';

@Component({
  selector: 'mxs-book-delete',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDeleteComponent extends BaseBookDialogComponent implements OnInit {
  readonly bookId = input.required<string>();

  ngOnInit(): void {
    this.bookStore.setSelectedBook(this.bookId());
    this.openDialog(this.bookStore.selectedBook());
  }

  protected openDialog(selectedBook: BookFormData | null): void {
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
      bookDeleteComponetRef.bookDetails.set(selectedBook);
      bookDeleteComponetRef.closeDelete.subscribe(() => this.goBack());
      bookDeleteComponetRef.submitDelete.subscribe(() => this.deleteBook(selectedBook));
    }
  }

  private deleteBook(selectedBook: BookFormData): void {
    this.bookStore.deleteBook({ bookId: this.bookId(), bookTitle: selectedBook.title });
    this.goBack();
  }
}
