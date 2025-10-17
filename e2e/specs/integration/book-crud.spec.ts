import { expect, test } from '@playwright/test';
import { mockApiResponse } from 'e2e/helpers/mock-api-response';

import bookListData from '../../../mocks/api-data/book/books_get_200_data.json';

test.describe('Happy flow: book creation and edition at once', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse({ page, url: '**/*/v1/books?onSale=false', data: bookListData });
  });

  test('should create, view, edit and delete a book', async ({ page }) => {
    await page.goto('/');

    const addBookButton = page.getByTestId('new-book-button');
    const titleInput = page.getByTestId('title-input');
    const priceInput = page.getByTestId('price-input');
    const pageCountInput = page.getByTestId('page-count-input');
    const onSaleCheckbox = page.getByTestId('on-sale-checkbox').getByRole('checkbox');
    const submitButton = page.getByTestId('submit-button');
    const nextPageButton = page.locator('button[aria-label="Næste side"]');

    await addBookButton.click();

    await titleInput.fill('The lord of the rings');
    await priceInput.fill('100.99');
    await pageCountInput.fill('700');
    await onSaleCheckbox.click();
    await submitButton.click();

    await expect(page.getByText('Bogen "The lord of the rings" blev tilføjet med succes!')).toBeVisible();

    await nextPageButton.click();

    const bookTable = page.getByTestId('books-table');
    const bookName = bookTable.getByText('The lord of the rings');

    await expect(bookName).toBeVisible();
    await expect(bookTable.getByText('100,99 kr.')).toBeVisible();

    await bookName.click();
    await expect(page.getByTestId('book-details')).toBeVisible();
    const cancelView = page.getByTestId('cancel-button');
    await expect(cancelView).toBeVisible();
    await cancelView.click();

    const editButton = bookTable.getByTitle('Edit Book').nth(9);
    await editButton.click();

    await expect(page.getByTestId('book-form')).toBeVisible();

    await titleInput.fill('The lord of the rings delux edition');
    await priceInput.fill('150.50');
    await pageCountInput.fill('800');
    await onSaleCheckbox.click();
    await submitButton.click();

    await expect(
      page.getByText('Bogen "The lord of the rings delux edition" blev redigeret med succes!')
    ).toBeVisible();

    const deleteBook = bookTable.getByTitle('Delete Book').nth(9);
    await deleteBook.click();

    await expect(page.getByTestId('book-delete')).toBeVisible();
    const deleteButton = page.getByTestId('delete-button');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
  });
});
