import { expect, test } from '@playwright/test';

test.describe('Use Case 1: viewing all books ', () => {
  test('should show the book table', async ({ page }) => {
    await page.goto('/');

    const bookItems = await page.getByTestId('book-item');

    await expect(page).toHaveTitle(/BookStore/);
    await expect(page.getByTestId('card-title')).toHaveText('Books');
    await expect(page.getByTestId('new-book-button')).toHaveText('New Book');
    await expect(page.getByTestId('on-sale-book-toggle')).toHaveText('On Sale');
    await expect(page.getByTestId('books-table')).toBeVisible();
    await expect(page.getByTestId('paginator')).toBeVisible();
    await expect(bookItems).toHaveCount(10);
  });

  test('should display: title, price, sale status and action buttons.', async ({ page }) => {
    await page.goto('/');

    const bookItems = await page.getByTestId('book-item');

    await expect(bookItems.nth(0)).toHaveText(/The Forgotten Echo/);
    await expect(bookItems.nth(0)).toHaveText(/79,00 kr./);
    await expect(bookItems.nth(0)).toHaveText(/Yes/);
    await expect(bookItems.nth(0).getByRole('button', { name: 'edit' })).toBeVisible();
    await expect(bookItems.nth(0).getByRole('button', { name: 'delete' })).toBeVisible();
  });
});
