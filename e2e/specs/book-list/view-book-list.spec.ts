import { expect, test } from '@playwright/test';
import { mockApiResponse } from 'e2e/helpers/mock-api-response';

import data from '../../../mocks/api-data/book/books_get_200_data.json';

test.describe('Use Case 1: viewing all books ', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse({ page, url: '**/*/v1/books?onSale=false', data });
  });

  test('should show the book table', async ({ page }) => {
    await page.goto('/');

    const bookItems = await page.getByTestId('book-item');

    await expect(page).toHaveTitle(/BookStore/);
    await expect(page.getByTestId('card-title')).toHaveText('Bogliste');
    await expect(page.getByTestId('new-book-button')).toHaveText('Ny bog');
    await expect(page.getByTestId('on-sale-book-toggle')).toHaveText('På tilbud');
    await expect(page.getByTestId('books-table')).toBeVisible();
    await expect(page.getByTestId('paginator')).toBeVisible();
    await expect(bookItems).toHaveCount(10);
  });

  test('should display: title, price, sale status and action buttons.', async ({ page }) => {
    await page.goto('/');

    const bookItems = await page.getByTestId('book-item');

    await expect(bookItems.nth(0)).toHaveText(/The Forgotten Echo/);
    await expect(bookItems.nth(0)).toHaveText(/79,00 kr./);
    await expect(bookItems.nth(0)).toHaveText(/Ja/);
    await expect(bookItems.nth(0).getByRole('button', { name: 'edit' })).toBeVisible();
    await expect(bookItems.nth(0).getByRole('button', { name: 'delete' })).toBeVisible();
  });
});
