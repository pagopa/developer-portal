import { act, renderHook, waitFor } from '@testing-library/react';
import { Auth, Hub } from 'aws-amplify';
import { usePathname } from 'next/navigation';
import { UserProvider, useUser } from '@/helpers/user.helper';

jest.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: () => ({ authStatus: 'authenticated' }),
}));

jest.mock('aws-amplify', () => ({
  Auth: {
    currentAuthenticatedUser: jest.fn(),
    currentUserInfo: jest.fn(),
    signOut: jest.fn(),
  },
  Hub: { listen: jest.fn() },
}));

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));

jest.mock('@/browserConfig', () => ({
  browserEnv: { config: { isWebinarsEnabled: false } },
}));

jest.mock('@/lib/webinarApi', () => ({
  getUserWebinarSubscriptions: jest.fn().mockResolvedValue([]),
  getUserWebinarCertificates: jest.fn().mockResolvedValue([]),
}));

const authenticatedUser = {
  username: 'test-user',
  attributes: {
    email: 'ada@example.com',
    given_name: 'Ada',
    family_name: 'Lovelace',
  },
};

const startLogout = async () => {
  const view = renderHook(() => useUser(), { wrapper: UserProvider });
  await waitFor(() => expect(view.result.current.user).toBe(authenticatedUser));
  act(() => view.result.current.setIsLoggingOut(true));
  return view;
};

const notifySignOut = () => {
  act(() => {
    const listener = jest.mocked(Hub.listen).mock.calls[0][1];
    expect(listener).toEqual(expect.any(Function));
    if (typeof listener === 'function') {
      listener({
        channel: 'auth',
        payload: { event: 'signOut' },
        source: 'Auth',
        patternInfo: [],
      });
    }
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(usePathname).mockReturnValue('/it/profile/agreements');
  jest
    .mocked(Auth.currentAuthenticatedUser)
    .mockResolvedValue(authenticatedUser);
  jest.mocked(Auth.currentUserInfo).mockResolvedValue(authenticatedUser);
  jest.mocked(Hub.listen).mockReturnValue(jest.fn());
});

describe('logout loading state', () => {
  it.each([
    '/it/profile/chatbot-history',
    '/it/webinars/example/questions',
    '/profile/chatbot-history',
  ])(
    'keeps protected content covered after sign-out on %s',
    async (pathname) => {
      const view = await startLogout();
      notifySignOut();

      jest.mocked(usePathname).mockReturnValue(pathname);
      view.rerender();

      expect(view.result.current.user).toBeNull();
      expect(view.result.current.isLoggingOut).toBe(true);
    }
  );

  it('clears the flag after sign-out reaches a public page', async () => {
    const view = await startLogout();
    notifySignOut();

    jest.mocked(usePathname).mockReturnValue('/it/');
    view.rerender();

    expect(view.result.current.isLoggingOut).toBe(false);
  });

  it('keeps the flag while sign-out is pending on a public page', async () => {
    const view = await startLogout();

    jest.mocked(usePathname).mockReturnValue('/it/solutions');
    view.rerender();

    expect(view.result.current.isLoggingOut).toBe(true);

    notifySignOut();

    expect(view.result.current.user).toBeNull();
    expect(view.result.current.isLoggingOut).toBe(false);
  });
});
