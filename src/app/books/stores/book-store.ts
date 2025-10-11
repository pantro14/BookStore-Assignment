import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  addEntities,
  EntityId,
  prependEntity,
  removeAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BookCreateDTO, BookDTO, BookstoreBffService, BookUpdateDTO } from '@openapi';
import { catchError, delay, EMPTY, pipe, switchMap, take, tap } from 'rxjs';

import { BookFormData } from '../interfaces';

type BookStoreState = {
  loading: boolean;
  error: string | null;
  selectedBook: BookFormData | null;
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
      snackBar = inject(MatSnackBar)
    ) => ({
      nagivageToBookList: () => {
        router.navigate(['/books']);
      },
      showBook404Error: () => {
        const snackbarRef = snackBar.open(`The Book was not found`, 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: 'snackbar-error',
        });
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
        const { title, price, pageCount, onSale } = selectedBook;
        patchState(store, {
          selectedBook: {
            title,
            price: price ? Number(price) : 0,
            pageCount: pageCount ? Number(pageCount) : 0,
            onSale: onSale ?? false,
          },
        });
      },
      loadBooks: rxMethod<{ onSale: boolean }>(
        pipe(
          switchMap(({ onSale }) => {
            patchState(store, { loading: true });
            return bookstoreBffService.getBooks({ onSale }).pipe(
              delay(1000),
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
                snackBar.open(`Book "${data.title}" added successfully!`, 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                  panelClass: 'snackbar-success',
                });
              }),
              catchError(() => {
                snackBar.open(`Book could not be created`, 'Close', {
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
                snackBar.open(`Book "${bookFormData.title}" edited successfully!`, 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                  panelClass: 'snackbar-success',
                });
              }),
              catchError(() => {
                snackBar.open(`Book could not be edited`, 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                  panelClass: 'snackbar-error',
                });
                return EMPTY;
              })
            );
          }),
          tap(() => router.navigate(['/books']))
        )
      ),
    })
  )
);
