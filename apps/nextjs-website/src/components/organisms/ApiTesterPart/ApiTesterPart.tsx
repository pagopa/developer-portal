'use client';
import React, { useState } from 'react';
import { Box, Stack, useTheme } from '@mui/material';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import Button from '@mui/material/Button';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { useTranslations } from 'next-intl';
import TypographyPart from '@/components/atoms/TypographyPart/TypographyPart';

type ApiPhaseDescription = {
  code: string;
  language?: string;
  description: string;
  attributes?: {
    label?: string;
    value: string;
  }[];
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
  const { attributes, description } = isLifeCycleCallPhase
    ? apiRequest
    : apiResponse;

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
          <Box flexDirection={'column'} display={'flex'}>
            <TypographyPart variant='body2' text={description} asHtml={true} />
            {attributes?.map((attribute, index) => (
              <div key={index}>
                {attribute.label && (
                  <TypographyPart
                    fontSize={'12px'}
                    sx={{ marginBottom: '0' }}
                    color={palette.text.secondary}
                    variant={'subtitle1'}
                    text={attribute.label}
                  />
                )}
                <TypographyPart
                  fontSize={'16px'}
                  fontWeight={'600'}
                  text={attribute.value}
                  asHtml={true}
                />
              </div>
            ))}
          </Box>
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
                    useSrc={false}
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
