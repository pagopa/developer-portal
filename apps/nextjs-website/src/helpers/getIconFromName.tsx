import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TimerSharpIcon from '@mui/icons-material/TimerSharp';
import ApprovalIcon from '@mui/icons-material/Approval';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export type IconName =
  | 'HeadsetMic'
  | 'Feedback'
  | 'LiveHelp'
  | 'MarkEmailRead'
  | 'QueryStats'
  | 'TimerSharp'
  | 'Approval'
  | 'AccountBalance'
  | 'Payment'
  | 'PeopleAlt'
  | 'TrendingUp';

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
    case 'LiveHelp':
      return <LiveHelpIcon sx={{ color: fill, fontSize: size }} />;
    case 'MarkEmailRead':
      return <MarkEmailReadIcon sx={{ color: fill, fontSize: size }} />;
    case 'QueryStats':
      return <QueryStatsIcon sx={{ color: fill, fontSize: size }} />;
    case 'TimerSharp':
      return <TimerSharpIcon sx={{ color: fill, fontSize: size }} />;
    case 'Approval':
      return <ApprovalIcon sx={{ color: fill, fontSize: size }} />;
    case 'AccountBalance':
      return <AccountBalanceIcon sx={{ color: fill, fontSize: size }} />;
    case 'Payment':
      return <PaymentIcon sx={{ color: fill, fontSize: size }} />;
    case 'PeopleAlt':
      return <PeopleAltIcon sx={{ color: fill, fontSize: size }} />;
    case 'TrendingUp':
      return <TrendingUpIcon sx={{ color: fill, fontSize: size }} />;
    default:
      return <></>;
  }
};
