import LoginForm from '@/components/organisms/Auth/LoginForm';
import { fireEvent, render, act } from '@testing-library/react';
import Wrapper from './Wrapper';
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
    const { getByLabelText, findByText, getByRole, findAllByText } = render(
      <Wrapper>
        <LoginForm onLogin={mockOnLogin} />
      </Wrapper>
    );

    const usernameInput = getByLabelText(/^email$/i) as HTMLInputElement;
    const passwordInput = getByLabelText(/^password$/i) as HTMLInputElement;
    const submitButton = getByRole('button', { name: /accedi/i });

    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    const errors = await findAllByText(/Questo campo non può essere vuoto/i);

    expect(errors).toHaveLength(2);

    fireEvent.change(usernameInput, { target: { value: 'invalid email' } });
    fireEvent.click(submitButton);

    const emailError = await findByText(/Inserisci un indirizzo email valido/i);
    const passwordError = await findByText(
      /Questo campo non può essere vuoto/i
    );

    expect(emailError).toBeDefined();
    expect(passwordError).toBeDefined();
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
