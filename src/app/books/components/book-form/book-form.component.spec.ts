import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { byTestId, createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { BookFormComponent } from './book-form.component';

describe('BookFormComponent', () => {
  let spectator: Spectator<BookFormComponent>;

  const bookFormData = {
    title: null,
    price: null,
    pageCount: null,
    onSale: false,
  };

  const createComponent = createComponentFactory({
    component: BookFormComponent,
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        bookFormData,
      },
    });
  });

  describe('bookForm - null data', () => {
    it('should initialize an empty form', () => {
      const bookForm = spectator.component.bookForm;

      expect(bookForm.value).toEqual(bookFormData);
      expect(bookForm.valid).toBeFalsy();
      expect(spectator.query(byTestId('book-form'))).toBeVisible();

      const cancelButton = spectator.query(byTestId('cancel-button')) as HTMLButtonElement;
      expect(cancelButton.disabled).toBeFalsy();

      const submitButton = spectator.query(byTestId('submit-button')) as HTMLButtonElement;
      expect(submitButton.disabled).toBeTruthy();
    });

    it('the form input fields should be invalid when empty', () => {
      const bookForm = spectator.component.bookForm;
      const titleInput = spectator.query(byTestId('title-input')) as HTMLInputElement;
      const priceInput = spectator.query(byTestId('price-input')) as HTMLInputElement;
      const pageCountInput = spectator.query(byTestId('page-count-input')) as HTMLInputElement;

      expect(titleInput.value).toBe('');
      expect(priceInput.value).toBe('');
      expect(pageCountInput.value).toBe('');

      expect(bookForm.controls['title'].valid).toBeFalsy();
      expect(bookForm.controls['price'].valid).toBeFalsy();
      expect(bookForm.controls['pageCount'].valid).toBeFalsy();

      expect(bookForm.controls['title'].errors).toEqual({ required: true });
      expect(bookForm.controls['price'].errors).toEqual({ required: true });
      expect(bookForm.controls['pageCount'].errors).toEqual({ required: true });
    });

    it('should call closeForm when the button is clicked', () => {
      const cancelButton = spectator.query(byTestId('cancel-button')) as HTMLButtonElement;
      const spyCloseForm = jest.spyOn(spectator.component.closeForm, 'emit');
      cancelButton.click();
      expect(spyCloseForm).toHaveBeenCalled();
    });
  });

  describe('bookForm - existing data', () => {
    const bookFormData = {
      title: 'Test Book',
      price: 20,
      pageCount: 200,
      onSale: true,
    };
    beforeEach(() => {
      spectator = createComponent({
        props: {
          bookFormData,
        },
      });
    });

    it('should initialize a filled in form', () => {
      const bookForm = spectator.component.bookForm;

      expect(bookForm.value).toEqual(bookFormData);
      expect(bookForm.valid).toBeTruthy();
      expect(spectator.query(byTestId('book-form'))).toBeVisible();

      const cancelButton = spectator.query(byTestId('cancel-button')) as HTMLButtonElement;
      expect(cancelButton.disabled).toBeFalsy();

      const submitButton = spectator.query(byTestId('submit-button')) as HTMLButtonElement;
      expect(submitButton.disabled).toBeTruthy();
    });

    it('should modify form data', () => {
      const bookForm = spectator.component.bookForm;

      const titleInput = spectator.query(byTestId('title-input')) as HTMLInputElement;

      spectator.typeInElement('Updated Test Book', titleInput);

      expect(bookForm.value.title).toBe('Updated Test Book');
      expect(bookForm.valid).toBeTruthy();

      const submitButton = spectator.query(byTestId('submit-button')) as HTMLButtonElement;
      expect(submitButton.disabled).toBeFalsy();
    });

    it('should call submitForm when submit button is clicked', () => {
      const priceInput = spectator.query(byTestId('price-input')) as HTMLInputElement;
      spectator.typeInElement('250', priceInput);

      const submitButton = spectator.query(byTestId('submit-button')) as HTMLButtonElement;
      const spySubmitForm = jest.spyOn(spectator.component.submitForm, 'emit');
      submitButton.click();

      expect(spySubmitForm).toHaveBeenCalled();
    });
  });

  describe('bookForm - validations', () => {
    let bookForm: FormGroup;

    beforeEach(() => {
      bookForm = spectator.component.bookForm;
    });

    const validateForm = () => {
      expect(bookForm.valid).toBeFalsy();
      const submitButton = spectator.query(byTestId('submit-button')) as HTMLButtonElement;
      expect(submitButton.disabled).toBeTruthy();
    };

    it('should show validation errors for the title', () => {
      const titleInput = spectator.query(byTestId('title-input')) as HTMLInputElement;

      // Title field validations
      spectator.typeInElement('   ', titleInput);
      expect(bookForm.controls['title'].errors).toEqual({ required: true });

      spectator.typeInElement('سلطان', titleInput);
      expect(bookForm.controls['title'].errors).toEqual({ invalidTitle: true });

      validateForm();
    });

    it('should show validation errors for the price', () => {
      const priceInput = spectator.query(byTestId('price-input')) as HTMLInputElement;

      spectator.typeInElement('-10', priceInput);
      expect(bookForm.controls['price'].errors).toEqual({ min: { min: 0.01, actual: -10 } });

      spectator.typeInElement('0', priceInput);
      expect(bookForm.controls['price'].errors).toEqual({ min: { min: 0.01, actual: 0 } });

      validateForm();
    });

    it('should show validation errors for the page count', () => {
      const pageCountInput = spectator.query(byTestId('page-count-input')) as HTMLInputElement;

      spectator.typeInElement('0', pageCountInput);
      expect(bookForm.controls['pageCount'].errors).toEqual({ min: { min: 1, actual: 0 } });

      spectator.typeInElement('-5', pageCountInput);
      expect(bookForm.controls['pageCount'].errors).toEqual({
        min: { min: 1, actual: -5 },
        pattern: { actualValue: -5, requiredPattern: '^[0-9]+$' },
      });

      validateForm();
    });
  });
});
