import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { BookFormValue } from '@app/books/interfaces';

@Component({
  selector: 'mxs-book-delete-confirm',
  imports: [MatCardModule, MatButtonModule, MatIcon],
  templateUrl: './book-delete-confirm.component.html',
  styleUrl: './book-delete-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDeleteConfirmComponent {
  readonly bookFormData = model.required<BookFormValue>();
  readonly submitDelete = output<void>();
  readonly closeDelete = output<void>();
}
