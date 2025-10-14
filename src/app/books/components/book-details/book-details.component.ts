import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { BookDetails } from '@app/books/interfaces';

@Component({
  selector: 'mxs-book-details',
  imports: [MatCardModule, MatButtonModule, MatListModule, CurrencyPipe],
  templateUrl: './book-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent {
  readonly bookDetails = model.required<BookDetails>();
  readonly closeDetails = output<void>();
}
