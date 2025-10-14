import { translateServiceMock } from '@app/books/utils/translate-service.mock';
import { byTestId, byText, createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslateService } from '@ngx-translate/core';

import { BookDeleteConfirmComponent } from './book-delete-confirm.component';

describe('BookDeleteConfirmComponent', () => {
  let spectator: Spectator<BookDeleteConfirmComponent>;

  const bookDetails = {
    title: 'The lord of the rings',
    price: 200,
    pageCount: 1200,
    onSale: true,
  };

  const createComponent = createComponentFactory({
    component: BookDeleteConfirmComponent,
    providers: [{ provide: TranslateService, useValue: translateServiceMock }],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        bookDetails,
      },
    });
  });

  it('should check book details displayed', () => {
    expect(spectator.query(byTestId('title-delete'))).toHaveText('The lord of the rings');
    expect(spectator.query(byText('books.delete.warning'))).toBeVisible();
  });

  it('should test cancel button', () => {
    const closeSpy = jest.spyOn(spectator.component.closeDelete, 'emit');
    spectator.click(byTestId('cancel-button'));
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should test submit delete button', () => {
    const deleteSpy = jest.spyOn(spectator.component.submitDelete, 'emit');
    spectator.click(byTestId('delete-button'));
    expect(deleteSpy).toHaveBeenCalled();
  });
});
