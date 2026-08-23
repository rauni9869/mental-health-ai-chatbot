import { expect, test } from '../fixtures';
import { AuthPage } from '../pages/auth';
import { generateRandomTestUser } from '../helpers';
import { ChatPage } from '../pages/chat';
import { getMessageByErrorCode } from '@/lib/errors';

test.describe
  .serial('Guest Session', () => {
    test('Keep the marketing homepage public without forcing a guest session', async ({
      page,
    }) => {
      const response = await page.goto('/');

      if (!response) {
        throw new Error('Failed to load page');
      }

      let request: ReturnType<typeof response.request> | null =
        response.request();

      const chain = [];

      while (request) {
        chain.unshift(request.url());
        request = request.redirectedFrom();
      }

      expect(chain).toEqual(['http://localhost:3000/']);
      await expect(
        page.getByRole('heading', {
          name: 'Support for the hours your therapist is not on call.',
        }),
      ).toBeVisible();
    });

    test('Authenticate as guest user when the companion is opened', async ({
      page,
    }) => {
      const response = await page.goto('/app');

      if (!response) {
        throw new Error('Failed to load page');
      }

      let request: ReturnType<typeof response.request> | null =
        response.request();

      const chain = [];

      while (request) {
        chain.unshift(request.url());
        request = request.redirectedFrom();
      }

      expect(chain).toEqual([
        'http://localhost:3000/app',
        'http://localhost:3000/api/auth/guest?redirectUrl=http%3A%2F%2Flocalhost%3A3000%2Fapp',
        'http://localhost:3000/app',
      ]);
    });

    test('Log out is not available for guest users', async ({ page }) => {
      await page.goto('/app');

      const sidebarToggleButton = page.getByTestId('sidebar-toggle-button');
      await sidebarToggleButton.click();

      const userNavButton = page.getByTestId('user-nav-button');
      await expect(userNavButton).toBeVisible();

      await userNavButton.click();
      const userNavMenu = page.getByTestId('user-nav-menu');
      await expect(userNavMenu).toBeVisible();

      const authMenuItem = page.getByTestId('user-nav-item-auth');
      await expect(authMenuItem).toContainText('Login to your account');
    });

    test('Do not authenticate as guest user when an existing non-guest session is active', async ({
      adaContext,
    }) => {
      const response = await adaContext.page.goto('/');

      if (!response) {
        throw new Error('Failed to load page');
      }

      let request: ReturnType<typeof response.request> | null =
        response.request();

      const chain = [];

      while (request) {
        chain.unshift(request.url());
        request = request.redirectedFrom();
      }

      expect(chain).toEqual(['http://localhost:3000/']);
    });

    test('Allow navigating to /login as guest user', async ({ page }) => {
      await page.goto('/login');
      await page.waitForURL('/login');
      await expect(page).toHaveURL('/login');
    });

    test('Allow navigating to /register as guest user', async ({ page }) => {
      await page.goto('/register');
      await page.waitForURL('/register');
      await expect(page).toHaveURL('/register');
    });

    test('Do not show email in user menu for guest user', async ({ page }) => {
      await page.goto('/app');

      const sidebarToggleButton = page.getByTestId('sidebar-toggle-button');
      await sidebarToggleButton.click();

      const userEmail = page.getByTestId('user-email');
      await expect(userEmail).toContainText('Guest');
    });
  });

test.describe
  .serial('Login and Registration', () => {
    let authPage: AuthPage;

    const testUser = generateRandomTestUser();

    test.beforeEach(async ({ page }) => {
      authPage = new AuthPage(page);
    });

    test('Register new account', async () => {
      await authPage.register(testUser.email, testUser.password);
      await authPage.expectToastToContain('Account created successfully!');
    });

    test('Register new account with existing email', async () => {
      await authPage.register(testUser.email, testUser.password);
      await authPage.expectToastToContain('Account already exists!');
    });

    test('Log into account that exists', async ({ page }) => {
      await authPage.login(testUser.email, testUser.password);

      await page.waitForURL('/app');
      await expect(page.getByPlaceholder('Send a message...')).toBeVisible();
    });

    test('Display user email in user menu', async ({ page }) => {
      await authPage.login(testUser.email, testUser.password);

      await page.waitForURL('/app');
      await expect(page.getByPlaceholder('Send a message...')).toBeVisible();

      const userEmail = await page.getByTestId('user-email');
      await expect(userEmail).toHaveText(testUser.email);
    });

    test('Log out as non-guest user', async () => {
      await authPage.logout(testUser.email, testUser.password);
    });

    test('Do not force create a guest session if non-guest session already exists', async ({
      page,
    }) => {
      await authPage.login(testUser.email, testUser.password);
      await page.waitForURL('/app');

      const userEmail = await page.getByTestId('user-email');
      await expect(userEmail).toHaveText(testUser.email);

      await page.goto('/api/auth/guest');
      await page.waitForURL('/app');

      const updatedUserEmail = page.getByTestId('user-email');
      await expect(updatedUserEmail).toHaveText(testUser.email);
    });

    test('Log out is available for non-guest users', async ({ page }) => {
      await authPage.login(testUser.email, testUser.password);
      await page.waitForURL('/app');

      authPage.openSidebar();

      const userNavButton = page.getByTestId('user-nav-button');
      await expect(userNavButton).toBeVisible();

      await userNavButton.click();
      const userNavMenu = page.getByTestId('user-nav-menu');
      await expect(userNavMenu).toBeVisible();

      const authMenuItem = page.getByTestId('user-nav-item-auth');
      await expect(authMenuItem).toContainText('Sign out');
    });

    test('Do not navigate to /register for non-guest users', async ({
      page,
    }) => {
      await authPage.login(testUser.email, testUser.password);
      await page.waitForURL('/app');

      await page.goto('/register');
      await expect(page).toHaveURL('/app');
    });

    test('Do not navigate to /login for non-guest users', async ({ page }) => {
      await authPage.login(testUser.email, testUser.password);
      await page.waitForURL('/app');

      await page.goto('/login');
      await expect(page).toHaveURL('/app');
    });
  });

test.describe('Entitlements', () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
  });

  test('Guest user cannot send more than 20 messages/day', async () => {
    test.fixme();
    await chatPage.createNewChat();

    for (let i = 0; i <= 20; i++) {
      await chatPage.sendUserMessage('Why is the sky blue?');
      await chatPage.isGenerationComplete();
    }

    await chatPage.sendUserMessage('Why is the sky blue?');
    await chatPage.expectToastToContain(
      getMessageByErrorCode('rate_limit:chat'),
    );
  });
});
