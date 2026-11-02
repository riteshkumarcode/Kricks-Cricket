import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "Mobile", width: 375, height: 812 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1440, height: 900 },
];

for (const vp of VIEWPORTS) {
  test.describe(`Checkout & Orders on ${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("Completes full checkout journey with test payment authorization", async ({
      page,
    }) => {
      // 1. Add product to cart
      await page.goto("/product/pro-edition");
      await page.locator("button.btn:has-text('Add to cart')").click();

      // 2. Go to Checkout
      await page.goto("/checkout");
      await expect(page.locator("h1")).toContainText(/checkout/i);

      // 3. Fill Contact Information
      await page.locator("#c-name").fill("Jasprit Bumrah");
      await page.locator("#c-email").fill("jasprit@example.com");
      await page.locator("#c-phone").fill("+91 98765 00099");

      // 4. Fill Address
      await page.locator("#c-street").fill("99 Yorker Boulevard");
      await page.locator("#c-city").fill("Ahmedabad");
      await page.locator("#c-state").fill("Gujarat");
      await page.locator("#c-pin").fill("380001");

      // 5. Apply Promo Code
      await page.locator("#chk-coupon").fill("WELCOME10");
      await page.locator("button:has-text('Apply')").click();
      await expect(page.locator("body")).toContainText(/welcome10 applied/i);

      // 6. Submit Order Form
      await page.locator("#place-order-btn").click();

      // 7. Test Payment Modal opens
      await expect(page.locator("#confirm-test-pay-btn")).toBeVisible();
      await page.locator("#confirm-test-pay-btn").click();

      // 8. Redirect to Order Success page
      await page.waitForURL(/\/order-success\/KRC-/);
      await expect(page.locator("h1")).toContainText(/thank you, jasprit bumrah/i);

      // Verify order elements
      await expect(page.locator("#confirmed-total")).toBeVisible();
      await expect(page.locator("body")).toContainText(/order status/i);

      // Open tax invoice modal
      await page.locator("button:has-text('View Tax Invoice')").click();
      await expect(page.locator("text=07AABCK9876Q1Z9")).toBeVisible();
      await expect(page.locator("text=95069920").first()).toBeVisible();
    });

    test("Places Cash on Delivery (COD) order successfully", async ({ page }) => {
      // Add custom bat to cart
      await page.goto("/custom-bat");
      await page.locator("#add").click();

      // Navigate to checkout
      await page.goto("/checkout");

      // Fill address for domestic COD
      await page.locator("#c-name").fill("Hardik Pandya");
      await page.locator("#c-email").fill("hardik@example.com");
      await page.locator("#c-phone").fill("+91 99887 76655");
      await page.locator("#c-street").fill("33 All-Rounder Heights");
      await page.locator("#c-city").fill("Vadodara");
      await page.locator("#c-state").fill("Gujarat");
      await page.locator("#c-pin").fill("390001");

      // Select COD
      await page.locator("input[value='COD']").check();

      // Submit
      await page.locator("#place-order-btn").click();

      // Direct success redirect for COD
      await page.waitForURL(/\/order-success\/KRC-/);
      await expect(page.locator("h1")).toContainText(/thank you, hardik pandya/i);
    });

    test("Customer account page lists placed orders", async ({ page }) => {
      await page.goto("/account");
      await expect(page.locator("h1")).toContainText(/my account/i);
      await expect(page.locator("body")).toContainText(/recent orders/i);
    });
  });
}
