import { expect, test } from '@playwright/test';

test.describe('Use Case 1: viewing all books ', () => {
  test('should display: title, price, sale status and action buttons.', async ({ page }) => {
    ngApimock.selectScenario('Get list of all books', 'return-empty-list');
    await page.goto('/');

    const bookItems = await page.getByTestId('book-item');

    await expect(bookItems).toHaveCount(10);
    await expect(bookItems.nth(0)).toHaveText(/The Forgotten Echo/);
    await expect(bookItems.nth(0)).toHaveText(/79,00 kr./);
    await expect(bookItems.nth(0)).toHaveText(/Yes/);
    await expect(bookItems.nth(0).getByRole('button', { name: 'edit' })).toBeVisible();
    await expect(bookItems.nth(0).getByRole('button', { name: 'delete' })).toBeVisible();
  });
});
