import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { BookstoreBffService } from '@openapi';

import { BookDetailsComponent } from './book-details.component';

describe('BookDetailsComponent', () => {
  let spectator: Spectator<BookDetailsComponent>;
  const createComponent = createComponentFactory({
    component: BookDetailsComponent,
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
