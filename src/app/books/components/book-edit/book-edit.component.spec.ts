import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { BookstoreBffService } from '@openapi';

import { BookEditComponent } from './book-edit.component';

describe('OverviewComponent', () => {
  let spectator: Spectator<BookEditComponent>;
  const createComponent = createComponentFactory({
    component: BookEditComponent,
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
