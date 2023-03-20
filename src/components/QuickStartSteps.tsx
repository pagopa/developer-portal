import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import Box from '@mui/material/Box';
import CodeIcon from '@mui/icons-material/Code';
import { Expand } from '@mui/icons-material';

const QuickStartStep = () => (
  <Stack>
    <Typography variant='caption' color='primary.dark' alignSelf='flex-start'>
      03
    </Typography>
    <Typography variant='h5'>Recupera il Codice Fiscale dell'utente</Typography>
    <Typography variant='body2'>
      Recupera l'ID del Cittadino effettuando una chiamata all'endpoint
    </Typography>
    <Typography variant='monospaced'>POST /api/v1/sign/signers</Typography>
    <Typography variant='body2'>
      specificando nella chiamata il Codice Fiscale dell'utente Il server ti
      restituirà l’ID del cittadino che ti servirà nel prossimo passaggio.
    </Typography>
    <Accordion>
      <AccordionSummary
        expandIcon={<Expand />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>Nascondi esempio</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Card
          raised
          sx={{
            textAlign: 'center',
            py: 6,
          }}
          key={0}
        >
          <CardContent>
            <Box>
              <CodeIcon color='primary' sx={{ fontSize: 60 }} />
            </Box>
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  </Stack>
);

const QuickStartSteps = () => (
  <Stack>
    <QuickStartStep />
  </Stack>
);

export default QuickStartSteps;
