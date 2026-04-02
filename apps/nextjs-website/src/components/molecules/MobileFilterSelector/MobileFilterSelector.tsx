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
import MobileFilterButton from '@/components/atoms/MobileFilterButton/MobileFilterButton';
import { useTranslations } from 'next-intl';
import { Media } from '@/lib/types/media';

type MobileFilterSelectorProps = {
  selectedFilter: number;
  // eslint-disable-next-line functional/no-return-void
  setSelectedFilter: (selectedFilter: number) => void;
  selectorFilters: readonly {
    name: string;
    icon: Media;
  }[];
};

const MobileFilterSelector = ({
  selectedFilter,
  setSelectedFilter,
  selectorFilters,
}: MobileFilterSelectorProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const icon = isExpanded ? null : <ExpandMoreIcon />;
  return (
    <Box
      id={'filters'}
      sx={{
        backgroundColor: '#EBF4FD',
        paddingY: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '100%',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Accordion
        expanded={isExpanded}
        onChange={(event, expanded) => {
          setIsExpanded(expanded);
        }}
        square={true}
        sx={{
          boxShadow: '0px 4px 9px 4px rgba(0, 43, 85, 0.1)',
          borderRadius: '16px',
          width: '279px',
          paddingY: isExpanded ? 0 : '16px',
          fontWeight: 700,
          color: palette.text.primary,
          backgroundColor: palette.background.paper,
        }}
      >
        <AccordionSummary
          expandIcon={icon}
          sx={{
            height: isExpanded ? '64px' : '32px',
            minHeight: isExpanded ? '64px' : '32px',
          }}
          aria-controls='panel1-content'
          id='panel1-header'
        >
          {isExpanded ? (
            <Typography
              marginY={0}
              paddingLeft={'8px'}
              fontSize={'14px'}
              fontWeight={'600'}
              lineHeight={'22px'}
              color={'#636B82'}
            >
              {t('webinar.selectFilter')}
            </Typography>
          ) : (
            <MobileFilterButton
              key={-1}
              onClick={() => {
                return;
              }}
              isHeader={true}
              label={selectorFilters[selectedFilter].name}
              icon={selectorFilters[selectedFilter].icon}
            />
          )}
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <Stack
            component='section'
            direction={'column'}
            alignItems={'flex-start'}
          >
            {selectorFilters.map((category, index) => (
              <MobileFilterButton
                key={index}
                onClick={() => {
                  setIsExpanded(false);
                  setSelectedFilter(index);
                  return;
                }}
                label={category.name}
                icon={category.icon}
                isLast={index == selectorFilters.length - 1}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MobileFilterSelector;
