import LoginForm from '@/components/organisms/Auth/LoginForm';
import { fireEvent, render, act } from '@testing-library/react';
import Wrapper from '../../../../__tests__/components/Wrapper';
import React from 'react';

describe('LoginForm', () => {
  const promise = Promise.resolve();
  const mockOnLogin = jest.fn(() => promise);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <Wrapper>
        <LoginForm onLogin={mockOnLogin} />
      </Wrapper>
    );
  });

  it('should handle username and password input', () => {
    const { getByLabelText } = render(
      <Wrapper>
        <LoginForm onLogin={mockOnLogin} />
      </Wrapper>
    );

    const usernameInput = getByLabelText(/^email$/i) as HTMLInputElement;
    const passwordInput = getByLabelText(/^password$/i) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should call onLogin when form is submitted', async () => {
    const { getByLabelText, getByRole } = render(
      <Wrapper>
        <LoginForm onLogin={mockOnLogin} />
      </Wrapper>
    );

    const usernameInput = getByLabelText(/^email$/i) as HTMLInputElement;
    const passwordInput = getByLabelText(/^password$/i) as HTMLInputElement;
    const submitButton = getByRole('button', { name: /accedi/i });

    fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockOnLogin).toHaveBeenCalledWith({
      username: 'test@example.com',
      password: 'password123',
    });

    await act(() => promise);
  });

  it('should display error messages when inputs are invalid', async () => {
    const {
      getByLabelText,
      findByText,
      getByRole,
      findAllByText,
      queryByText,
      queryAllByText,
    } = render(
      <Wrapper>
        <LoginForm onLogin={mockOnLogin} />
      </Wrapper>
    );

    const errorsRegex = /Questo campo non può essere vuoto/i;
    const emailErrorRegex = /Inserisci un indirizzo email valido/i;
    const usernameInput = getByLabelText(/^email$/i) as HTMLInputElement;
    const passwordInput = getByLabelText(/^password$/i) as HTMLInputElement;
    const submitButton = getByRole('button', { name: /accedi/i });

    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    const errors = await findAllByText(errorsRegex);

    expect(usernameInput.attributes.getNamedItem('aria-invalid')?.value).toBe(
      'true'
    );
    expect(passwordInput.attributes.getNamedItem('aria-invalid')?.value).toBe(
      'true'
    );
    expect(errors).toHaveLength(2);

    fireEvent.change(usernameInput, { target: { value: 'invalid email' } });
    fireEvent.click(submitButton);

    const emailError = await findByText(emailErrorRegex);
    const passwordError = await findByText(errorsRegex);

    expect(emailError).toBeDefined();
    expect(passwordError).toBeDefined();
    expect(usernameInput.attributes.getNamedItem('aria-invalid')?.value).toBe(
      'true'
    );
    expect(passwordInput.attributes.getNamedItem('aria-invalid')?.value).toBe(
      'true'
    );

    fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    const emailError1 = await queryByText(emailErrorRegex);
    const errorsRegex1 = await queryAllByText(errorsRegex);

    expect(emailError1).toBeNull();
    expect(errorsRegex1).toHaveLength(0);
    expect(usernameInput.attributes.getNamedItem('aria-invalid')?.value).toBe(
      'false'
    );
    expect(passwordInput.attributes.getNamedItem('aria-invalid')?.value).toBe(
      'false'
    );
  });

  it('should display error messages when account not exists', async () => {
    const { findAllByText } = render(
      <Wrapper>
        <LoginForm noAccount onLogin={mockOnLogin} />
      </Wrapper>
    );

    const errors = await findAllByText(/Nome utente o password non corretti./i);

    expect(errors).toHaveLength(2);
  });
});
