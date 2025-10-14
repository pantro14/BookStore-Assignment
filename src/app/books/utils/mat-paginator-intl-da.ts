import { inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MatPaginatorIntlDa extends MatPaginatorIntl {
  private translate = inject(TranslateService);
  itemsPerPageLabel = this.translate.instant('books.list.paginator.itemsPerPage');
  nextPageLabel = this.translate.instant('books.list.paginator.nextPage');
  previousPageLabel = this.translate.instant('books.list.paginator.previousPage');
}
