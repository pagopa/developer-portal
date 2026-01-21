import AccountBalance from '@mui/icons-material/AccountBalance';
import Approval from '@mui/icons-material/Approval';
import CreateRounded from '@mui/icons-material/CreateRounded';
import ExitToApp from '@mui/icons-material/ExitToApp';
import Feedback from '@mui/icons-material/Feedback';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import HeadsetMic from '@mui/icons-material/HeadsetMic';
import Instagram from '@mui/icons-material/Instagram';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LinkedIn from '@mui/icons-material/LinkedIn';
import LiveHelp from '@mui/icons-material/LiveHelp';
import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import MenuBook from '@mui/icons-material/MenuBook';
import MessageRounded from '@mui/icons-material/MessageRounded';
import Payment from '@mui/icons-material/Payment';
import PaymentsRounded from '@mui/icons-material/PaymentsRounded';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import QueryStats from '@mui/icons-material/QueryStats';
import Replay from '@mui/icons-material/Replay';
import TimerSharp from '@mui/icons-material/TimerSharp';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Twitter from '@mui/icons-material/Twitter';
import VpnKey from '@mui/icons-material/VpnKey';
import Code from '@mui/icons-material/Code';
import React from 'react';
import { SvgIcon, type SvgIconProps } from '@mui/material';
import { ChangeCircle, TimerOutlined } from '@mui/icons-material';

const MediumIcon = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    { ...props, viewBox: '0 0 1043.63 592.71' },
    React.createElement('path', {
      d: 'M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94',
    })
  );

export const ICON_MAP = {
  AccountBalance: AccountBalance,
  Approval: Approval,
  ChangeCircle: ChangeCircle,
  CreateRounded: CreateRounded,
  ExitToApp: ExitToApp,
  Feedback: Feedback,
  FlagOutlined: FlagOutlined,
  Code: Code,
  FolderOutlined: FolderOutlined,
  HeadsetMic: HeadsetMic,
  Instagram: Instagram,
  KeyboardArrowRightIcon: KeyboardArrowRightIcon,
  LinkedIn: LinkedIn,
  LiveHelp: LiveHelp,
  MarkEmailRead: MarkEmailRead,
  Medium: MediumIcon,
  MenuBook: MenuBook,
  MessageRounded: MessageRounded,
  Payment: Payment,
  PaymentsRounded: PaymentsRounded,
  PeopleAlt: PeopleAlt,
  QueryStats: QueryStats,
  Replay: Replay,
  TimerOutlined: TimerOutlined,
  TimerSharp: TimerSharp,
  TrendingUp: TrendingUp,
  Twitter: Twitter,
  VpnKey: VpnKey,
};
