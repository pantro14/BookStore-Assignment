import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from '@app/books/components/book-form/book-form.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

@Component({
  selector: 'mxs-book-edit',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent implements OnInit {
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
      const { componentInstance: bookFormComponetRef } = this.dialog.open<BookFormComponent>(BookFormComponent, {
        width: '450px',
        disableClose: true,
      });
      bookFormComponetRef.bookFormData.set(selectedBook);
      bookFormComponetRef.closeForm.subscribe(() => this.goBack());
      bookFormComponetRef.submitForm.subscribe(bookFormData => this.updateBook(bookFormData));
    }
  }

  updateBook(bookFormData: BookFormData): void {
    this.bookStore.updateBook({ bookId: this.bookId().toString(), bookFormData });
    this.goBack();
  }

  goBack(): void {
    this.dialog.closeAll();
    this.bookStore.nagivageToBookList();
  }
}
