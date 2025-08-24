# Playwright CI/CD Demo

This repository contains automated tests using [Playwright](https://playwright.dev/).  
It includes a GitHub Actions workflow for running tests automatically on every push or pull request and also supports manual triggering.

---

## 🚀 Getting Started

### Clone the Repository
```bash
git clone https://github.com/novakzan/cicd_playwright.git
cd cicd_playwright
```
#### Install Dependencies
Make sure you have Node.js installed (LTS recommended).
```bash
npm install
```
#### Run Tests Locally
```bash
npx playwright test
```
#### View Test Report
```bash
npx playwright show-report
```
#### CI/CD with GitHub Actions

The workflow is manually triggered on GitHub(workflow_dispatch).

This workflow:
- Installs dependencies
- Installs Playwright browsers
- Runs the tests
- Uploads the test report (screenshots, traces, videos) as an artifact for later review

Tests are automatically executed via GitHub Actions when:

Code is pushed to main or master

A pull request targets main or master


```yaml
name: Playwright Tests
on:
  workflow_dispatch:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```
#### Playwright Config

For better debugging, the following options were enabled in playwright.config.ts:
```ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
});
```
This ensures that on test failures you get:
- Screenshots
- Traces (step-by-step actions & logs)
- Videos of the test execution
