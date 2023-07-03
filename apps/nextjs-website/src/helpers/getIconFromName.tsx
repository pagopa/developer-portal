import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FeedbackIcon from '@mui/icons-material/Feedback';

export type IconName = 'HeadsetMic' | 'Feedback';

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
    return <HeadsetMicIcon sx={{ color: fill, fontSize: size }} />;
  if (type === 'Feedback')
    return <FeedbackIcon sx={{ color: fill, fontSize: size }} />;
  return <></>;
};
