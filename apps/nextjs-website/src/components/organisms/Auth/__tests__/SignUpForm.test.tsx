import { fireEvent, render } from '@testing-library/react';
import SignUpForm from '../SignUpForm';
import Wrapper from '@/__tests__/components/Wrapper';

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

describe('SignUpForm', () => {
  const mockOnSignUp = jest.fn();
  const mockUserAlreadyExist = false;

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
    const { getByRole, getAllByLabelText } = render(
      <Wrapper>
        <SignUpForm
          onSignUp={mockOnSignUp}
          userAlreadyExist={mockUserAlreadyExist}
        />
      </Wrapper>
    );
    const firstNameInput = getByRole('textbox', {
      name: /firstname/i,
    }) as HTMLInputElement;
    const lastNameInput = getByRole('textbox', {
      name: /lastname/i,
    }) as HTMLInputElement;
    const usernameInput = getByRole('textbox', {
      name: /email/i,
    }) as HTMLInputElement;
    const { confirmPasswordInput, passwordInput } = getPasswordInputs(
      getAllByLabelText(/password/i)
    );
    const submitButton = getByRole('button', { name: /Iscriviti/i });

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

  it('should call onSignUp when form is valid', () => {
    const { getByRole, getAllByLabelText } = render(
      <Wrapper>
        <SignUpForm
          onSignUp={mockOnSignUp}
          userAlreadyExist={mockUserAlreadyExist}
        />
      </Wrapper>
    );
    const firstNameInput = getByRole('textbox', {
      name: /firstname/i,
    }) as HTMLInputElement;
    const lastNameInput = getByRole('textbox', {
      name: /lastname/i,
    }) as HTMLInputElement;
    const usernameInput = getByRole('textbox', {
      name: /email/i,
    }) as HTMLInputElement;
    const { confirmPasswordInput, passwordInput } = getPasswordInputs(
      getAllByLabelText(/password/i)
    );
    const submitButton = getByRole('button', { name: /Iscriviti/i });

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
