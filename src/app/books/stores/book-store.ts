import { inject } from '@angular/core';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { addEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BookDTO, BookstoreBffService } from '@openapi';
import { pipe, switchMap, tap } from 'rxjs';

export const BookStore = signalStore(
  { providedIn: 'root' },
  withEntities<BookDTO>(),
  withMethods((store, bookstoreBffService = inject(BookstoreBffService)) => ({
    loadBooks: rxMethod<void>(
      pipe(
        switchMap(() =>
          bookstoreBffService.getBooks({ onSale: false }).pipe(tap(books => patchState(store, addEntities([...books]))))
        )
      )
    ),
  }))
);
