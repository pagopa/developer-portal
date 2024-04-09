import { render, fireEvent, screen } from '@testing-library/react';
import ConfirmLogin from '@/components/organisms/Auth/ConfirmLogin';
import Wrapper from '../../../../__tests__/components/Wrapper';

import labels from '@/messages/it.json';

const continueRegex = new RegExp(labels.auth.confirmLogin.continue, 'i');
const invalidCodeRegex = new RegExp(labels.auth.confirmLogin.invalidCode, 'i');
const emptyCodeRegex = new RegExp(labels.auth.confirmLogin.emptyCode, 'i');

describe('ConfirmLogin', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const mockOnConfirmLogin = jest.fn(async () => {});
  const mockResendCode = jest.fn(async () => true);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <Wrapper>
        <ConfirmLogin
          email='test@example.com'
          onConfirmLogin={mockOnConfirmLogin}
          resendCode={mockResendCode}
        />
      </Wrapper>
    );
  });

  it('should handle code input', () => {
    render(
      <Wrapper>
        <ConfirmLogin
          email='test@example.com'
          onConfirmLogin={mockOnConfirmLogin}
          resendCode={mockResendCode}
        />
      </Wrapper>
    );
    const codeInput = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(codeInput, { target: { value: '123456' } });

    expect(codeInput.value).toBe('123456');
  });

  it('should call onConfirmLogin when continue button is clicked', () => {
    render(
      <Wrapper>
        <ConfirmLogin
          email='test@example.com'
          onConfirmLogin={mockOnConfirmLogin}
          resendCode={mockResendCode}
        />
      </Wrapper>
    );
    const codeInput = screen.getByRole('textbox');
    const continueButton = screen.getByRole('button', { name: continueRegex });

    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(continueButton);

    expect(mockOnConfirmLogin).toHaveBeenCalledWith('123456');
  });

  it('should display error message when code is invalid', async () => {
    mockOnConfirmLogin.mockRejectedValueOnce({
      name: 'NotAuthorizedException',
    });

    render(
      <Wrapper>
        <ConfirmLogin
          email='test@example.com'
          onConfirmLogin={mockOnConfirmLogin}
          resendCode={mockResendCode}
        />
      </Wrapper>
    );
    const codeInput = screen.getByRole('textbox');
    const continueButton = screen.getByRole('button', { name: continueRegex });

    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(continueButton);

    const errorMessage = await screen.findByText(invalidCodeRegex);

    expect(errorMessage).toBeDefined();
  });

  it('should display error message when code is empty', async () => {
    mockOnConfirmLogin.mockRejectedValueOnce({ name: 'AuthError' });

    render(
      <Wrapper>
        <ConfirmLogin
          email='test@example.com'
          onConfirmLogin={mockOnConfirmLogin}
          resendCode={mockResendCode}
        />
      </Wrapper>
    );
    const codeInput = screen.getByRole('textbox');
    const continueButton = screen.getByRole('button', { name: continueRegex });

    fireEvent.change(codeInput, { target: { value: '' } });
    fireEvent.click(continueButton);

    const errorMessage = await screen.findByText(emptyCodeRegex);

    expect(errorMessage).toBeDefined();
  });
});
