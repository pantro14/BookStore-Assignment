import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookDialogData, BookFormData, BookFormValue } from '@app/books/interfaces';

import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'mxs-book-dialog',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent implements AfterViewInit {
  @Input() initialData!: BookFormValue;

  @Output() dialogSubmit = new EventEmitter<BookFormData>();
  @Output() dialogClose = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open<BookFormComponent, BookDialogData>(BookFormComponent, {
      width: '450px',
      disableClose: true,
      data: {
        bookFormData: this.initialData,
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
