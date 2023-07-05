import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FeedbackIcon from '@mui/icons-material/Feedback';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TimerSharpIcon from '@mui/icons-material/TimerSharp';
import ApprovalIcon from '@mui/icons-material/Approval';

export type IconName =
  | 'HeadsetMic'
  | 'Feedback'
  | 'MarkEmailRead'
  | 'QueryStats'
  | 'TimerSharp'
  | 'Approval';

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
  switch (type) {
    case 'HeadsetMic':
      return <HeadsetMicIcon sx={{ color: fill, fontSize: size }} />;
    case 'Feedback':
      return <FeedbackIcon sx={{ color: fill, fontSize: size }} />;
    case 'MarkEmailRead':
      return <MarkEmailReadIcon sx={{ color: fill, fontSize: size }} />;
    case 'QueryStats':
      return <QueryStatsIcon sx={{ color: fill, fontSize: size }} />;
    case 'TimerSharp':
      return <TimerSharpIcon sx={{ color: fill, fontSize: size }} />;
    case 'Approval':
      return <ApprovalIcon sx={{ color: fill, fontSize: size }} />;
    default:
      return <></>;
  }
};
