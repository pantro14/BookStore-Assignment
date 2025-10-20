import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { BookFormComponent } from '@app/books/components/book-form/book-form.component';
import { BookFormData } from '@app/books/interfaces';
import { BaseBookDialogComponent } from '@app/books/shared/base-book-dialog.component';

@Component({
  selector: 'mxs-book-edit',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent extends BaseBookDialogComponent implements OnInit {
  readonly bookId = input.required<string>();

  ngOnInit(): void {
    this.bookStore.setSelectedBook(this.bookId());
    this.openDialog(this.bookStore.selectedBook());
  }

  protected openDialog(selectedBook: BookFormData | null): void {
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

  private updateBook(bookFormData: BookFormData): void {
    this.bookStore.updateBook({ bookId: this.bookId().toString(), bookFormData });
    this.goBack();
  }
}
