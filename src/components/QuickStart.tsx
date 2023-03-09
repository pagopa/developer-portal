import Card, { CardProps } from '@/components/Card';
import { Grid, Stack, Typography } from '@mui/material';

type QuickStartProps = {
  title: string;
  description: string;
  cards: ReadonlyArray<CardProps>;
};

const QuickStart = (props: QuickStartProps) => {
  return (
    <Stack spacing={2}>
      <Typography variant='h5' color='text.primary'>
        {props.title}
      </Typography>
      <Typography variant='body1'>{props.description}</Typography>
      <Grid container spacing={2}>
        {props.cards.map((card, index) => (
          <Grid xs={6} key={index}>
            <Card title={card.title} description={card.description} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default QuickStart;
