import { render, screen } from '@testing-library/react';
import { parseChatMessage } from '@/helpers/chatMessageParser.helper';

describe('parseChatMessage', () => {
  it('renders a standard markdown link without the display-block class', () => {
    render(<>{parseChatMessage('[PagoPA](https://www.pagopa.it)')}</>);

    const link = screen.getByText('PagoPA').closest('a');

    expect(link).not.toBeNull();
    expect(link).not.toHaveClass('display-block');
  });

  it('adds the display-block class to a link followed by a class modifier token', () => {
    const { container } = render(
      <>
        {parseChatMessage(
          '[Per i cittadini](https://notifichedigitali.it/cittadini) {% .display-block %} Dopo'
        )}
      </>
    );

    const link = screen.getByText('Per i cittadini').closest('a');

    expect(link).not.toBeNull();
    expect(link).toHaveClass('display-block');
    expect(container).not.toHaveTextContent('{% .display-block %}');
    expect(container).toHaveTextContent('Per i cittadini Dopo');
    expect(container).toHaveTextContent('Dopo');
  });
});
