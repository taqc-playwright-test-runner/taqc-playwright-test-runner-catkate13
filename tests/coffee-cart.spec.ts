import { test, expect } from '@playwright/test';

// App under test: Coffee Cart — https://seleniumbase.io/coffee/
// Routes: menu — /coffee/, cart — /coffee/cart
//
// This file is a structural skeleton only. Test bodies are intentionally
// left as test.skip(true, 'TODO: ...') placeholders — no locators or
// expect() assertions are implemented yet. Replace each TODO with the
// real steps/assertions described in the comment.

test.describe('Coffee Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/coffee/');
  });

  test('Smoke: menu loads with drinks list and Total button @smoke', async ({ page }) => {
    const cups = page.locator('.cup');
    const checkoutButton = page.locator('[data-test="checkout"]');

    await expect(cups).toHaveCount(9);
    await expect(page.getByLabel('Espresso', { exact: true })).toBeVisible();
    await expect(checkoutButton).toBeVisible();
  });

  test('Adding two different drinks updates the header cart counter and Total', async ({
    page,
  }) => {
    await page.getByLabel('Espresso', { exact: true }).click();
    await page.getByLabel('Cappuccino', { exact: true }).click();

    const cartLink = page.getByRole('link', { name: /cart/i });

    await expect(cartLink).toBeVisible();
    await expect(cartLink).toHaveText(/cart\s*\(2\)/i);

    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $29.00');
  });

  test('Cart page lists exactly the added items', async ({ page }) => {
    await page.getByLabel('Espresso', { exact: true }).click();
    await page.getByLabel('Cappuccino', { exact: true }).click();

    await page.getByRole('link', { name: /cart/i }).click();

    const cartItems = page.getByRole('listitem').filter({
      has: page.getByRole('button', { name: /^Remove all / }),
    });

    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.filter({ hasText: 'Espresso' })).toHaveCount(1);
    await expect(cartItems.filter({ hasText: 'Cappuccino' })).toHaveCount(1);
  });

  test('Increasing item quantity on the cart page updates counter and Total', async ({ page }) => {
    await page.getByLabel('Espresso', { exact: true }).click();
    await page.getByRole('link', { name: /cart/i }).click();

    await page
      .getByRole('button', {
        name: 'Add one Espresso',
        exact: true,
      })
      .click();

    await expect(page.getByRole('link', { name: /cart/i })).toHaveText(/cart\s*\(2\)/i);

    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $20.00');
  });

  test('Empty cart shows no items on a fresh session', async ({ page }) => {
    await page.getByRole('link', { name: /cart/i }).click();

    const cartItems = page.getByRole('listitem').filter({
      has: page.getByRole('button', { name: /^Remove all / }),
    });

    await expect(page.getByRole('link', { name: /cart/i })).toHaveText(/cart\s*\(0\)/i);

    await expect(cartItems).toHaveCount(0);
  });

  test('Payment modal shows Name, Email and Submit', async ({ page }) => {
    await page.getByLabel('Espresso', { exact: true }).click();
    await page
      .getByRole('button', {
        name: 'Proceed to checkout',
        exact: true,
      })
      .click();

    const modal = page.locator('.modal-content').filter({
      has: page.getByRole('heading', { name: 'Payment details', exact: true }),
    });

    await expect(modal).toBeVisible();

    await expect.soft(modal.getByLabel('Name', { exact: true })).toBeVisible();

    await expect.soft(modal.getByLabel('Email', { exact: true })).toBeVisible();

    await expect.soft(modal.getByRole('button', { name: 'Submit', exact: true })).toBeVisible();
  });

  test.describe('Optional', () => {
    test('Promo dialog after a 3rd drink is dismissed with No', async () => {
      test.skip(
        true,
        'TODO (bonus): add 3 drinks so the promo dialog appears, click "No", ' +
          'then assert the scenario completes (e.g. cart still has 3 items)',
      );
    });

    test('Completed payment form shows a success message', async () => {
      test.skip(
        true,
        'TODO (bonus): open the payment modal, fill Name and Email, click Submit, ' +
          'assert a success message/state appears',
      );
    });

    test('Skipped on a specific browser with a documented reason', async ({ browserName }) => {
      test.skip(
        browserName === 'webkit',
        'webkit project is disabled in playwright.config.ts for this assignment',
      );
      test.skip(true, 'TODO (bonus): implement the real assertions for this scenario');
    });

    test('Annotated with a tracking issue', async () => {
      const issueUrl = 'https://example.com/issues/123';
      test.info().annotations.push({ type: 'issue', description: issueUrl });
      test.skip(true, 'TODO (bonus): implement the real assertions for this scenario');
    });
  });
});
