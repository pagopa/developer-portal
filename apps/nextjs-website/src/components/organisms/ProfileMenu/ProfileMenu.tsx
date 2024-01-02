'use client';
import MobileProfileMenu from '@/components/molecules/MobileProfileMenu/MobileProfileMenu';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Box } from '@mui/material';
import DesktopProfileMenu from '@/components/molecules/DesktopProfileMenu/DesktopProfileMenu';
import React, { ReactNode } from 'react';
import { useUser } from '@/helpers/user.helper';
import { usePathname } from 'next/navigation';
import PageNotFound from '@/app/not-found';
import Spinner from '@/components/atoms/Spinner/Spinner';

const ProfileMenu = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useUser();
  // TODO: Move this constant to user helper
  const userFullName =
    (user &&
      [user.attributes['given_name'], user.attributes['family_name']].join(
        ' '
      )) ||
    '';

  const pathname = usePathname();

  // TODO: add dedicated unauthorized page
  if (!loading && !user) {
    return <PageNotFound />;
  }
  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <MobileProfileMenu userFullName={userFullName} />
      <EContainer>
        <Box sx={{ display: 'flex' }}>
          <DesktopProfileMenu
            currentPathname={pathname}
            userFullName={userFullName}
          />
          {children}
        </Box>
      </EContainer>
    </>
  );
};

export default ProfileMenu;
