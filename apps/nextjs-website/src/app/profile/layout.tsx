'use client';
import PageNotFound from '@/app/not-found';
import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import Spinner from '@/components/atoms/Spinner/Spinner';
import DesktopProfileMenu from '@/components/molecules/DesktopProfileMenu/DesktopProfileMenu';
import MobileProfileMenu from '@/components/molecules/MobileProfileMenu/MobileProfileMenu';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { useUser } from '@/helpers/user.helper';

const ProfileLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading, userFullName } = useUser();

  const pathname = usePathname();

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
        <Box sx={{ display: 'flex', mt: { xs: '60px', md: 0 }, width: '100%' }}>
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

export default ProfileLayout;
