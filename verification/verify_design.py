from playwright.sync_api import Page, expect, sync_playwright
import time

def test_design(page: Page):
  page.set_viewport_size({"width": 375, "height": 812}) # iPhone X size
  page.goto("http://localhost:8081")

  # Wait for matches to load
  expect(page.get_by_text("VIEW ANALYSIS").first).to_be_visible(timeout=15000)

  # Screenshot Home
  page.screenshot(path="/home/jules/verification/home_design.png")

  # Click first match
  page.get_by_text("VIEW ANALYSIS").first.click()

  # Wait for detail
  expect(page.get_by_text("AI Reasoning")).to_be_visible(timeout=10000)

  # Screenshot Detail
  page.screenshot(path="/home/jules/verification/detail_design.png")

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
      test_design(page)
    finally:
      browser.close()
