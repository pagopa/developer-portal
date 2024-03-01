import { render, fireEvent } from '@testing-library/react';
import ConfirmLogin from '@/components/organisms/Auth/ConfirmLogin';
import Wrapper from '../../../../__tests__/components/Wrapper';

describe('ConfirmLogin', () => {
  const mockOnConfirmLogin = jest.fn(() => Promise.resolve());
  const mockResendCode = jest.fn(() => Promise.resolve(true));

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
    const { getByRole } = render(
      <Wrapper>
        <ConfirmLogin
          email='test@example.com'
          onConfirmLogin={mockOnConfirmLogin}
          resendCode={mockResendCode}
        />
      </Wrapper>
    );
    const codeInput = getByRole('textbox') as HTMLInputElement;

    fireEvent.change(codeInput, { target: { value: '123456' } });

    expect(codeInput.value).toBe('123456');
  });

  it('should call onConfirmLogin when continue button is clicked', () => {
    const { getByRole } = render(
      <Wrapper>
        <ConfirmLogin
          email='test@example.com'
          onConfirmLogin={mockOnConfirmLogin}
          resendCode={mockResendCode}
        />
      </Wrapper>
    );
    const codeInput = getByRole('textbox');
    const continueButton = getByRole('button', { name: /continua/i });

    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(continueButton);

    expect(mockOnConfirmLogin).toHaveBeenCalledWith('123456');
  });

  it('should display error message when code is invalid', async () => {
    mockOnConfirmLogin.mockRejectedValueOnce({
      name: 'NotAuthorizedException',
    });

    const { getByRole, findByText } = render(
      <Wrapper>
        <ConfirmLogin
          email='test@example.com'
          onConfirmLogin={mockOnConfirmLogin}
          resendCode={mockResendCode}
        />
      </Wrapper>
    );
    const codeInput = getByRole('textbox');
    const continueButton = getByRole('button', { name: /continua/i });

    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(continueButton);

    const errorMessage = await findByText(/Il codice inserito non è corretto/i);

    expect(errorMessage).toBeDefined();
  });

  it('should display error message when code is empty', async () => {
    mockOnConfirmLogin.mockRejectedValueOnce({ name: 'AuthError' });

    const { getByRole, findByText } = render(
      <Wrapper>
        <ConfirmLogin
          email='test@example.com'
          onConfirmLogin={mockOnConfirmLogin}
          resendCode={mockResendCode}
        />
      </Wrapper>
    );
    const codeInput = getByRole('textbox');
    const continueButton = getByRole('button', { name: /continua/i });

    fireEvent.change(codeInput, { target: { value: '' } });
    fireEvent.click(continueButton);

    const errorMessage = await findByText(/Il codice è obbligatorio/i);

    expect(errorMessage).toBeDefined();
  });
});
