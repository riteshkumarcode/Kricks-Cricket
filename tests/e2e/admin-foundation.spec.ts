import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "Mobile", width: 375, height: 812 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1440, height: 900 },
];

for (const vp of VIEWPORTS) {
  test.describe(`Admin Shell on ${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("renders admin login page cleanly", async ({ page }) => {
      await page.goto("/admin/login");
      await expect(page.locator("h1")).toContainText(/kricks staff portal/i);
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
      await expect(page.locator("button[type='submit']")).toBeVisible();
    });

    test("renders admin dashboard and navigation elements", async ({ page }) => {
      await page.goto("/admin");
      await expect(page.locator("h1")).toContainText(/store overview/i);

      if (vp.width >= 1100) {
        // Desktop fixed sidebar should be visible
        await expect(page.locator("aside")).toBeVisible();
        await expect(page.locator("header")).toBeVisible();
      } else if (vp.width < 768) {
        // Mobile bottom tabs should be visible
        await expect(page.locator("nav[aria-label='Mobile admin bottom tabs']")).toBeVisible();
      }
    });
  });
}
