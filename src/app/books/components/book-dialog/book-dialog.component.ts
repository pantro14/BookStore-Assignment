import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookAction, BookFormData, BookFormValue } from '@app/books/interfaces';

import { BookDeleteConfirmComponent } from '../book-delete-confirm/book-delete-confirm.component';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'mxs-book-dialog',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent implements AfterViewInit {
  private readonly dialog = inject(MatDialog);

  readonly bookAction = input.required<BookAction>();
  readonly bookData = input<BookFormValue>();
  readonly dialogSubmit = output<BookFormData>();
  readonly dialogClose = output<void>();

  ngAfterViewInit(): void {
    this.openDialog();
  }

  openDialog(): void {
    let component = this.getComponent(this.bookAction());
    const bookData = this.bookData();
    this.dialog.open(component, {
      width: '450px',
      disableClose: true,
      data: {
        ...(bookData ? { bookFormData: bookData } : {}),
        onSubmit: this.onSubmit.bind(this),
        onClose: this.onClose.bind(this),
      },
    });
  }

  private getComponent(bookAction: BookAction) {
    switch (bookAction) {
      case 'Create':
      case 'Edit':
        return BookFormComponent;
      case 'Delete':
        return BookDeleteConfirmComponent;
      case 'View':
        return BookDetailsComponent;
    }
  }

  onSubmit(data: BookFormData) {
    this.dialogSubmit.emit(data);
    this.dialog.closeAll();
  }

  onClose() {
    this.dialogClose.emit();
    this.dialog.closeAll();
  }
}
