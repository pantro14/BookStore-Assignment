import { expect, test } from '@playwright/test';
import { mockApiResponse } from 'e2e/helpers/mock-api-response';

import data from '../../../mocks/api-data/book/books_get_200_empty-list_data.json';

test.describe('Use Case 1: viewing all books ', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, '**/book-store-bff/v1/books?onSale=false', data);
  });

  test('should display: title, price, sale status and action buttons.', async ({ page }) => {
    await page.goto('/');

    const bookItems = await page.getByTestId('book-item');

    await expect(bookItems).toHaveCount(0);
  });
});
