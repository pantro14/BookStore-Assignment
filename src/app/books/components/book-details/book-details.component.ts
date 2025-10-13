import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { BookDialogData } from '@app/books/interfaces';

@Component({
  selector: 'mxs-book-details',
  imports: [MatCardModule, MatButtonModule, MatListModule, CurrencyPipe],
  templateUrl: './book-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent {
  readonly data = inject<BookDialogData>(MAT_DIALOG_DATA);

  onCancel() {
    this.data.onClose();
  }
}
