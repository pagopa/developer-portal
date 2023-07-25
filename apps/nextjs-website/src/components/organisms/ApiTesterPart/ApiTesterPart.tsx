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
  apiRequest: ApiPhaseDescription;
  apiResponse: ApiPhaseDescription;
};

const ApiTesterPart = ({ apiRequest, apiResponse }: ApiTesterPartProps) => {
  const { spacing, palette } = useTheme();
  const [isLifeCycleCallPhase, setIsLifeCycleCallPhase] = useState(true);
  const { quickStartGuide } = translations;
  const boxBorder = `1px solid #DCDCDC`;

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
        {(isLifeCycleCallPhase ? apiRequest.parts : apiResponse.parts).map(
          (part: Part, index: number) => (
            <PartRenderer key={index} part={part} />
          )
        )}
        {isLifeCycleCallPhase ? (
          <Button
            onClick={() => setIsLifeCycleCallPhase(!isLifeCycleCallPhase)}
            variant='contained'
          >
            {quickStartGuide.content.apiPhases.request.cta.label}
          </Button>
        ) : (
          <Button
            onClick={() => setIsLifeCycleCallPhase(!isLifeCycleCallPhase)}
          >
            <Box sx={{ lineHeight: '0.5', marginRight: spacing(1.5) }}>
              <IconWrapper
                color={palette.primary.main}
                size={20}
                icon={quickStartGuide.content.apiPhases.response.cta.icon}
              />
            </Box>
            {quickStartGuide.content.apiPhases.response.cta.label}
          </Button>
        )}
      </Box>
      <CodeBlockPart
        code={isLifeCycleCallPhase ? apiRequest.code : apiResponse.code}
        language={
          isLifeCycleCallPhase ? apiRequest.language : apiResponse.language
        }
        mode='dark'
        title={
          isLifeCycleCallPhase
            ? quickStartGuide.content.apiPhases.request.title
            : quickStartGuide.content.apiPhases.response.title
        }
      ></CodeBlockPart>
    </Box>
  );
};

export default ApiTesterPart;
