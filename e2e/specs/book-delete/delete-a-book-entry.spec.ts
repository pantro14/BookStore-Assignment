import { expect, test } from '@playwright/test';
import { mockApiResponse } from 'e2e/helpers/mock-api-response';

import bookListData from '../../../mocks/api-data/book/books_get_200_data.json';

test.describe('Use Case 6: Deleting a book entry', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse({ page, url: '**/*/v1/books?onSale=false', data: bookListData });
  });

  test('should delete a book entry', async ({ page }) => {
    await page.goto('/books/delete/xyxqwe1-23456789-345678');

    const deleteButton = page.getByTestId('delete-button');

    await expect(deleteButton).toBeEnabled();
    await deleteButton.click();

    await expect(page.getByText('Book "The Forgotten Echo" deleted successfully!')).toBeVisible();

    const bookTable = page.getByTestId('books-table');

    const bookTitle = bookTable.getByText('The Forgotten Echo');
    await expect(bookTitle).not.toBeVisible();
  });
});
