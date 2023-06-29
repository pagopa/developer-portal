import { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { UnorderedList } from '@/components/atoms/UnorderedList/UnorderedList';
import { LinkButton, LinkButtonProps } from '@/components/atoms/NavigateButton/LinkButton';

type Description = {
  readonly listItems: ReadonlyArray<string>;
  readonly title: string;
};

export type GuideCardProps = {
  description: Description;
  link: LinkButtonProps;
  imagePath: string;
  layout?: 'left' | 'center' | 'right';
  title: string;
};

export const GuideCard: FC<GuideCardProps> = ({
  description,
  link,
  imagePath,
  title,
  layout = 'center',
}: GuideCardProps) => {
  const { spacing } = useTheme();

  const flexLayoutMap = {
    center: 'center',
    right: 'flex-end',
    left: 'flex-start',
  };

  return (
    <Stack
      py={spacing(0)}
      width='100%'
      justifyContent='center'
      alignItems={flexLayoutMap[layout]}
    >
      <Card
        raised
        sx={{
          borderRadius: 4,
          display: 'flex',
          flexDirection: { xs: 'column-reverse', lg: 'row' },
          marginBottom: 10,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <CardContent>
            <Typography variant='h6' mb={spacing(1.75)}>
              {title}
            </Typography>
            <Typography variant='subtitle2' color='text.primary'>
              {description.title}
            </Typography>
            <UnorderedList listItems={description?.listItems} />
            <LinkButton {...link}></LinkButton>
          </CardContent>
        </Box>
        <CardMedia component='img' image={imagePath} alt={title} />
      </Card>
    </Stack>
  );
};
