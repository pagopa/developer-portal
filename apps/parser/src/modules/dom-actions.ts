import type { Page } from "puppeteer";

const TOGGLE_SELECTORS = [
  "[data-toggle]",
  '[data-testid="accordion-toggle"]',
  "[aria-expanded]",
  ".accordion button",
  ".accordion-toggle",
  ".accordion-trigger",
  ".faq-item button",
  ".collapse-toggle",
  ".MuiButtonBase-root[aria-expanded]",
];

export async function expandInteractiveSections(page: Page): Promise<void> {
  await page.evaluate((selectors) => {
    document.querySelectorAll("details").forEach((element) => {
      (element as HTMLDetailsElement).open = true;
    });
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        const target = node as HTMLElement;
        if (!target || target.getAttribute("data-expanded") === "true") {
          return;
        }
        const ariaExpanded = target.getAttribute("aria-expanded");
        const isToggleButton =
          target.tagName === "BUTTON" ||
          target.getAttribute("role") === "button";
        const isCollapsed =
          ariaExpanded === "false" || target.classList.contains("collapsed");
        const shouldClick =
          (isToggleButton && ariaExpanded !== "true") ||
          isCollapsed ||
          selector === "[data-toggle]";
        if (shouldClick) {
          if (typeof target.click === "function") {
            target.click();
          } else {
            const event = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: true,
            });
            target.dispatchEvent(event);
          }
          target.setAttribute("data-expanded", "true");
        }
      });
    });
  }, TOGGLE_SELECTORS);
  await new Promise((resolve) => setTimeout(resolve, 250));
}
