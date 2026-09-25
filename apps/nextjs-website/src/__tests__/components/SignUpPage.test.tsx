import { Auth } from 'aws-amplify';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SignUp from '@/app/[locale]/auth/sign-up/page';
import Wrapper from '@/__tests__/components/Wrapper';
import labels from '@/messages/it.json';

jest.mock('aws-amplify', () => ({
  Auth: {
    signUp: jest.fn(),
  },
}));
jest.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'it' }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('SignUp page', () => {
  it('should show a generic error when Cognito rejects registration', async () => {
    jest.mocked(Auth.signUp).mockRejectedValueOnce({
      code: 'UserLambdaValidationException',
    });

    render(
      <Wrapper>
        <SignUp />
      </Wrapper>
    );
    fireEvent.change(screen.getByRole('textbox', { name: /firstname/i }), {
      target: { value: 'Mario' },
    });

    fireEvent.change(screen.getByRole('textbox', { name: /lastname/i }), {
      target: { value: 'Rossi' },
    });

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'mario.rossi@example.com' },
    });
    fireEvent.change(screen.getByLabelText('password', { exact: true }), {
      target: { value: 'StrongPassword23!' },
    });

    fireEvent.change(
      screen.getByLabelText('confirmPassword', { exact: true }),
      {
        target: { value: 'StrongPassword23!' },
      }
    );
    const submitButton = screen.getByRole('button', {
      name: labels.auth.signUp.action,
    });

    fireEvent.click(submitButton);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      labels.genericError.description
    );

    expect(Auth.signUp).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    expect(screen.getByRole('textbox', { name: /firstname/i })).toHaveValue(
      'Mario'
    );
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue(
      'mario.rossi@example.com'
    );
  });
});
