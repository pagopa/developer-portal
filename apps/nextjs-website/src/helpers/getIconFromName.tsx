import { HeadsetMic } from '@mui/icons-material';

export type IconName = 'HeadsetMic';

export const getIconFromIconName = (type: IconName, fill = 'white') => {
  if (type === 'HeadsetMic') return <HeadsetMic sx={{ color: fill }} />;
};
