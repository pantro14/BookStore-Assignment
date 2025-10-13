import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from '@app/books/components/book-form/book-form.component';
import { BookFormData } from '@app/books/interfaces';
import { BookStore } from '@app/books/stores/book-store';

@Component({
  selector: 'mxs-book-edit',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent {
  private readonly dialog = inject(MatDialog);
  protected readonly bookStore = inject(BookStore);

  readonly bookId = input.required<string>();
  protected readonly bookData = computed(() => this.bookStore.selectedBook());

  constructor() {
    effect(() => {
      this.bookStore.setSelectedBook(this.bookId());
    });

    effect(() => {
      const selectedBook = this.bookStore.selectedBook();
      if (!selectedBook) {
        this.bookStore.showBook404Error();
      } else {
        const { componentInstance: bookFormComponetRef } = this.dialog.open<BookFormComponent>(BookFormComponent, {
          width: '450px',
          disableClose: true,
        });
        bookFormComponetRef.bookFormData.set(selectedBook);
        bookFormComponetRef.closeForm.subscribe(() => this.onClose());
        bookFormComponetRef.submitForm.subscribe(bookFormData => this.onSubmit(bookFormData));
      }
    });
  }

  onSubmit(bookFormData: BookFormData): void {
    this.bookStore.updateBook({ bookId: this.bookId().toString(), bookFormData });
    this.onClose();
  }

  onClose(): void {
    this.dialog.closeAll();
    this.bookStore.nagivageToBookList();
  }
}
