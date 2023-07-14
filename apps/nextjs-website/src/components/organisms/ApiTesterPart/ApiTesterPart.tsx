import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import { Part } from '@/lib/types/part';
import PartRenderer from '@/components/molecules/PartRenderer/PartRenderer';
import Button from '@mui/material/Button';
import { translations } from '@/_contents/translations';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';

type ApiPhaseDescription = {
  code: string;
  language: string;
  parts: Part[];
};

export type ApiTesterPartProps = {
  apiCall: ApiPhaseDescription;
  apiResponse: ApiPhaseDescription;
};

const ApiTesterPart = ({ apiCall, apiResponse }: ApiTesterPartProps) => {
  const { palette, spacing } = useTheme();
  const [isLifeCycleCallPhase, setIsLifeCycleCallPhase] = useState(true);
  const { quickStartGuide } = translations;

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
          borderLeft: '1px solid #DCDCDC',
          borderRight: { xs: '1px solid #DCDCDC', md: 'none' },
          borderTop: '1px solid #DCDCDC',
          borderBottom: { xs: 'none', md: '1px solid #DCDCDC' },
          borderRadius: { xs: '6px 6px 0 0', md: '6px 0 0 6px' },
          display: 'flex',
          flexDirection: 'column',
          padding: spacing(3),
        }}
      >
        {(isLifeCycleCallPhase ? apiCall.parts : apiResponse.parts).map(
          (part: Part, index: number) => (
            <PartRenderer key={index} part={part} />
          )
        )}
        {isLifeCycleCallPhase ? (
          <Button
            onClick={() => setIsLifeCycleCallPhase(!isLifeCycleCallPhase)}
            variant='contained'
          >
            {quickStartGuide.content.apiPhases.call.cta.label}
          </Button>
        ) : (
          <Button
            onClick={() => setIsLifeCycleCallPhase(!isLifeCycleCallPhase)}
          >
            <IconWrapper
              color={'#0073E6'}
              size={26}
              icon={quickStartGuide.content.apiPhases.response.cta.icon}
            />
            {quickStartGuide.content.apiPhases.response.cta.label}
          </Button>
        )}
      </Box>
      <CodeBlockPart
        code={isLifeCycleCallPhase ? apiCall.code : apiResponse.code}
        language={
          isLifeCycleCallPhase ? apiCall.language : apiResponse.language
        }
        mode='dark'
        title={isLifeCycleCallPhase ? 'Chiamata' : 'Risposta'}
      ></CodeBlockPart>
    </Box>
  );
};

export default ApiTesterPart;
