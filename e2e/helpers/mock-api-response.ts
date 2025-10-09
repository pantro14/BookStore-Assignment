import { Page } from '@playwright/test';

export async function mockApiResponse(page: Page, url: string, data: Object) {
  await page.route(url, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data),
    });
  });
}
