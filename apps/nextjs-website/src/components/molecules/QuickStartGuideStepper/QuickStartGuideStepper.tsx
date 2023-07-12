import React, { ReactNode } from 'react';
import { Step } from '@/lib/types/step';
import { Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Part } from '@/lib/types/part';
import PartRenderer from '@/components/molecules/PartRenderer/PartRenderer';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import TabSwitcherProvider, {
  Tab,
  TabPanel,
} from '@/components/organisms/TabSwitcherProvider/TabSwitcherProvider';
import GoToStep from '@/components/molecules/GoToStep/GoToStep';

type QuickStartGuideStepperProps = {
  readonly defaultStepAnchor?: string;
  readonly steps?: ReadonlyArray<Step>;
};

const QuickStartGuideStepper = ({
  defaultStepAnchor,
  steps,
}: QuickStartGuideStepperProps): ReactNode | null => {
  const { spacing } = useTheme();

  return (
    <EContainer sx={{ paddingBottom: spacing(5) }}>
      <TabSwitcherProvider defaultActiveTabID={defaultStepAnchor}>
        <Box
          sx={{
            display: 'flex',
            gap: '40px',
            verticalAlign: 'start',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
            }}
          >
            {steps?.map((step, index) => (
              <Tab key={index} id={step.anchor}>
                <Box
                  sx={{
                    textDecoration: 'none',
                    padding: '16px 32px',
                    width: '354px',
                    verticalAlign: 'middle',
                  }}
                >
                  <Typography
                    component='span'
                    sx={{
                      fontSize: '18px',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textDecoration: 'none',
                      textOverflow: 'ellipsis',
                      textWrap: 'nowrap',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.anchor} - {step.title}
                  </Typography>
                </Box>
              </Tab>
            ))}
          </Box>

          {steps?.map((step, index) => (
            <TabPanel key={index} whenActive={step.anchor}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <>
                  <Typography
                    sx={{
                      color: '#0062C3',
                      fontSize: '18px',
                      fontWeight: 600,
                      marginBottom: '24px',
                    }}
                  >
                    {step.anchor}
                  </Typography>
                  {step.parts.map((part: Part, index: number) => (
                    <PartRenderer key={index} part={part} />
                  ))}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: index ? 'space-between' : 'flex-end',
                      marginTop: '40px',
                    }}
                  >
                    {index - 1 >= 0 ? (
                      <Tab key={index} id={steps[index - 1].anchor}>
                        <GoToStep
                          previousOrNext='previous'
                          title={`${steps[index - 1].anchor} - ${
                            steps[index - 1].title
                          }`}
                        />
                      </Tab>
                    ) : null}
                    {index + 1 < steps?.length ? (
                      <Tab key={index} id={steps[index + 1].anchor}>
                        <GoToStep
                          previousOrNext='next'
                          title={`${steps[index + 1].anchor} - ${
                            steps[index + 1].title
                          }`}
                        />
                      </Tab>
                    ) : null}
                  </Box>
                </>
              </Box>
            </TabPanel>
          ))}
        </Box>
      </TabSwitcherProvider>
    </EContainer>
  );
};

export default QuickStartGuideStepper;
