'use client';
import React, { ReactNode } from 'react';
import ProfileMenu from '@/components/ProfileMenu/ProfileMenu';

const ProfileLayout = ({ children }: { children: ReactNode }) => {
  return <ProfileMenu>{children}</ProfileMenu>;
};

export default ProfileLayout;
