import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { BookstoreBffService } from '@openapi';

import { BookDialogComponent } from './book-dialog.component';

describe('BookDialogComponent', () => {
  let spectator: Spectator<BookDialogComponent>;
  const createComponent = createComponentFactory({
    component: BookDialogComponent,
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
