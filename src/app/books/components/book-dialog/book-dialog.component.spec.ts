import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookAction } from '@app/books/interfaces';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { BookDetailsComponent } from '../book-details/book-details.component';
import { BookFormComponent } from '../book-form/book-form.component';
import { BookDialogComponent } from './book-dialog.component';

describe('BookDialogComponent', () => {
  let spectator: Spectator<BookDialogComponent>;
  const createComponent = createComponentFactory({
    component: BookDialogComponent,
    imports: [MatDialogModule],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(),
          closeAll: jest.fn(),
        },
      },
    ],
    declarations: [MockComponent(BookFormComponent)],
  });

  const bookData = {
    title: 'Test Book',
    price: 20,
    pageCount: 200,
    onSale: true,
  };

  const setup = (bookAction: BookAction = 'View') => {
    spectator = createComponent({
      props: {
        bookData,
        bookAction,
      },
    });
  };

  describe('BookAction', () => {
    it('should open the dialog for creating a book', () => {
      setup('Create');
      const dialog = spectator.inject(MatDialog);
      const openSpy = jest.spyOn(dialog, 'open');

      expect(openSpy).toHaveBeenCalledWith(BookFormComponent, {
        width: '450px',
        disableClose: true,
        data: {
          bookFormData: bookData,
          onSubmit: expect.any(Function),
          onClose: expect.any(Function),
        },
      });
    });

    it('should open the dialog for editing a book', () => {
      setup('Edit');
      const dialog = spectator.inject(MatDialog);
      const openSpy = jest.spyOn(dialog, 'open');

      expect(openSpy).toHaveBeenCalledWith(BookFormComponent, expect.any(Object));
    });

    it('should open the dialog for viewing', () => {
      setup('View');
      const dialog = spectator.inject(MatDialog);
      const openSpy = jest.spyOn(dialog, 'open');

      expect(openSpy).toHaveBeenCalledWith(BookDetailsComponent, expect.any(Object));
    });
  });

  it('should emit dialogSubmit and close the dialog on submit', () => {
    setup();
    const dialog = spectator.inject(MatDialog);
    const closeAllSpy = jest.spyOn(dialog, 'closeAll');

    const submitData = {
      title: 'Submitted Book',
      price: 25,
      pageCount: 250,
      onSale: false,
    };

    const submitSpy = jest.spyOn(spectator.component.dialogSubmit, 'emit');

    spectator.component.onSubmit(submitData);

    expect(submitSpy).toHaveBeenCalledWith(submitData);
    expect(closeAllSpy).toHaveBeenCalled();
  });

  it('should emit dialogClose and close the dialog on close', () => {
    setup();
    const dialog = spectator.inject(MatDialog);
    const closeAllSpy = jest.spyOn(dialog, 'closeAll');

    const closeSpy = jest.spyOn(spectator.component.dialogClose, 'emit');

    spectator.component.onClose();

    expect(closeSpy).toHaveBeenCalled();
    expect(closeAllSpy).toHaveBeenCalled();
  });
});
