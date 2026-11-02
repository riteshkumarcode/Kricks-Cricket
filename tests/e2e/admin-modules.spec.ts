import { test, expect } from "@playwright/test";

test.describe("Admin Modules & Workflows (Phase 5)", () => {
  test.describe.configure({ mode: "serial" });

  test("Module Navigation & Layout across viewports (375px, 768px, 1440px)", async ({
    page,
  }) => {
    const viewports = [
      { name: "Desktop", width: 1440, height: 900 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Mobile", width: 375, height: 812 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/admin");
      await expect(page.locator("h1")).toContainText(/store overview/i);

      if (vp.width >= 1100) {
        await expect(page.locator("aside")).toBeVisible();
      } else if (vp.width < 768) {
        await expect(
          page.locator("nav[aria-label='Mobile admin bottom tabs']")
        ).toBeVisible();
      }
    }
  });

  test("Verify 27 Admin Modules Load Cleanly", async ({ page }) => {
    page.setViewportSize({ width: 1440, height: 900 });

    const routes = [
      { path: "/admin", heading: /store overview/i },
      { path: "/admin/orders", heading: /orders/i },
      { path: "/admin/products", heading: /products/i },
      { path: "/admin/products/new", heading: /create new product/i },
      { path: "/admin/categories", heading: /categories/i },
      { path: "/admin/custom-builder", heading: /custom bat builder/i },
      { path: "/admin/home-builder", heading: /home page builder/i },
      { path: "/admin/navigation", heading: /navigation/i },
      { path: "/admin/pages", heading: /pages/i },
      { path: "/admin/customers", heading: /customers/i },
      { path: "/admin/abandoned-carts", heading: /abandoned carts/i },
      { path: "/admin/bulk-enquiries", heading: /club enquiries/i },
      { path: "/admin/bulk-pricing", heading: /bulk pricing tiers/i },
      { path: "/admin/messages", heading: /contact messages/i },
      { path: "/admin/reviews", heading: /product reviews/i },
      { path: "/admin/discounts", heading: /discounts/i },
      { path: "/admin/newsletter", heading: /newsletter/i },
      { path: "/admin/currencies", heading: /currencies/i },
      { path: "/admin/shipping", heading: /shipping zones/i },
      { path: "/admin/taxes", heading: /taxes & gst/i },
      { path: "/admin/payments", heading: /payment gateways/i },
      { path: "/admin/media", heading: /media library/i },
      { path: "/admin/seo", heading: /seo/i },
      { path: "/admin/settings", heading: /store settings/i },
      { path: "/admin/email-templates", heading: /email templates/i },
      { path: "/admin/staff", heading: /staff/i },
      { path: "/admin/activity-log", heading: /activity log/i },
      { path: "/admin/backups", heading: /backups/i },
    ];

    for (const r of routes) {
      await page.goto(r.path);
      await expect(page.locator("h1")).toContainText(r.heading);
    }
  });

  test("End-to-End: Custom bat order -> Order appears in admin with custom spec -> Admin updates status to SHIPPED with tracking", async ({
    page,
  }) => {
    page.setViewportSize({ width: 1440, height: 900 });

    // 1. Configure custom bat on storefront
    await page.goto("/custom-bat");
    await page.fill("#batName", "KOHLI");
    await page.fill("#batNum", "18");
    await page.click("button:has-text('Add customised bat to cart')");

    // 2. Go to checkout
    await page.goto("/checkout");
    await expect(page.locator("h1")).toContainText(/checkout/i);

    await page.fill("input[name='fullName']", "Virat Kohli");
    await page.fill("input[name='email']", "virat.kohli@india.in");
    await page.fill("input[name='phone']", "9811122334");
    await page.fill("input[name='street']", "42 Civil Lines");
    await page.fill("input[name='city']", "New Delhi");
    await page.fill("input[name='postalCode']", "110054");

    // Select COD / test payment and place order
    await page.click("label:has-text('Cash on Delivery (COD)')");
    await page.click("button:has-text('Place Order')");

    // 3. Lands on order confirmation page
    await expect(page).toHaveURL(/order-success\/KC-/);
    const orderNumber = (await page.locator("h1").innerText()).match(/KC-[A-Z0-9]+/)?.[0];
    expect(orderNumber).toBeDefined();

    // 4. Order appears in admin panel
    await page.goto("/admin/orders");
    await expect(page.locator(`text=${orderNumber}`)).toBeVisible();

    // 5. Open order detail
    await page.click(`text=${orderNumber}`);
    await expect(page.locator("h1")).toContainText(orderNumber!);

    // Verify custom bat specifications (Name KOHLI and Number #18) are visible in workshop sheet
    await expect(page.locator("text=KOHLI")).toBeVisible();
    await expect(page.locator("text=#18")).toBeVisible();

    // 6. Update order status to SHIPPED with tracking number
    await page.selectOption("select", "SHIPPED");
    await page.fill("input[placeholder='e.g. BD-89104820']", "BD-778899");
    await page.click("button:has-text('Update Order')");

    // Check toast
    await expect(page.locator("text=Order updated: Status is now SHIPPED")).toBeVisible();

    // 7. Verify customer sees tracking on order confirmation page
    await page.goto(`/order-success/${orderNumber}`);
    await expect(page.locator("text=SHIPPED")).toBeVisible();
    await expect(page.locator("text=BD-778899")).toBeVisible();
  });

  test("Admin edits a hero slide -> Storefront shows change after publish", async ({
    page,
  }) => {
    page.setViewportSize({ width: 1440, height: 900 });

    // 1. Go to Home Builder
    await page.goto("/admin/home-builder");
    await expect(page.locator("h1")).toContainText(/home page builder/i);

    // 2. Change headline line 1 of Slide 1
    const testHeadline = "CHAMPIONSHIP BLADES";
    await page.locator("input").nth(3).fill(testHeadline);

    // 3. Publish to storefront
    await page.click("button:has-text('Publish to Storefront')");
    await expect(page.locator("text=Home page blocks published to storefront!")).toBeVisible();

    // 4. Visit storefront homepage and verify new headline renders
    await page.goto("/");
    await expect(page.locator(".hero .hl")).toContainText(testHeadline);
  });

  test("Admin changes a product price -> Storefront and cart reflect it", async ({
    page,
  }) => {
    page.setViewportSize({ width: 1440, height: 900 });

    // 1. Go to product edit page for pro-edition
    await page.goto("/admin/products/pro-edition");
    await expect(page.locator("h1")).toContainText(/edit/i);

    // 2. Change selling price to 29999 (₹29,999)
    await page.locator("input[type='number']").first().fill("29999");
    await page.click("button:has-text('Save Product')");

    // Wait for redirect to products list
    await expect(page).toHaveURL(/\/admin\/products/);

    // 3. Visit storefront product page
    await page.goto("/product/pro-edition");
    await expect(page.locator("text=29,999")).toBeVisible();

    // 4. Add to cart and check cart reflects the new price
    await page.click("button:has-text('Add to Cart')");
    await page.goto("/cart");
    await expect(page.locator("text=29,999").first()).toBeVisible();
  });
});

