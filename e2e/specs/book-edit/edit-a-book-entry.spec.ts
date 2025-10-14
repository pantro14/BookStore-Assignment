import { expect, test } from '@playwright/test';
import { mockApiResponse } from 'e2e/helpers/mock-api-response';

import bookListData from '../../../mocks/api-data/book/books_get_200_data.json';

test.describe('Use Case 5: Editing a book entry', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse({ page, url: '**/*/v1/books?onSale=false', data: bookListData });
  });

  test('should show a filled in dialog form', async ({ page }) => {
    await page.goto('/books/edit/xyxqwe1-23456789-345678');

    const titleInput = page.getByTestId('title-input');
    const priceInput = page.getByTestId('price-input');
    const pageCountInput = page.getByTestId('page-count-input');
    const onSaleCheckbox = page.getByTestId('on-sale-checkbox').getByRole('checkbox');

    await expect(page.getByTestId('books-table')).toBeVisible();
    await expect(page.getByTestId('book-form')).toBeVisible();

    await expect(titleInput).toHaveValue('The Forgotten Echo');
    await expect(priceInput).toHaveValue('79');
    await expect(pageCountInput).toHaveValue('412');
    await expect(onSaleCheckbox).toBeChecked();

    await expect(page.getByTestId('cancel-button')).toBeEnabled();
    await expect(page.getByTestId('submit-button')).toBeDisabled();
  });

  test('should edit a book entry', async ({ page }) => {
    await page.goto('/books/edit/xyxqwe1-23456789-345678');

    const priceInput = page.getByTestId('price-input');
    const onSaleCheckbox = page.getByTestId('on-sale-checkbox').getByRole('checkbox');
    const submitButton = page.getByTestId('submit-button');

    await priceInput.fill('80.5');
    await onSaleCheckbox.click();

    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.getByText('Book "The Forgotten Echo" edited successfully!')).toBeVisible();

    const bookTable = page.getByTestId('books-table');

    const newBookPrice = bookTable.getByText('80,50 kr.');
    await expect(newBookPrice).toBeVisible();
  });
});
