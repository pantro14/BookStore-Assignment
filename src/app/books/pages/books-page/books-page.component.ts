import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BookDTO, BookstoreBffService } from '@openapi';
import { Observable } from 'rxjs';

@Component({
  selector: 'mxs-books-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPageComponent {
  public readonly books$: Observable<BookDTO[]> = inject(BookstoreBffService).getBooks({ onSale: false });
  protected readonly router = inject(Router);

  @Input() bookId = '';

  createBook() {
    this.router.navigate(['/books/new']);
  }

  editBook(bookId: string) {
    this.router.navigate([`/books/edit/${bookId}`]);
  }
}
