import { expect, test } from '@playwright/test';
import { mockApiResponse } from 'e2e/helpers/mock-api-response';

import bookListData from '../../../mocks/api-data/book/books_get_200_data.json';

test.describe('Use Case 4: Create a new book entry ', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse({ page, url: '**/*/v1/books?onSale=false', data: bookListData });
  });

  test('should show dialog form', async ({ page }) => {
    await page.goto('/books/new');

    await expect(page.getByTestId('books-table')).toBeVisible();
    await expect(page.getByTestId('book-form')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeDisabled();
    await expect(page.getByTestId('cancel-button')).toBeVisible();
    await expect(page.getByTestId('cancel-button')).toBeEnabled();
  });

  test('should show dialog form errors', async ({ page }) => {
    await page.goto('/books/new');

    const titleInput = page.getByTestId('title-input');
    const priceInput = page.getByTestId('price-input');
    const pageCountInput = page.getByTestId('page-count-input');
    const onSaleCheckbox = page.getByTestId('on-sale-checkbox').getByRole('checkbox');
    const submitButton = page.getByTestId('submit-button');

    await titleInput.fill('');
    await priceInput.fill('-1');
    await pageCountInput.fill('0');
    await onSaleCheckbox.click();

    await expect(page.getByText('Title is required.')).toBeVisible();
    await expect(page.getByText('Price must be at least 0.01.')).toBeVisible();
    await expect(page.getByText('Page count must be at least 1.')).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });

  test('should create a new book entry', async ({ page }) => {
    await page.goto('/books/new');

    const titleInput = page.getByTestId('title-input');
    const priceInput = page.getByTestId('price-input');
    const pageCountInput = page.getByTestId('page-count-input');
    const onSaleCheckbox = page.getByTestId('on-sale-checkbox').getByRole('checkbox');
    const submitButton = page.getByTestId('submit-button');
    const nextPageButton = page.locator('button[aria-label="Next page"]');

    await titleInput.fill('The Great Gatsby');
    await priceInput.fill('10.99');
    await pageCountInput.fill('180');
    await onSaleCheckbox.click();

    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.getByText('Book "The Great Gatsby" added successfully!')).toBeVisible();

    await nextPageButton.click();

    const bookTable = page.getByTestId('books-table');

    const newBookTitle = bookTable.getByText('The Great Gatsby');
    await expect(newBookTitle).toBeVisible();
    const newBookPrice = bookTable.getByText('10,99 kr.');
    await expect(newBookPrice).toBeVisible();
  });
});
