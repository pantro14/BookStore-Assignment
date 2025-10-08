import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { addEntities, EntityId, prependEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BookCreateDTO, BookDTO, BookstoreBffService, BookUpdateDTO } from '@openapi';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';

import { BookFormData } from '../interfaces';

export type SelectedEntityState = { selectedBookId: EntityId | null };

export const BookStore = signalStore(
  { providedIn: 'root' },
  withEntities<BookDTO>(),
  withState<SelectedEntityState>({ selectedBookId: null }),
  withComputed(({ entityMap, selectedBookId }) => ({
    bookList: computed(() => Object.values(entityMap())),
    selectedBook: computed<BookFormData | null>(() => {
      const selectedId = selectedBookId();
      if (!selectedId) {
        return null;
      }

      const selectedEntity = entityMap()[selectedId];
      if (!selectedEntity) {
        return null;
      }

      const { title, price, pageCount, onSale } = selectedEntity;
      return {
        title,
        price: price ? Number(price) : 0,
        pageCount: pageCount ? Number(pageCount) : 0,
        onSale,
      } as BookFormData;
    }),
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
      setSelectedBookId: (id: EntityId | null) => {
        patchState(store, { selectedBookId: id });
      },
      loadBooks: rxMethod<void>(
        pipe(
          switchMap(() =>
            bookstoreBffService
              .getBooks({ onSale: false })
              .pipe(tap(books => patchState(store, addEntities([...books]))))
          )
        )
      ),
      addBook: rxMethod<BookCreateDTO>(
        pipe(
          switchMap(data =>
            bookstoreBffService.createBook({ bookCreateDTO: data }).pipe(
              tap(book => {
                patchState(store, prependEntity(book));
                snackBar.open(`Book "${book.title}" added successfully!`, 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                });
              }),
              catchError(() => {
                snackBar.open(`Book could not be created`, 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
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
              tap(book => {
                patchState(store, addEntities([book]));
                snackBar.open(`Book "${book.title}" edited successfully!`, 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                });
              }),
              catchError(() => {
                snackBar.open(`Book could not be edited`, 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
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
