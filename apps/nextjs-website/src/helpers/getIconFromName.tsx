import { HeadsetMic } from '@mui/icons-material';

export type IconName = 'HeadsetMic';

type IconFromNameParams = {
  type: IconName;
  fill: string;
  size: number;
};

export const getIconFromName = ({
  type,
  fill = 'black',
  size = 12,
}: IconFromNameParams) => {
  if (type === 'HeadsetMic')
    return <HeadsetMic sx={{ color: fill, fontSize: size }} />;
  return <></>;
};
