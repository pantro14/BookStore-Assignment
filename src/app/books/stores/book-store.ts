import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { addEntities, prependEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BookCreateDTO, BookDTO, BookstoreBffService } from '@openapi';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';

export const BookStore = signalStore(
  { providedIn: 'root' },
  withEntities<BookDTO>(),
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
    })
  )
);
