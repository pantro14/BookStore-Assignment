import { registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
import { translateServiceMock } from '@app/books/utils/translate-service.mock';
import { byTestId, createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslateService } from '@ngx-translate/core';

import { BookDetailsComponent } from './book-details.component';

registerLocaleData(localeDa, 'da-DK');

describe('BookDetailsComponent', () => {
  let spectator: Spectator<BookDetailsComponent>;

  const bookDetails = {
    title: 'The lord of the rings',
    price: 200,
    pageCount: 1200,
    onSale: true,
    author: 'J.R.R. Tolkien',
    lastUpdatedBy: 'admin',
  };

  const createComponent = createComponentFactory({
    component: BookDetailsComponent,
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
    expect(spectator.query(byTestId('title-details'))).toHaveText('The lord of the rings');
    expect(spectator.query(byTestId('on-sale-details'))).toHaveText('books.global.onSale: Yes');
    expect(spectator.query(byTestId('page-count-details'))).toHaveText('books.global.pageCount: 1200');
    expect(spectator.query(byTestId('price-details'))).toContainText('books.global.price: 200,00 kr.');
    expect(spectator.query(byTestId('author-details'))).toHaveText('books.global.author: J.R.R. Tolkien');
    expect(spectator.query(byTestId('last-updated-by'))).toHaveText('books.global.lastUpdatedBy: admin');
  });

  it('should test cancel button', () => {
    const closeSpy = jest.spyOn(spectator.component.closeDetails, 'emit');
    spectator.click(byTestId('cancel-button'));
    expect(closeSpy).toHaveBeenCalled();
  });
});
