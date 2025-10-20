import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BookFormComponent } from '@app/books/components/book-form/book-form.component';
import { BookFormData } from '@app/books/interfaces';
import { BaseBookDialogComponent } from '@app/books/shared/base-book-dialog.component';

@Component({
  selector: 'mxs-book-create',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateComponent extends BaseBookDialogComponent implements OnInit {
  ngOnInit(): void {
    this.openDialog();
  }

  protected openDialog(): void {
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

  private addBook(newBook: BookFormData): void {
    this.bookStore.addBook(newBook);
    this.goBack();
  }
}
