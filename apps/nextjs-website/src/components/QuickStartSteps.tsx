import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
  Button,
  Paper,
  Grid,
  Container,
  TextField,
  Box,
} from '@mui/material';
import { Expand } from '@mui/icons-material';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import {
  QuickStartBlock,
  QuickStartExample,
  QuickStartElement,
} from '@/domain/pageBlock';

const QuickStartElement = (props: QuickStartElement) => {
  switch (props.type) {
    case 'paragraph':
      return <Typography variant='body2'>{props.text}</Typography>;
    case 'inline-code':
      return (
        <Paper sx={{ backgroundColor: 'background.default', p: 2 }}>
          <Typography variant='monospaced'>{props.text}</Typography>
        </Paper>
      );
    case 'code-block':
      return (
        <Paper
          variant='outlined'
          sx={{ backgroundColor: 'background.code', height: '100%' }}
        >
          <Stack spacing={3} sx={{ p: 6 }}>
            <Typography variant='h6' color={'primary.contrastText'}>
              {props.title}
            </Typography>
            <Typography variant='monospaced' color={'primary.contrastText'}>
              <pre>{JSON.stringify(JSON.parse(props.text), null, 2)}</pre>
            </Typography>
          </Stack>
        </Paper>
      );
  }
};

const QuickStartExample = (props: QuickStartExample) => (
  <Box>
    <Accordion defaultExpanded={true} sx={{ p: 0, m: 0 }}>
      <AccordionSummary sx={{ p: 0 }}>
        <Button
          startIcon={<Expand />}
          sx={{ p: 0 }}
        >{`Nascondi esempio`}</Button>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Paper variant='outlined'>
          <Grid container alignItems='stretch'>
            <Grid item xs>
              <Stack spacing={3} sx={{ p: 6 }}>
                <Typography variant='h6'>{props.title}</Typography>
                {pipe(
                  props.fields,
                  RA.mapWithIndex((i, field) => (
                    <TextField
                      key={i}
                      type={'text'}
                      label={field.description}
                      value={field.value}
                      variant='standard'
                      InputProps={{
                        readOnly: true,
                        disableUnderline: true,
                      }}
                    />
                  ))
                )}
              </Stack>
            </Grid>
            <Grid item xs>
              <QuickStartElement
                type={'code-block'}
                title={props.request.title}
                text={props.request.body}
              />
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  </Box>
);

const QuickStartSteps = (props: QuickStartBlock) => (
  <Container maxWidth='xl'>
    <Stack spacing={6} sx={{ py: 10 }}>
      {pipe(
        props.steps,
        RA.mapWithIndex((i, step) => (
          <Stack spacing={2}>
            <Typography variant='h6' color='primary.dark'>
              {(i + 1).toString().padStart(2, '0')}{' '}
            </Typography>
            <Typography variant='h5'>{step.title}</Typography>
            {pipe(
              step.description,
              RA.map((element) => QuickStartElement(element))
            )}
            {step.example && <QuickStartExample {...step.example} />}
          </Stack>
        ))
      )}
    </Stack>
  </Container>
);

export default QuickStartSteps;
