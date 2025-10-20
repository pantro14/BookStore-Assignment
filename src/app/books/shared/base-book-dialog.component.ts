import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

export abstract class BaseBookDialogComponent {
  protected readonly dialog = inject(MatDialog);
  protected readonly bookStore = inject(BookStore);

  protected abstract openDialog(selectedBook?: BookFormData | null): void;

  protected goBack(): void {
    this.dialog.closeAll();
    this.bookStore.nagivageToBookList();
  }
}
