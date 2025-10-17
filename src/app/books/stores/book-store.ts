import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  addEntities,
  EntityId,
  prependEntity,
  removeAllEntities,
  removeEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { BookCreateDTO, BookDTO, BookstoreBffService, BookUpdateDTO } from '@openapi';
import { catchError, EMPTY, pipe, switchMap, take, tap } from 'rxjs';

import { BookDetails, BookFormData } from '../interfaces';

type BookStoreState = {
  loading: boolean;
  error: string | null;
  selectedBook: BookDetails | null;
};

export const BookStore = signalStore(
  { providedIn: 'root' },
  withEntities<BookDTO>(),
  withState<BookStoreState>({ loading: false, error: null, selectedBook: null }),
  withComputed(({ entityMap }) => ({
    bookList: computed(() => Object.values(entityMap())),
  })),
  withMethods(
    (
      store,
      bookstoreBffService = inject(BookstoreBffService),
      router = inject(Router),
      snackBar = inject(MatSnackBar),
      translate = inject(TranslateService)
    ) => ({
      nagivageToBookList: () => {
        router.navigate(['/books']);
      },
      showBook404Error: () => {
        const snackbarRef = snackBar.open(
          translate.instant('books.snackbar.notFound'),
          translate.instant('books.snackbar.close'),
          {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: 'snackbar-error',
          }
        );
        snackbarRef
          .afterDismissed()
          .pipe(take(1))
          .subscribe(() => {
            router.navigate(['/books']);
          });
      },
      setSelectedBook: (bookId: EntityId) => {
        const selectedBook = store.entityMap()[bookId];
        if (!selectedBook) {
          patchState(store, { selectedBook: null });
          return;
        }
        const { title, price, pageCount, onSale, author, lastUpdatedBy } = selectedBook;
        patchState(store, {
          selectedBook: {
            title,
            price: price!,
            pageCount: pageCount!,
            onSale: onSale!,
            author: author!,
            lastUpdatedBy: lastUpdatedBy!,
          },
        });
      },
      loadBooks: rxMethod<{ onSale: boolean }>(
        pipe(
          switchMap(({ onSale }) => {
            patchState(store, { loading: true });
            return bookstoreBffService.getBooks({ onSale }).pipe(
              //delay(2000), //added delay to simulate loading, this will break unit tests
              tap(books => {
                patchState(store, removeAllEntities());
                patchState(store, addEntities([...books]));
              })
            );
          }),
          tap(() => patchState(store, { loading: false }))
        )
      ),
      addBook: rxMethod<BookCreateDTO>(
        pipe(
          switchMap(data =>
            bookstoreBffService.createBook({ bookCreateDTO: data }).pipe(
              tap(book => {
                const submitData = { ...data, id: book.id } as BookDTO;
                patchState(store, prependEntity(submitData));
                snackBar.open(
                  translate.instant('books.snackbar.added', { title: data.title }),
                  translate.instant('books.snackbar.close'),
                  {
                    duration: 3000,
                    verticalPosition: 'top',
                    panelClass: 'snackbar-success',
                  }
                );
              }),
              catchError(() => {
                snackBar.open(translate.instant('books.snackbar.addError'), translate.instant('books.snackbar.close'), {
                  duration: 3000,
                  verticalPosition: 'top',
                  panelClass: 'snackbar-error',
                });
                return EMPTY;
              })
            )
          ),
          tap(() => router.navigate(['/books']))
        )
      ),
      updateBook: rxMethod<{ bookId: string; bookFormData: BookFormData }>(
        pipe(
          switchMap(({ bookId, bookFormData }) => {
            const bookUpdateDTO = { ...bookFormData, lastUpdated: new Date().getTime() } as BookUpdateDTO;
            return bookstoreBffService.updateBook({ bookId, bookUpdateDTO }).pipe(
              tap(() => {
                patchState(store, updateEntity({ id: bookId, changes: { ...bookFormData } }));
                snackBar.open(
                  translate.instant('books.snackbar.updated', { title: bookFormData.title }),
                  translate.instant('books.snackbar.close'),
                  {
                    duration: 3000,
                    verticalPosition: 'top',
                    panelClass: 'snackbar-success',
                  }
                );
              }),
              catchError(() => {
                snackBar.open(
                  translate.instant('books.snackbar.updateError'),
                  translate.instant('books.snackbar.close'),
                  {
                    duration: 3000,
                    verticalPosition: 'top',
                    panelClass: 'snackbar-error',
                  }
                );
                return EMPTY;
              })
            );
          }),
          tap(() => router.navigate(['/books']))
        )
      ),
      deleteBook: rxMethod<{ bookId: string; bookTitle: string }>(
        pipe(
          switchMap(({ bookId, bookTitle }) =>
            bookstoreBffService.deleteBook({ bookId }).pipe(
              tap(() => {
                patchState(store, removeEntity(bookId));
                snackBar.open(
                  translate.instant('books.snackbar.deleted', { title: bookTitle }),
                  translate.instant('books.snackbar.close'),
                  {
                    duration: 3000,
                    verticalPosition: 'top',
                    panelClass: 'snackbar-success',
                  }
                );
              }),
              catchError(() => {
                snackBar.open(
                  translate.instant('books.snackbar.deleteError'),
                  translate.instant('books.snackbar.close'),
                  {
                    duration: 3000,
                    verticalPosition: 'top',
                    panelClass: 'snackbar-error',
                  }
                );
                return EMPTY;
              })
            )
          ),
          tap(() => router.navigate(['/books']))
        )
      ),
    })
  )
);
