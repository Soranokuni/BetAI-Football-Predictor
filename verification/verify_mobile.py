from playwright.sync_api import Page, expect, sync_playwright

def test_matches_display(page: Page):
  # 1. Arrange: Go to the mobile web app.
  page.goto("http://localhost:8081")

  # 2. Act: Wait for the matches to load.
  # The matches should be visible after loading.
  # We look for "VS" text or team names.
  # Wait for loader to disappear (optional, but good practice)
  # Expect "BetAI" to be visible
  expect(page.get_by_text("BetAI")).to_be_visible()

  # Wait for at least one match card to appear.
  # We can check for the text "VS" which is in every match card.
  expect(page.get_by_text("VS").first).to_be_visible(timeout=10000)

  # 3. Screenshot: Capture the result.
  page.screenshot(path="/home/jules/verification/mobile-app.png")

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
      test_matches_display(page)
    finally:
      browser.close()
