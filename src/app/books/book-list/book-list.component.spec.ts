import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { BookstoreBffService } from '@openapi';

import { BookListComponent } from './book-list.component';

describe('BookListComponent', () => {
  let spectator: Spectator<BookListComponent>;
  const createComponent = createComponentFactory({
    component: BookListComponent,
    imports: [],
    mocks: [BookstoreBffService],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });
});
