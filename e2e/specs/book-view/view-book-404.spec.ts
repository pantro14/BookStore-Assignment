import { expect, test } from '@playwright/test';
import { mockApiResponse } from 'e2e/helpers/mock-api-response';

import bookListData from '../../../mocks/api-data/book/books_get_200_data.json';

test.describe('Edge case: view book not found', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse({ page, url: '**/*/v1/books?onSale=false', data: bookListData });
  });

  test('should show book not found snackbar', async ({ page }) => {
    await page.goto('/books/view/no-id');

    await expect(page.getByText('The Book was not found')).toBeVisible();
  });
});
