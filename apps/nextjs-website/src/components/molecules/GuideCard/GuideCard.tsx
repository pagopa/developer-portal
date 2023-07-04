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
import LinkButton from '@/components/atoms/LinkButton/LinkButton';

type Description = {
  readonly listItems: ReadonlyArray<string>;
  readonly title: string;
};

export type GuideCardProps = {
  description: Description;
  imagePath: string;
  layout?: 'left' | 'center' | 'right';
  link: {
    label: string;
    href: string;
  };
  mobileImagePath: string;
  title: string;
};

export const GuideCard: FC<GuideCardProps> = ({
  description,
  imagePath,
  layout = 'center',
  link,
  mobileImagePath,
  title,
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', lg: '50%' },
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant='h6' mb={spacing(1.75)}>
                {title}
              </Typography>
              <Typography variant='subtitle2' color='text.primary'>
                {description.title}
              </Typography>
              <UnorderedList listItems={description?.listItems} />
            </Box>
            <LinkButton
              label={link.label}
              href={link.href}
              size={14}
            ></LinkButton>
          </CardContent>
        </Box>
        <CardMedia
          sx={{
            display: { xs: 'block', lg: 'none' },
            width: { xs: '100%', lg: '50%' },
          }}
          component='img'
          image={mobileImagePath}
          alt={title}
        />
        <CardMedia
          sx={{
            display: { xs: 'none', lg: 'block' },
            width: { xs: '100%', lg: '50%' },
          }}
          component='img'
          image={imagePath}
          alt={title}
        />
      </Card>
    </Stack>
  );
};
