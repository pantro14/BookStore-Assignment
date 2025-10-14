import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from '@app/books/components/book-form/book-form.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

@Component({
  selector: 'mxs-book-create',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateComponent {
  private readonly dialog = inject(MatDialog);
  protected readonly bookStore = inject(BookStore);

  constructor() {
    const { componentInstance: bookFormComponetRef } = this.dialog.open<BookFormComponent>(BookFormComponent, {
      width: '450px',
      disableClose: true,
    });
    bookFormComponetRef.bookFormData.set({
      title: null,
      price: null,
      pageCount: null,
      onSale: false,
    });
    bookFormComponetRef.closeForm.subscribe(() => this.goBack());
    bookFormComponetRef.submitForm.subscribe(bookFormData => this.addBook(bookFormData));
  }

  protected addBook(newBook: BookFormData): void {
    this.bookStore.addBook(newBook);
    this.goBack();
  }

  protected goBack(): void {
    this.dialog.closeAll();
    this.bookStore.nagivageToBookList();
  }
}
