import { fireEvent, render, screen } from '@testing-library/react';
import mixpanel from 'mixpanel-browser';
import { hasConsent } from '@/components/atoms/Mixpanel/ConsentCheck';
import MixpanelInit from '@/components/atoms/Mixpanel/MixpanelInit';
import { Card } from '@/components/organisms/GitBookContent/components/Cards';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/components/atoms/Mixpanel/ConsentCheck', () => ({
  hasConsent: jest.fn(),
}));

jest.mock('mixpanel-browser', () => ({
  __esModule: true,
  default: { init: jest.fn(), track: jest.fn() },
}));

describe('outbound link tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(hasConsent).mockReturnValue(true);
  });

  it('tracks a middle click on an external link once and ignores right clicks', () => {
    render(
      <>
        <MixpanelInit enableMixpanel token='test' />
        <a href='https://example.org/guide?source=footer#intro'>
          <span>Guide</span>
        </a>
      </>
    );

    const label = screen.getByText('Guide');
    fireEvent(label, new MouseEvent('auxclick', { bubbles: true, button: 2 }));
    expect(mixpanel.track).not.toHaveBeenCalled();

    fireEvent(label, new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(mixpanel.track).toHaveBeenCalledTimes(1);
    expect(mixpanel.track).toHaveBeenCalledWith(
      'Outbound Link Clicked',
      { url: 'https://example.org/guide' },
      { transport: 'sendBeacon' }
    );
  });

  it('tracks a GitBook card with consent while preserving its navigation', () => {
    const href = 'https://example.org/card?source=guide';
    render(
      <>
        <MixpanelInit enableMixpanel token='test' />
        <Card href={href}>External card</Card>
      </>
    );

    const card = screen.getByRole('button', { name: 'External card' });
    fireEvent(card, new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(mixpanel.track).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();

    jest.mocked(hasConsent).mockReturnValue(false);
    fireEvent.click(card);
    expect(mixpanel.track).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(href);

    jest.mocked(hasConsent).mockReturnValue(true);
    fireEvent.click(card);
    expect(mixpanel.track).toHaveBeenCalledTimes(1);
    expect(mixpanel.track).toHaveBeenCalledWith(
      'Outbound Link Clicked',
      { url: 'https://example.org/card' },
      { transport: 'sendBeacon' }
    );
    expect(mockPush).toHaveBeenNthCalledWith(2, href);
  });
});
