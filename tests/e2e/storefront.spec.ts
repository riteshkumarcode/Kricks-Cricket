import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "Mobile", width: 375, height: 812 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1440, height: 900 },
];

for (const vp of VIEWPORTS) {
  test.describe(`Storefront on ${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("Home page renders hero, categories, bestsellers, custom teaser, and size finder", async ({
      page,
    }) => {
      await page.goto("/");

      // Header logo & nav
      await expect(page.locator("header#hdr")).toBeVisible();
      await expect(page.locator(".word")).toContainText(/kricks/i);

      // Hero slider
      await expect(page.locator(".hero")).toBeVisible();
      await expect(page.locator(".hero .hl")).toContainText(/built for/i);

      // Category grid
      await expect(page.locator(".cats")).toBeVisible();
      await expect(page.locator(".cats")).toContainText(/leather bats/i);
      await expect(page.locator(".cats")).toContainText(/tennis bats/i);
      await expect(page.locator(".cats")).toContainText(/accessories/i);

      // Bestsellers rail
      await expect(page.locator("#rail")).toBeVisible();
      await expect(page.locator("#bestT")).toContainText(/bestsellers/i);

      // Custom bat teaser
      await expect(page.locator("section.custom")).toBeVisible();
      await expect(page.locator("section.custom h2")).toContainText(/your name/i);

      // Bat size finder
      await expect(page.locator("section.sizer")).toBeVisible();
      await expect(page.locator("#height")).toBeVisible();

      // Footer
      await expect(page.locator("footer#ftr")).toBeVisible();
      await expect(page.locator(".f-word")).toContainText(/kricks/i);
    });

    test("Category page (/leather-bats) filters products and renders buying guide", async ({
      page,
    }) => {
      await page.goto("/leather-bats");

      await expect(page.locator("h1")).toContainText(/leather bats/i);
      const tiles = page.locator(".tiles .tile");
      await expect(tiles).toHaveCount(6);

      // Click "Grade 1" filter
      await page.locator("button.opt:has-text('Grade 1')").click();
      const filteredTiles = page.locator(".tiles .tile");
      await expect(filteredTiles).toHaveCount(2);

      // Reset to "All"
      await page.locator("button.opt:has-text('All')").click();
      await expect(page.locator(".tiles .tile")).toHaveCount(6);

      // Buying guide is present
      await expect(page.locator(".guide")).toBeVisible();
      await expect(page.locator(".guide h2")).toContainText(/which grade of willow\?/i);
    });

    test("Product detail page (/product/pro-edition) handles gallery, options, and cart addition", async ({
      page,
    }) => {
      await page.goto("/product/pro-edition");

      // Check product title and price
      await expect(page.locator("h1")).toContainText(/pro edition/i);
      await expect(page.locator(".pr.price")).toBeVisible();

      // Gallery view switching
      const backBtn = page.locator(".thumbs button[aria-label='Back view']");
      if (await backBtn.isVisible()) {
        await backBtn.click();
        await expect(backBtn).toHaveAttribute("aria-pressed", "true");
      }

      // Engrave name
      const engInput = page.locator("#eng");
      if (await engInput.isVisible()) {
        await engInput.fill("KOHLI");
        await expect(engInput).toHaveValue("KOHLI");
      }

      // Add to cart
      const addBtn = page.locator("button.btn:has-text('Add to cart')");
      await expect(addBtn).toBeVisible();
      await addBtn.click();

      // Cart badge bumps/updates
      const cartBadge = page.locator(".cartbtn b");
      await expect(cartBadge).not.toHaveText("0");
    });

    test("Custom bat builder (/custom-bat) configures bat and calculates dynamic price", async ({
      page,
    }) => {
      await page.goto("/custom-bat");

      await expect(page.locator("h1")).toContainText(/build your bat/i);

      // Stage SVG is rendered
      await expect(page.locator(".stage svg")).toBeVisible();

      // Select Grade 2 willow
      const g2Btn = page.locator("button.opt:has-text('Grade 2 English')");
      await g2Btn.click();
      await expect(g2Btn).toHaveAttribute("aria-pressed", "true");

      // Enter name engraving
      const nameInput = page.locator("#nm");
      await nameInput.fill("DHONI");

      // Enter lucky number
      const numInput = page.locator("#no");
      await numInput.fill("07");

      // Total price is displayed
      await expect(page.locator("#tot")).toBeVisible();

      // Add to cart button adds to cart
      await page.locator("#add").click();
      const cartBadge = page.locator(".cartbtn b");
      await expect(cartBadge).not.toHaveText("0");
    });

    test("Shopping cart (/cart) updates line items and displays sticky order summary", async ({
      page,
    }) => {
      await page.goto("/cart");

      await expect(page.locator("h1")).toContainText(/your cart/i);

      // Order summary exists
      await expect(page.locator("aside#sum")).toBeVisible();
      await expect(page.locator("aside#sum h2")).toContainText(/order summary/i);
    });

    test("Contact page (/contact) validates and submits enquiry", async ({ page }) => {
      await page.goto("/contact");

      await expect(page.locator("h1")).toContainText(/contact us/i);

      // Fill form
      await page.locator("#n").fill("Sachin Tendulkar");
      await page.locator("#e").fill("sachin@example.com");
      await page.locator("#m").fill("Looking for bespoke bat advice.");

      // Submit
      await page.locator("#form button[type='submit']").click();

      // Thank you card appears
      await expect(page.locator(".thanks")).toBeVisible();
      await expect(page.locator(".thanks")).toContainText(/thanks, sachin/i);
    });

    test("Bulk enquiry page (/bulk-enquiry) calculates tiered estimate and submits", async ({
      page,
    }) => {
      await page.goto("/bulk-enquiry");

      await expect(page.locator("h1")).toContainText(/bulk enquiry/i);

      // Estimator slider
      const slider = page.locator("#bq");
      await expect(slider).toBeVisible();
      await slider.fill("50");

      // Check discount note reflects 15% off for 50 bats
      await expect(page.locator("#bnote")).toContainText(/15% off/i);

      // Fill enquiry form
      await page.locator("#club").fill("Mumbai Cricket Association");
      await page.locator("#ctry").fill("India");
      await page.locator("#n").fill("Rohit Sharma");
      await page.locator("#e").fill("rohit@example.com");

      // Submit
      await page.locator("#form button[type='submit']").click();

      // Thank you card appears
      await expect(page.locator(".thanks")).toBeVisible();
      await expect(page.locator(".thanks")).toContainText(/thanks, mumbai cricket association/i);
    });

    if (vp.width < 768) {
      test("Mobile navigation opens with circle reveal and toggles submenus", async ({
        page,
      }) => {
        await page.goto("/");

        const burger = page.locator("button.burger");
        await expect(burger).toBeVisible();
        await burger.click();

        // Mobile nav should now be open
        const mnav = page.locator("#mnav");
        await expect(mnav).toHaveClass(/open/);

        // Submenu toggle '+' expands sublinks
        const subToggle = mnav.locator("button.mx").first();
        await subToggle.click();
        await expect(mnav.locator(".msub").first()).toBeVisible();

        // Close burger
        await burger.click();
        await expect(mnav).not.toHaveClass(/open/);
      });
    }
  });
}
