import { registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
import { byTestId, createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { BookDetailsComponent } from './book-details.component';

registerLocaleData(localeDa, 'da-DK');

describe('BookDetailsComponent', () => {
  let spectator: Spectator<BookDetailsComponent>;

  const bookDetails = {
    title: 'The lord of the rings',
    price: 200,
    pageCount: 1200,
    onSale: true,
  };

  const createComponent = createComponentFactory({
    component: BookDetailsComponent,
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
    expect(spectator.query(byTestId('on-sale-details'))).toHaveText('On Sale: Yes');
    expect(spectator.query(byTestId('page-count-details'))).toHaveText(`Page size: 1200`);
    expect(spectator.query(byTestId('price-details'))).toContainText('Price: 200,00 kr.');
  });

  it('should test cancel button', () => {
    const closeSpy = jest.spyOn(spectator.component.closeDetails, 'emit');
    spectator.click(byTestId('cancel-button'));
    expect(closeSpy).toHaveBeenCalled();
  });
});
