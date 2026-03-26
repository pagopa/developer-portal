import { fireEvent, render, screen } from '@testing-library/react';
import Wrapper from '@/__tests__/components/Wrapper';
import SignUpForm from '../SignUpForm';

import labels from '@/messages/it.json';
import { useParams } from 'next/navigation';

const actionRegex = RegExp(labels.auth.signUp.action, 'i');

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

function getPasswordInputs(inputs: HTMLElement[]) {
  const filtered = inputs.filter(
    (el) => el.getAttribute('type') === 'password'
  ) as HTMLInputElement[];

  expect(filtered).toHaveLength(2);

  const confirmPasswordInput = filtered.find(
    (el) => el.name === 'confirmPassword'
  );

  const passwordInput = filtered.find((el) => el.name === 'password');

  expect(confirmPasswordInput).toBeDefined();
  expect(passwordInput).toBeDefined();

  return {
    confirmPasswordInput: confirmPasswordInput as HTMLInputElement,
    passwordInput: passwordInput as HTMLInputElement,
  };
}

function getInputs() {
  const firstNameInput = screen.getByRole('textbox', {
    name: /firstname/i,
  }) as HTMLInputElement;
  const lastNameInput = screen.getByRole('textbox', {
    name: /lastname/i,
  }) as HTMLInputElement;
  const usernameInput = screen.getByRole('textbox', {
    name: /email/i,
  }) as HTMLInputElement;
  const passwordInputs = getPasswordInputs(
    screen.getAllByLabelText(/password/i)
  );
  const submitButton = screen.getByRole('button', { name: actionRegex });

  return {
    ...passwordInputs,
    firstNameInput,
    lastNameInput,
    submitButton,
    usernameInput,
  };
}

describe('SignUpForm', () => {
  const mockOnSignUp = jest.fn();
  const mockUserAlreadyExist = false;
  jest.mocked(useParams).mockReturnValue({ locale: 'it' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <Wrapper>
        <SignUpForm
          onSignUp={mockOnSignUp}
          userAlreadyExist={mockUserAlreadyExist}
        />
      </Wrapper>
    );
  });

  it('should validate form fields and set errors', () => {
    render(
      <Wrapper>
        <SignUpForm
          onSignUp={mockOnSignUp}
          userAlreadyExist={mockUserAlreadyExist}
        />
      </Wrapper>
    );

    const {
      firstNameInput,
      lastNameInput,
      usernameInput,
      passwordInput,
      confirmPasswordInput,
      submitButton,
    } = getInputs();

    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.change(lastNameInput, { target: { value: '' } });
    fireEvent.change(usernameInput, { target: { value: 'invalid email' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'mismatch' } });
    fireEvent.click(submitButton);

    expect(firstNameInput).toBeInvalid();
    expect(lastNameInput).toBeInvalid();
    expect(usernameInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
    expect(confirmPasswordInput).toBeInvalid();
    expect(mockOnSignUp).not.toHaveBeenCalled();
  });

  it('should set user already exists error', () => {
    render(
      <Wrapper>
        <SignUpForm onSignUp={mockOnSignUp} userAlreadyExist />
      </Wrapper>
    );

    const { usernameInput, submitButton } = getInputs();

    fireEvent.click(submitButton);

    expect(usernameInput).toBeInvalid();
    expect(mockOnSignUp).not.toHaveBeenCalled();
  });

  it('should reset form fields errors', () => {
    render(
      <Wrapper>
        <SignUpForm
          onSignUp={mockOnSignUp}
          userAlreadyExist={mockUserAlreadyExist}
        />
      </Wrapper>
    );

    const {
      firstNameInput,
      lastNameInput,
      usernameInput,
      passwordInput,
      confirmPasswordInput,
      submitButton,
    } = getInputs();

    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.change(lastNameInput, { target: { value: '' } });
    fireEvent.change(usernameInput, { target: { value: 'invalid email' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'mismatch' } });
    fireEvent.click(submitButton);

    expect(firstNameInput).toBeInvalid();
    expect(lastNameInput).toBeInvalid();
    expect(usernameInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
    expect(confirmPasswordInput).toBeInvalid();
    expect(mockOnSignUp).not.toHaveBeenCalled();

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(usernameInput, {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(passwordInput, { target: { value: 'StrongPassword23!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'StrongPassword23!' },
    });
    fireEvent.click(submitButton);

    expect(firstNameInput).toBeValid();
    expect(lastNameInput).toBeValid();
    expect(usernameInput).toBeValid();
    expect(passwordInput).toBeValid();
    expect(confirmPasswordInput).toBeValid();
    expect(mockOnSignUp).toHaveBeenCalled();
  });

  it('should call onSignUp when form is valid', () => {
    render(
      <Wrapper>
        <SignUpForm
          onSignUp={mockOnSignUp}
          userAlreadyExist={mockUserAlreadyExist}
        />
      </Wrapper>
    );

    const {
      firstNameInput,
      lastNameInput,
      usernameInput,
      passwordInput,
      confirmPasswordInput,
      submitButton,
    } = getInputs();

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(usernameInput, {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(passwordInput, { target: { value: 'StrongPassword23!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'StrongPassword23!' },
    });
    fireEvent.click(submitButton);

    expect(firstNameInput).toBeValid();
    expect(lastNameInput).toBeValid();
    expect(usernameInput).toBeValid();
    expect(passwordInput).toBeValid();
    expect(confirmPasswordInput).toBeValid();
    expect(mockOnSignUp).toHaveBeenCalled();
  });
});
