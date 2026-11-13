import React, {
  AnchorHTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Auth } from 'aws-amplify';
import { usePathname, useRouter } from 'next/navigation';
import DesktopUserInfo from '@/components/atoms/DesktopUserInfo/DesktopUserInfo';
import MobileUserInfo from '@/components/atoms/MobileUserInfo/MobileUserInfo';
import { flushChatQueriesFromLocalStorage } from '@/helpers/chatbot.helpers';

interface MockTreeItemProps extends PropsWithChildren {
  label: ReactNode;
}

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useParams: () => ({ locale: 'it' }),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    ...props
  }: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a {...props}>{children}</a>
  ),
}));

jest.mock('aws-amplify', () => ({ Auth: { signOut: jest.fn() } }));

jest.mock('@/helpers/user.helper', () => ({
  useUser: () => ({
    user: {
      username: 'test-user',
      attributes: { given_name: 'Ada', family_name: 'Lovelace' },
    },
    loading: false,
    setIsLoggingOut: mockSetIsLoggingOut,
  }),
}));

jest.mock('@/helpers/chatbot.helpers', () => ({
  flushChatQueriesFromLocalStorage: jest.fn(),
}));

jest.mock('@/components/molecules/MobileSiteHeader/MobileSiteHeader', () => ({
  MobileSiteHeaderStyledTreeItem: ({ label, children }: MockTreeItemProps) => (
    <div>
      {label}
      {children}
    </div>
  ),
}));

const mockReplace = jest.fn();
const mockSetIsLoggingOut = jest.fn();

const failHistoryCleanup = () => {
  // eslint-disable-next-line functional/no-throw-statements -- Simulate a synchronous storage failure.
  throw new Error('Storage unavailable');
};

const createPendingSignOut = () => {
  const complete = jest.fn();
  const promise = new Promise<void>((resolve) => {
    complete.mockImplementation(resolve);
  });
  return { complete, promise };
};

const finishSignOut = async (
  pending: ReturnType<typeof createPendingSignOut>
) => {
  await act(async () => {
    pending.complete();
    await pending.promise;
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(Auth.signOut).mockReset().mockResolvedValue(undefined);
  jest.mocked(flushChatQueriesFromLocalStorage).mockReset();
  jest.mocked(usePathname).mockReturnValue('/it/profile/personal-data');
  jest.mocked(useRouter).mockReturnValue({
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    push: jest.fn(),
    replace: mockReplace,
    prefetch: jest.fn(),
  });
  window.history.replaceState(null, '', '/it/profile/personal-data');
});

afterEach(() => {
  jest.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

describe.each(['desktop', 'mobile'] as const)('%s logout', (kind) => {
  const renderMenu = () =>
    kind === 'desktop' ? <DesktopUserInfo locale='it' /> : <MobileUserInfo />;

  const startLogout = () => {
    const view = render(renderMenu());
    if (kind === 'desktop') {
      fireEvent.click(screen.getByText('Ada Lovelace'));
    }
    fireEvent.click(
      screen.getByRole(kind === 'desktop' ? 'menuitem' : 'button', {
        name: 'auth.logout',
      })
    );
    return view;
  };

  const navigateTo = (view: ReturnType<typeof render>, pathname: string) => {
    window.history.pushState(null, '', pathname);
    jest.mocked(usePathname).mockReturnValue(pathname);
    view.rerender(renderMenu());
  };

  it('marks logout before signing out and redirects on success', async () => {
    startLogout();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/it/'));
    expect(mockSetIsLoggingOut).toHaveBeenCalledWith(true);
    expect(mockSetIsLoggingOut.mock.invocationCallOrder[0]).toBeLessThan(
      jest.mocked(Auth.signOut).mock.invocationCallOrder[0]
    );
    expect(flushChatQueriesFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(mockSetIsLoggingOut).not.toHaveBeenCalledWith(false);
  });

  it('restores the flag and stops navigation when authentication sign-out fails', async () => {
    jest.mocked(Auth.signOut).mockRejectedValue(new Error('Sign-out failed'));
    startLogout();

    await waitFor(() =>
      expect(mockSetIsLoggingOut).toHaveBeenLastCalledWith(false)
    );
    expect(mockReplace).not.toHaveBeenCalled();
    expect(flushChatQueriesFromLocalStorage).not.toHaveBeenCalled();
  });

  it('does not override navigation while sign-out is pending', async () => {
    const pending = createPendingSignOut();
    jest.mocked(Auth.signOut).mockReturnValue(pending.promise);
    const view = startLogout();

    navigateTo(view, '/it/solutions');
    await finishSignOut(pending);

    expect(flushChatQueriesFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not override navigation away from and back to the original page', async () => {
    const pending = createPendingSignOut();
    jest.mocked(Auth.signOut).mockReturnValue(pending.promise);
    const view = startLogout();

    navigateTo(view, '/it/solutions');
    navigateTo(view, '/it/profile/personal-data');
    await finishSignOut(pending);

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not navigate after the menu component unmounts', async () => {
    const pending = createPendingSignOut();
    jest.mocked(Auth.signOut).mockReturnValue(pending.promise);
    const view = startLogout();

    view.unmount();
    await finishSignOut(pending);

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not override a browser path change before the router updates', async () => {
    const pending = createPendingSignOut();
    jest.mocked(Auth.signOut).mockReturnValue(pending.promise);
    startLogout();

    window.history.pushState(null, '', '/it/solutions');
    await finishSignOut(pending);

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects after successful sign-out even when history cleanup fails', async () => {
    const warning = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    jest
      .mocked(flushChatQueriesFromLocalStorage)
      .mockImplementation(failHistoryCleanup);
    startLogout();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/it/'));
    expect(mockSetIsLoggingOut).not.toHaveBeenCalledWith(false);
    expect(warning).toHaveBeenCalledWith(
      'Could not clear local chatbot history after logout.'
    );
  });

  it('preserves newer navigation when history cleanup also fails', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const pending = createPendingSignOut();
    jest.mocked(Auth.signOut).mockReturnValue(pending.promise);
    jest
      .mocked(flushChatQueriesFromLocalStorage)
      .mockImplementation(failHistoryCleanup);
    const view = startLogout();

    navigateTo(view, '/it/solutions');
    await finishSignOut(pending);

    expect(flushChatQueriesFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
