'use client';

import GuideMenu from "@/components/atoms/GuideMenu/GuideMenu";
import ProfileMenu from "@/components/atoms/ProfileMenu/ProfileMenu";
import { Box, useTheme, Typography } from "@mui/material";


const TermsOfService = () => {
    const { palette } = useTheme();
    return (
        <Box sx={{ display: 'flex' }}>
            <ProfileMenu name="Mario Rossi"></ProfileMenu>

            <Box py={6}>
                BBB
            </Box>

        </Box>

    );
};

export default TermsOfService;
