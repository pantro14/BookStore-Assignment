import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { BookStore } from '@app/books/stores/book-store';
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
    MatSortModule,
    CurrencyPipe,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  protected readonly router = inject(Router);
  protected readonly bookStore = inject(BookStore);

  protected paginator = viewChild(MatPaginator);
  protected sort = viewChild(MatSort);

  protected dataSource: MatTableDataSource<BookDTO> = new MatTableDataSource<BookDTO>([]);

  readonly displayedColumns = signal<string[]>(['title', 'price', 'onSale', 'edit', 'delete']);

  constructor() {
    this.bookStore.loadBooks({ onSale: false });
    effect(() => {
      const paginator = this.paginator();
      const sort = this.sort();
      if (paginator && sort) {
        this.dataSource = new MatTableDataSource<BookDTO>(this.bookStore.bookList());
        this.dataSource.paginator = paginator;
        this.dataSource.sort = sort;
      }
    });
  }

  createBook() {
    this.router.navigate(['/books/new']);
  }

  onSaleToggle(event: MatSlideToggleChange) {
    const isChecked = event.checked;
    this.bookStore.loadBooks({ onSale: isChecked });
  }

  editBook(bookId: string) {
    this.router.navigate([`/books/edit/${bookId}`]);
  }

  deleteBook(bookId: string) {
    this.router.navigate([`/books/delete/${bookId}`]);
  }
}
