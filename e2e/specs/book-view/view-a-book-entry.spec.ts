import { expect, test } from '@playwright/test';
import { mockApiResponse } from 'e2e/helpers/mock-api-response';

import bookListData from '../../../mocks/api-data/book/books_get_200_data.json';

test.describe('Use Case 3: View specific book entry', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse({ page, url: '**/*/v1/books?onSale=false', data: bookListData });
  });

  test('should show a book dialog details', async ({ page }) => {
    await page.goto('/books/view/xyxqwe1-23456789-345678');

    const title = page.getByTestId('title-details');
    const onSale = page.getByTestId('on-sale-details');
    const price = page.getByTestId('price-details');
    const pageCount = page.getByTestId('page-count-details');

    await expect(title).toBeVisible();
    await expect(onSale).toBeVisible();
    await expect(price).toBeVisible();
    await expect(pageCount).toBeVisible();
    await expect(title).toHaveText('The Forgotten Echo');
    await expect(onSale).toHaveText('På tilbud: Ja');
    await expect(pageCount).toHaveText('Sidetal: 412');
    await expect(price).toHaveText('Pris: 79,00 kr.');
    await expect(page.getByTestId('cancel-button')).toBeEnabled();
  });
});
