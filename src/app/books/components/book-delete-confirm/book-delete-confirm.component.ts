import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { BookDialogData } from '@app/books/interfaces';

@Component({
  selector: 'mxs-book-delete-confirm',
  imports: [MatCardModule, MatButtonModule, MatIcon],
  templateUrl: './book-delete-confirm.component.html',
  styleUrl: './book-delete-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDeleteConfirmComponent {
  readonly data = inject<BookDialogData>(MAT_DIALOG_DATA);

  onDelete() {
    this.data.onSubmit();
  }

  onCancel() {
    this.data.onClose();
  }
}
