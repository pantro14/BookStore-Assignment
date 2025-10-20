import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { BookDetailsComponent } from '@app/books/components/book-details/book-details.component';
import { BookFormData } from '@app/books/interfaces';
import { BaseBookDialogComponent } from '@app/books/shared/base-book-dialog.component';

@Component({
  selector: 'mxs-view-book',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookViewComponent extends BaseBookDialogComponent implements OnInit {
  readonly bookId = input.required<string>();

  ngOnInit(): void {
    this.bookStore.setSelectedBook(this.bookId());
    this.openDialog(this.bookStore.selectedBook());
  }

  protected openDialog(selectedBook: BookFormData | null): void {
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
      bookDetailsComponetRef.bookDetails.set(selectedBook);
      bookDetailsComponetRef.closeDetails.subscribe(() => this.goBack());
    }
  }
}
