import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { BookDTO, BookstoreBffService } from '@openapi';
import { Observable } from 'rxjs';

@Component({
  selector: 'mxs-overview',
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule],
})
export class OverviewComponent {
  public getAllBooks$: Observable<BookDTO[]> = inject(BookstoreBffService).getBooks({ onSale: false });
}
