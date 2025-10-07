import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookstoreBffService } from '@openapi';

import { BookDialogComponent } from '../book-dialog/book-dialog.component';

@Component({
  selector: 'mxs-book-create',
  imports: [BookDialogComponent],
  template: `
    <mxs-book-dialog
      [initialData]="initialData"
      (dialogSubmit)="onSubmit($event)"
      (dialogClose)="onClose()"
    ></mxs-book-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateComponent {
  protected readonly router = inject(Router);
  protected readonly bookstoreBffService = inject(BookstoreBffService);

  protected readonly initialData = {
    title: '',
    price: 0,
    pageCount: 0,
    onSale: false,
  };

  onSubmit(data: any): void {
    this.bookstoreBffService.createBook({ bookCreateDTO: data }).subscribe({
      next: () => this.onClose(),
      error: err => {
        console.error('Error creating book:', err);
      },
    });
  }

  onClose(): void {
    this.router.navigate(['/books']);
  }
}
