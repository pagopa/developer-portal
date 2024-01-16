import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { translations } from '@/_contents/translations';
import { useTheme } from '@mui/material';

export type GuideVersionSelectorProps = {
  versionName: string;
  versions: { name: string; path: string }[];
};

const GuideVersionSelector = ({
  versionName,
  versions,
}: GuideVersionSelectorProps) => {
  const { palette } = useTheme();
  const { shared } = translations;
  return (
    <Dropdown
      label={`${shared.version} ${versionName}`}
      items={versions.map((version) => ({
        href: version.path,
        label: version.name,
      }))}
      icons={{ opened: <ExpandLess />, closed: <ExpandMore /> }}
      buttonStyle={{
        color: palette.action.active,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 32px',
      }}
      menuStyle={{
        style: {
          width: '347px',
          maxWidth: '347px',
          left: 0,
          right: 0,
        },
      }}
      menuAnchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    />
  );
};

export default GuideVersionSelector;
