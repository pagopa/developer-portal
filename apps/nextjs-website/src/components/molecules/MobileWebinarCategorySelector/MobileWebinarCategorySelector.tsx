import { WebinarCategory } from '@/lib/types/webinarCategory';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import React, { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MobileWebinarCategoryButton from '@/components/atoms/MobileWebinarCategoryButton/MobileWebinarCategoryButton';

type MobileWebinarCategorySelectorProps = {
  selectedWebinarCategory: number;
  // eslint-disable-next-line functional/no-return-void
  setSelectedWebinarCategory: (selectedWebinarCategory: number) => void;
  webinarCategories: WebinarCategory[];
};

const MobileWebinarCategorySelector = ({
  selectedWebinarCategory,
  setSelectedWebinarCategory,
  webinarCategories,
}: MobileWebinarCategorySelectorProps) => {
  const { palette } = useTheme();
  const [isExpanded, setIsedExpanded] = useState(false);
  const icon = isExpanded ? <></> : <ExpandMoreIcon />;
  return (
    <Box
      sx={{
        backgroundColor: '#EBF4FD',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: { xs: '100%', md: '100%' },
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Accordion
        expanded={isExpanded}
        onChange={(event, expanded) => {
          setIsedExpanded(expanded);
        }}
        square={true}
        sx={{
          boxShadow: '0px 4px 9px 4px rgba(0, 43, 85, 0.1)',
          borderRadius: '16px',
          width: '279px',
          fontWeight: 700,
          color: palette.text.primary,
          backgroundColor: palette.background.paper,
        }}
      >
        <AccordionSummary
          expandIcon={icon}
          aria-controls='panel1-content'
          id='panel1-header'
        >
          {isExpanded ? (
            <Typography
              fontSize={'14px'}
              fontWeight={'600'}
              lineHeight={'22px'}
              color={'#636B82'}
            >
              Seleziona una categoria:
            </Typography>
          ) : (
            <MobileWebinarCategoryButton
              key={-1}
              onClick={() => {
                return;
              }}
              isHeader={true}
              label={webinarCategories[selectedWebinarCategory].name}
              icon={
                webinarCategories[selectedWebinarCategory].icon.data.attributes
              }
            />
          )}
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <Stack
            component='section'
            direction={'column'}
            alignItems={'flex-start'}
          >
            {webinarCategories.map((category, index) => (
              <MobileWebinarCategoryButton
                key={index}
                onClick={() => {
                  setIsedExpanded(false);
                  setSelectedWebinarCategory(index);
                  return;
                }}
                label={category.name}
                icon={category.icon.data.attributes}
                isLast={index == webinarCategories.length - 1}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MobileWebinarCategorySelector;
