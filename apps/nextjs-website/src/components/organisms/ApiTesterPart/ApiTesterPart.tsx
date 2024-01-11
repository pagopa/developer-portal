'use client';
import React, { useState } from 'react';
import { Box, Stack, useTheme } from '@mui/material';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import { Part } from '@/lib/types/part';
import PartRenderer from '@/components/molecules/PartRenderer/PartRenderer';
import Button from '@mui/material/Button';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { useTranslations } from 'next-intl';

type ApiPhaseDescription = {
  code: string;
  language: string;
  parts: Part[];
};

export type ApiTesterPartProps = {
  apiRequest: ApiPhaseDescription;
  apiResponse: ApiPhaseDescription;
};

const ApiTesterPart = ({ apiRequest, apiResponse }: ApiTesterPartProps) => {
  const { spacing, palette } = useTheme();
  const [isLifeCycleCallPhase, setIsLifeCycleCallPhase] = useState(true);
  const t = useTranslations('quickStartGuide.content.apiPhases');
  const boxBorder = `1px solid ${palette.grey[300]}`;
  const parts = isLifeCycleCallPhase ? apiRequest.parts : apiResponse.parts;

  return (
    <Box
      sx={{
        alignItems: 'stretch',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        marginBottom: spacing(5),
        position: 'relative',
      }}
    >
      <Box
        sx={{
          borderLeft: boxBorder,
          borderRight: { xs: boxBorder, md: 'none' },
          borderTop: boxBorder,
          borderBottom: { xs: 'none', md: boxBorder },
          borderRadius: { xs: '6px 6px 0 0', md: '6px 0 0 6px' },
          padding: spacing(3),
        }}
      >
        <Stack width={{ xs: 'auto', md: '200px' }}>
          {parts.map((part, index) => (
            <PartRenderer key={index} part={part} />
          ))}
          {isLifeCycleCallPhase ? (
            <Button
              onClick={() => setIsLifeCycleCallPhase(!isLifeCycleCallPhase)}
              variant='contained'
            >
              {t('request.cta.label')}
            </Button>
          ) : (
            <Button
              onClick={() => setIsLifeCycleCallPhase(!isLifeCycleCallPhase)}
              style={{
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                spacing={2}
              >
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  sx={{ lineHeight: '0.5', marginRight: spacing(1.5) }}
                >
                  <IconWrapper
                    color={palette.primary.main}
                    size={20}
                    icon={t('response.cta.icon')}
                  />
                </Box>
                {t('response.cta.label')}
              </Stack>
            </Button>
          )}
        </Stack>
      </Box>
      <CodeBlockPart
        code={isLifeCycleCallPhase ? apiRequest.code : apiResponse.code}
        language={
          isLifeCycleCallPhase ? apiRequest.language : apiResponse.language
        }
        mode='dark'
        title={t(isLifeCycleCallPhase ? 'request.title' : 'response.title')}
      />
    </Box>
  );
};

export default ApiTesterPart;
