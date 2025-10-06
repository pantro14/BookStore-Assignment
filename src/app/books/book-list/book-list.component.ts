import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BookDTO, BookstoreBffService } from '@openapi';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSlideToggleModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  public getAllBooks$: Observable<BookDTO[]> = inject(BookstoreBffService).getBooks({ onSale: false });

  onSearchChange(value: string): void {
    // To be implemented
  }

  onSaleToggle(event: any): void {
    // To be implemented
  }

  onCreateBook(): void {
    // To be implemented
  }
}
