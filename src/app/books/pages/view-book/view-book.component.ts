import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '@app/books/components/book-details/book-details.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

@Component({
  selector: 'mxs-view-book',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewBookComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  protected readonly bookStore = inject(BookStore);

  readonly bookId = input.required<string>();

  ngOnInit(): void {
    this.bookStore.setSelectedBook(this.bookId());
    this.openDialog(this.bookStore.selectedBook());
  }

  openDialog(selectedBook: BookFormData | null): void {
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
      bookDetailsComponetRef.closeDetails.subscribe(() => this.onClose());
    }
  }

  onClose(): void {
    this.dialog.closeAll();
    this.bookStore.nagivageToBookList();
  }
}
