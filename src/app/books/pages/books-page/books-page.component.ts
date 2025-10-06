import { CommonModule, CurrencyPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { BookDTO, BookstoreBffService } from '@openapi';

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
    CurrencyPipe,
  ],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPageComponent implements AfterViewInit {
  protected readonly bookstoreBffService = inject(BookstoreBffService);
  protected readonly router = inject(Router);

  protected dataSource: MatTableDataSource<BookDTO> = new MatTableDataSource<BookDTO>([]);

  @Input() bookId = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly displayedColumns: string[] = ['title', 'price', 'onSale', 'edit', 'delete'];

  ngAfterViewInit() {
    this.bookstoreBffService.getBooks({ onSale: false }).subscribe(books => {
      this.dataSource = new MatTableDataSource<BookDTO>(books);
      this.dataSource.paginator = this.paginator;
    });
  }

  createBook() {
    this.router.navigate(['/books/new']);
  }

  editBook(bookId: string) {
    this.router.navigate([`/books/edit/${bookId}`]);
  }

  deleteBook(bookId: string) {
    //to implement
  }
}
