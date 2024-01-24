import {
  InfoCardItem,
  InfoCardItemProps,
} from '@/components/atoms/InfoCardItem/InfoCardItem';
import React from 'react';
import EditEmailForm from '@/components/molecules/EditEmailForm/EditEmailForm';

type EmailFormWrapperProps = {
  item: InfoCardItemProps;
  isEditing: boolean;
  // eslint-disable-next-line functional/no-return-void
  onCancel: () => void;
  onSave: (newEmail: string) => Promise<void>;
  // eslint-disable-next-line functional/no-return-void
  onEdit: () => void;
};

const EmailFormWrapper: React.FC<EmailFormWrapperProps> = ({
  item,
  isEditing,
  onCancel,
  onSave,
  onEdit,
}) => {
  return isEditing ? (
    <EditEmailForm onCancel={onCancel} onSave={onSave} />
  ) : (
    <InfoCardItem {...item} onEdit={onEdit} />
  );
};

export default EmailFormWrapper;
