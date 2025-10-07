import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { BookstoreBffService } from '@openapi';

import { BookCreateComponent } from './book-create.component';

describe('OverviewComponent', () => {
  let spectator: Spectator<BookCreateComponent>;
  const createComponent = createComponentFactory({
    component: BookCreateComponent,
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
