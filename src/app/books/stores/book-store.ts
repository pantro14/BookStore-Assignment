import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { addEntities, addEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BookCreateDTO, BookDTO, BookstoreBffService } from '@openapi';
import { pipe, switchMap, tap } from 'rxjs';

export const BookStore = signalStore(
  { providedIn: 'root' },
  withEntities<BookDTO>(),
  withMethods((store, bookstoreBffService = inject(BookstoreBffService), router = inject(Router)) => ({
    nagivageToBookList: () => {
      router.navigate(['/books']);
    },
    loadBooks: rxMethod<void>(
      pipe(
        switchMap(() =>
          bookstoreBffService.getBooks({ onSale: false }).pipe(tap(books => patchState(store, addEntities([...books]))))
        )
      )
    ),
    addBook: rxMethod<BookCreateDTO>(
      pipe(
        switchMap(data =>
          bookstoreBffService.createBook({ bookCreateDTO: data }).pipe(
            tap(book => {
              patchState(store, addEntity(book));
              router.navigate(['/books']);
            })
          )
        )
      )
    ),
  }))
);
