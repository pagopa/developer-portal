import { EditPasswordForm } from '@/components/organisms/Auth/EditPasswordForm';
import {
  InfoCardItem,
  InfoCardItemProps
} from '@/components/atoms/InfoCardItem/InfoCardItem';
import React from 'react';

type PasswordFormWrapperProps = {
  item: InfoCardItemProps;
  isEditing: boolean;

  onCancel: () => void;
  onSave: (oldPassword: string, newPassword: string) => Promise<void>;

  onEdit: () => void;
};

const PasswordFormWrapper: React.FC<PasswordFormWrapperProps> = ({
  item,
  isEditing,
  onCancel,
  onSave,
  onEdit
}) => {
  return isEditing ? (
    <EditPasswordForm onCancel={onCancel} onSave={onSave} />
  ) : (
    <InfoCardItem {...item} onEdit={onEdit} />
  );
};

export default PasswordFormWrapper;
