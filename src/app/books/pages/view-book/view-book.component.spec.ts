import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { BookstoreBffService } from '@openapi';

import { ViewBookComponent } from './view-book.component';

describe('ViewBookComponent', () => {
  let spectator: Spectator<ViewBookComponent>;
  const createComponent = createComponentFactory({
    component: ViewBookComponent,
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
