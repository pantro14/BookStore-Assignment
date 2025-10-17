import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { BookTableColumns } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';
import { MatPaginatorIntlDa } from '@app/books/utils/mat-paginator-intl-da';
import { TranslatePipe } from '@ngx-translate/core';
import { BookDTO } from '@openapi';

@Component({
  selector: 'mxs-books-page',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSortModule,
    CurrencyPipe,
    TranslatePipe,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlDa }],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  protected readonly router = inject(Router);
  protected readonly bookStore = inject(BookStore);

  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);

  protected readonly displayedColumns = signal<BookTableColumns[]>(['title', 'price', 'onSale', 'edit', 'delete']);

  protected readonly loading = computed<boolean>(() => this.bookStore.loading());
  protected readonly dataSource = computed<MatTableDataSource<BookDTO>>(() => {
    const paginator = this.paginator();
    const sort = this.sort();
    const bookList = this.bookStore.bookList();

    let dataSource = new MatTableDataSource<BookDTO>([]);

    if (paginator && sort) {
      dataSource.paginator = paginator;
      dataSource.sort = sort;
    }

    if (bookList.length > 0) {
      dataSource.data = bookList;
    }

    return dataSource;
  });

  constructor() {
    this.bookStore.loadBooks({ onSale: false });
  }

  createBook() {
    this.router.navigate(['/books/new']);
  }

  onSaleToggle(event: MatSlideToggleChange) {
    const isChecked = event.checked;
    this.bookStore.loadBooks({ onSale: isChecked });
  }

  editBook(e: MouseEvent, bookId: string) {
    e.stopPropagation();
    this.router.navigate([`/books/edit/${bookId}`]);
  }

  deleteBook(e: MouseEvent, bookId: string) {
    e.stopPropagation();
    this.router.navigate([`/books/delete/${bookId}`]);
  }

  onViewDetails({ id: bookId }: BookDTO) {
    this.router.navigate([`/books/view/${bookId}`]);
  }
}
