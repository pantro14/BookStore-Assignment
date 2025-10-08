import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { BookstoreBffService } from '@openapi';

import { BookFormComponent } from './book-form.component';

describe('BookFormComponent', () => {
  let spectator: Spectator<BookFormComponent>;
  const createComponent = createComponentFactory({
    component: BookFormComponent,
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
