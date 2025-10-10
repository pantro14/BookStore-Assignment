import { Page } from '@playwright/test';
export type MockApiResponseParams = {
  page: Page;
  url: string;
  data: Object;
};
export async function mockApiResponse({ page, url, data }: MockApiResponseParams) {
  await page.route(url, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data),
    });
  });
}
