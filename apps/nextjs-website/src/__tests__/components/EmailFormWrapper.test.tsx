import { render, fireEvent } from '@testing-library/react';
import EmailFormWrapper from '@/components/organisms/EmailFormWrapper/EmailFormWrapper';
import Wrapper from './Wrapper';

describe('EmailFormWrapper', () => {
  const mockOnCancel = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockOnSave = jest.fn((_email: string) => Promise.resolve());
  const mockOnEdit = jest.fn();

  const item = {
    editable: true,
    name: 'email',
    title: 'Email',
    value: 'mockEmail@mock.it',
    onEdit: mockOnEdit,
  };

  it('should render EditEmailForm when isEditing is true', () => {
    const { getByRole } = render(
      <Wrapper>
        <EmailFormWrapper
          item={item}
          isEditing={true}
          onCancel={mockOnCancel}
          onSave={mockOnSave}
          onEdit={mockOnEdit}
        />
      </Wrapper>
    );

    expect(getByRole('textbox')).toBeTruthy();
  });

  it('should render InfoCardItem when isEditing is false', () => {
    const { getAllByText } = render(
      <Wrapper>
        <EmailFormWrapper
          item={item}
          isEditing={false}
          onCancel={mockOnCancel}
          onSave={mockOnSave}
          onEdit={mockOnEdit}
        />
      </Wrapper>
    );

    expect(getAllByText(item.value)).toBeTruthy();
  });

  it('should call onEdit when edit button is clicked', () => {
    const { getByRole } = render(
      <Wrapper>
        <EmailFormWrapper
          item={item}
          isEditing={false}
          onCancel={mockOnCancel}
          onSave={mockOnSave}
          onEdit={mockOnEdit}
        />
      </Wrapper>
    );

    fireEvent.click(getByRole('button'));
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    const { getAllByRole } = render(
      <Wrapper>
        <EmailFormWrapper
          item={item}
          isEditing={true}
          onCancel={mockOnCancel}
          onSave={mockOnSave}
          onEdit={mockOnEdit}
        />
      </Wrapper>
    );

    fireEvent.click(getAllByRole('button', { name: /annulla/i })[0]);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should not call onSave when save button is clicked and email input has not valid value', () => {
    const { getByRole, getAllByRole } = render(
      <Wrapper>
        <EmailFormWrapper
          item={item}
          isEditing={true}
          onCancel={mockOnCancel}
          onSave={mockOnSave}
          onEdit={mockOnEdit}
        />
      </Wrapper>
    );

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'updated' },
    });

    fireEvent.click(getAllByRole('button', { name: /conferma/i })[0]);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should call onSave when save button is clicked and email input is valid', () => {
    const { getByRole, getAllByRole } = render(
      <Wrapper>
        <EmailFormWrapper
          item={item}
          isEditing={true}
          onCancel={mockOnCancel}
          onSave={mockOnSave}
          onEdit={mockOnEdit}
        />
      </Wrapper>
    );

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'updated@mockmail.com' },
    });

    fireEvent.click(getAllByRole('button', { name: /conferma/i })[0]);
    expect(mockOnSave).toHaveBeenCalled();
  });
});
