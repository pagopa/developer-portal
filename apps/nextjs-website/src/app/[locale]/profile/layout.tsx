'use client';
import PageNotFound from '@/app/[locale]/not-found';
import React from 'react';
import { Box } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import Spinner from '@/components/atoms/Spinner/Spinner';
import DesktopProfileMenu from '@/components/molecules/DesktopProfileMenu/DesktopProfileMenu';
import MobileProfileMenu from '@/components/molecules/MobileProfileMenu/MobileProfileMenu';
import { useUser } from '@/helpers/user.helper';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, userFullName } = useUser();
  const { locale } = useParams<{ locale: string }>();

  const pathname = usePathname();

  if (!loading && !user) {
    return <PageNotFound />;
  }
  if (loading) {
    return <Spinner />;
  }

  return (
    <Box width='100%'>
      <MobileProfileMenu locale={locale} userFullName={userFullName} />
      <Box sx={{ maxWidth: '1980px', px: 0, mx: 'auto' }}>
        <Box sx={{ display: 'flex', mt: { xs: '60px', md: 0 }, width: '100%' }}>
          <DesktopProfileMenu
            locale={locale}
            currentPathname={pathname}
            userFullName={userFullName}
          />
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileLayout;
