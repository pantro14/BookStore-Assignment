import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookDialogData, BookFormData, BookFormValue } from '@app/books/interfaces';

import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'mxs-book-dialog',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent implements AfterViewInit {
  private readonly dialog = inject(MatDialog);

  readonly bookData = input.required<BookFormValue>();
  readonly dialogSubmit = output<BookFormData>();
  readonly dialogClose = output<void>();

  ngAfterViewInit(): void {
    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open<BookFormComponent, BookDialogData>(BookFormComponent, {
      width: '450px',
      disableClose: true,
      data: {
        bookFormData: this.bookData(),
        onSubmit: (data: BookFormData) => {
          this.dialogSubmit.emit(data);
          this.dialog.closeAll();
        },
        onClose: () => {
          this.dialogClose.emit();
          this.dialog.closeAll();
        },
      },
    });
  }
}
